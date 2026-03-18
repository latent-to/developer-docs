---
title: "Network Egress Hardening for Bittensor Workstations"
---

import { SecurityWarning } from "./_security-warning.mdx";

# Network Egress Hardening for Bittensor Workstations

This guide covers configuring a Bittensor workstation — whether a cloud server running miners and validators, or a personal computer handling coldkey operations — so that even a compromised Python package cannot exfiltrate key material. The mechanism: the host can only reach an explicit allowlist of domains; any other outbound connection is dropped at the firewall before it reaches the network.

:::tip
This egress control approach was developed and documented by **Berzeck**, a Bittensor community member.
:::


**Mac users:** the steps below are for OpenSUSE Leap running natively or in a VM. See [Running in a hardened VM on macOS](#running-in-a-hardened-vm-on-macos) at the bottom of this page for how to set up the VM before following these steps.

See also:

- [Coldkey and Hotkey Workstation Security](./coldkey-hotkey-security)
- [Handle your Seed Phrase/Mnemonic Securely](./handle-seed-phrase)
- [Bittensor CLI: Permissions Guide](../btcli/btcli-permissions)

<SecurityWarning />

## Threat model: supply chain attacks

A supply chain attack in the Python ecosystem works as follows:

1. An attacker injects malicious code into a wallet client or one of its dependencies — by compromising an upstream package on PyPI, or by publishing a near-identical package under a slightly different name.
2. The malicious code executes silently alongside the legitimate functionality.
3. When the victim unlocks their wallet, the code reads the decrypted private key from memory or disk and transmits it to attacker-controlled infrastructure over HTTPS.

Bittensor was the target of exactly this type of attack. The malicious code exfiltrated plaintext private keys to a small set of attacker-controlled domains. On-chain analysis of the attacker's wallet shows the largest individual theft events in March–April 2025 — single transfers of 65,000 TAO and 31,000 TAO to the attacker's float account.

:::tip
If the infected host cannot establish outbound connections to those domains, the exfiltration fails. The attacker has the key material in memory but no channel to receive it.
:::

### Coldkeys vs hotkeys

The consequences differ significantly depending on which key is leaked:

- **Coldkey leak**: the attacker can steal your entire TAO and alpha balance and take other irreversible actions. This is the worst-case outcome — see [Rotating your coldkey](./coldkey-hotkey-security#rotating-your-coldkey).
- **Hotkey leak**: the attacker cannot directly steal your TAO balance, but can submit invalid weights (damaging your validator's reputation and emissions), serve malicious responses as a miner, or disrupt subnet operations. Serious, but recoverable via [hotkey rotation](./coldkey-hotkey-security#hotkey-rotation).

Egress hardening is worth doing for both. Hotkey servers in particular are often running complex, dependency-heavy ML stacks — exactly the environment where a supply chain compromise is most likely to slip in unnoticed.

:::warning Egress control is a backstop, not a substitute for dependency hygiene

This does not prevent a malicious package from installing or executing. You should also:

- Pin exact versions and verify SHA-256 hashes with `pip install --require-hashes`
- Monitor security announcements for the Bittensor ecosystem
- Keep your operating system and packages updated
- Follow all guidance in [Coldkey and Hotkey Workstation Security](./coldkey-hotkey-security)

:::

## Architecture

The setup uses three components:

| Component | Role |
|---|---|
| **Squid** | HTTP forward proxy on `127.0.0.1:3128`. All outbound HTTP/HTTPS traffic routes through it and is filtered against a domain allowlist. |
| **firewalld** | Host firewall. Blocks all direct outbound connections. Only Squid's own process — matched by Unix UID — may reach the internet. Explicitly permits: loopback, SSH inbound, DNS to specific resolvers, NTP, DHCP. |
| **proxychains-ng** | Forces `btcli` and other tools through the proxy even if they don't natively support proxy configuration or override proxy environment variables. |

The packet path for `btcli`:

```
btcli → proxychains4 → Squid (127.0.0.1:3128) → [domain check] → internet
                                                       ↓ not on allowlist
                                                   DROP (firewalld)
```

Any direct outbound connection — from malicious code running as any user, or any tool not routed through proxychains — hits the `DROP` rule and never leaves the machine.

## Setup

These steps are for **OpenSUSE Leap 15.6**, which is what the original configuration was developed and tested on.

### Step 1 — Prerequisites

```shell
systemctl enable --now firewalld  # enable firewalld to start on boot AND start it immediately
zypper refresh                    # update package repository metadata (zypper = OpenSUSE's package manager)
```

### Step 2 — Squid: install and configure the allowlist

```shell
# squid: forward proxy daemon that filters all outbound traffic against a domain allowlist
zypper install -y squid
```

```shell
cat > /etc/squid/squid.conf <<'EOF'
visible_hostname bittensor-node   # hostname shown in Squid error pages; arbitrary value
http_port 127.0.0.1:3128          # bind to loopback only — Squid is NOT reachable from outside the machine
via off                           # suppress the Via: HTTP header that identifies this as a proxy
forwarded_for delete              # strip X-Forwarded-For; prevents destination servers seeing the real client IP
pinger_enable off                 # disable Squid's ICMP health pinger; reduces attack surface

# Adjust mirror domains to match your repos — check /etc/zypp/repos.d/*.repo
# Leading dot matches the domain and all subdomains (.pypi.org matches files.pypi.org, etc.)
acl allowed_domains dstdomain \
    .pypi.org \
    .pythonhosted.org \
    .opensuse.org \
    .opentensor.ai \
    .github.com \
    .githubusercontent.com \
    .opensuse.net.br \
    .ufpr.br \
    .usp.br \
    .uepg.br \
    .cedia.org.ec

# allowed_tls_sni: matches HTTPS CONNECT tunnels by TLS SNI field (inspected before decryption)
# Must mirror allowed_domains exactly — HTTPS traffic requires both ACLs to pass
acl allowed_tls_sni ssl::server_name \
    .pypi.org \
    .pythonhosted.org \
    .opensuse.org \
    .opentensor.ai \
    .github.com \
    .githubusercontent.com \
    .opensuse.net.br \
    .ufpr.br \
    .usp.br \
    .uepg.br \
    .cedia.org.ec

# port 443 = standard HTTPS; port 9944 = Substrate WebSocket RPC used by btcli to reach chain nodes
acl SSL_ports port 443 9944
http_access deny CONNECT !SSL_ports   # block CONNECT tunnels to any non-SSL port (prevents port abuse)
http_access allow allowed_domains     # allow plain HTTP to allowlisted domains
http_access allow CONNECT allowed_tls_sni  # allow HTTPS tunnels to allowlisted domains (matched by SNI)
http_access deny all                  # default-deny: reject everything not matched above
EOF
```

```shell
mkdir -p /var/cache/squid /var/log/squid              # create cache and log dirs if absent
chown -R squid:squid /var/cache/squid /var/log/squid  # squid process must own these dirs to write logs and cache
squid -k parse && squid -z                            # validate config syntax, then initialize cache directory structure
                                                      # squid -z creates internal swap dirs; must run before first start
systemctl enable --now squid                          # enable on boot and start now
```

Sanity check (`400 Bad Request` confirms Squid is listening):

```shell
ss -lntp | grep 3128       # list listening TCP sockets; confirm squid is bound to :3128
curl -I http://127.0.0.1:3128  # direct request to Squid with no Host header; '400 Bad Request' = Squid is up
```

After future config changes: `squid -k parse && systemctl reload squid`

### Step 3 — firewalld: force egress through Squid

```shell
# --permanent writes to persistent config (survives reloads); without it, changes are runtime-only and lost on reload
# Allow SSH via the firewalld service abstraction (belt-and-suspenders alongside the direct rule below)
firewall-cmd --permanent --add-service=ssh

# --direct rules write raw iptables rules, bypassing firewalld's zone abstraction for fine-grained control
# filter INPUT/OUTPUT = standard netfilter chains; priority 0 = evaluated first within that chain
# Allow SSH inbound (TCP port 22) for both IPv4 and IPv6
firewall-cmd --permanent --direct --add-rule ipv4 filter INPUT 0 -p tcp --dport 22 -j ACCEPT
firewall-cmd --permanent --direct --add-rule ipv6 filter INPUT 0 -p tcp --dport 22 -j ACCEPT

# Allow outbound packets for already-established connections (TCP response packets, related traffic like ICMP errors)
# -m conntrack --ctstate: connection tracking; ESTABLISHED = reply to a session we opened; RELATED = associated flows
# Without this rule, Squid's outbound TCP sessions would have their return packets dropped
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
firewall-cmd --permanent --direct --add-rule ipv6 filter OUTPUT 0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow all loopback traffic (-i lo = inbound on loopback interface; -o lo = outbound on loopback)
# Required for proxychains, pip, and other tools to connect to Squid on 127.0.0.1:3128
firewall-cmd --permanent --direct --add-rule ipv4 filter INPUT  0 -i lo -j ACCEPT
firewall-cmd --permanent --direct --add-rule ipv6 filter INPUT  0 -i lo -j ACCEPT
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 0 -o lo -j ACCEPT

# Explicitly allow outbound connections to Squid on localhost (belt-and-suspenders with the loopback rules above)
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 0 -d 127.0.0.1 -p tcp --dport 3128 -j ACCEPT

# Allow DNS outbound to specific resolvers only (8.8.8.8 = Google, 1.1.1.1 = Cloudflare)
# Both UDP (primary protocol) and TCP (fallback for large responses / zone transfers) variants
# Pinning to named resolvers reduces DNS tunneling risk vs allowing all outbound DNS traffic
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 0 -p udp -d 8.8.8.8 --dport 53 -j ACCEPT
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 0 -p tcp -d 8.8.8.8 --dport 53 -j ACCEPT
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 0 -p udp -d 1.1.1.1 --dport 53 -j ACCEPT
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 0 -p tcp -d 1.1.1.1 --dport 53 -j ACCEPT

# Allow DHCP: --sport 68 --dport 67 = client-to-server (discover/request); --sport 67 --dport 68 = server-to-client (offer/ack)
# Required for the machine to obtain its IP address from the router or hypervisor
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 0 -p udp --sport 68 --dport 67 -j ACCEPT
firewall-cmd --permanent --direct --add-rule ipv4 filter INPUT  0 -p udp --sport 67 --dport 68 -j ACCEPT

# Only Squid's process UID may make direct outbound connections
# id -u squid: resolves the squid service account's numeric UID at rule-write time (system-assigned integer)
SQUID_UID=$(id -u squid)
# -m owner --uid-owner: iptables owner match module; matches only packets from processes running as this UID
# Priority 5: evaluated after the priority-0 rules above, but before the DROP at priority 100
# port 80 (HTTP), 443 (HTTPS), 9944 (Substrate WebSocket RPC — how btcli communicates with chain nodes)
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 5 -m owner --uid-owner $SQUID_UID -p tcp --dport 80   -j ACCEPT
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 5 -m owner --uid-owner $SQUID_UID -p tcp --dport 443  -j ACCEPT
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 5 -m owner --uid-owner $SQUID_UID -p tcp --dport 9944 -j ACCEPT

# Allow NTP outbound (UDP port 123) for clock synchronization
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 0 -p udp --dport 123 -j ACCEPT

# Default-deny: silently drop all other outbound traffic not matched by any rule above
# Priority 100 = evaluated last; -j DROP = silently discard (vs -j REJECT which sends an ICMP error back)
firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 100 -j DROP
firewall-cmd --permanent --direct --add-rule ipv6 filter OUTPUT 100 -j DROP

# Set the default zone to drop all unclassified interface traffic, then apply permanent config to runtime
firewall-cmd --set-default-zone=drop
firewall-cmd --reload
```

:::warning The UID-owner rule is the critical enforcement point

Only the process running as the `squid` service user may make direct outbound TCP connections. Any other process — malicious code running as root, as the normal user, as anything — hits the `OUTPUT 100 -j DROP` rule. Verify with `ps aux | grep squid` that Squid is running under the expected user.

:::

### Step 4 — zypper proxy

```shell
# Idempotent: only append the proxy line if it isn't already present
grep -q '^proxy=http://127.0.0.1:3128' /etc/zypp/zypp.conf || \
  echo 'proxy=http://127.0.0.1:3128' >> /etc/zypp/zypp.conf

# Disable delta RPM downloads — deltarpm fetches partial binary diffs requiring local reassembly,
# which can produce corrupt packages or fail silently when routed through a proxy
# Handles both cases: updating an existing setting and adding it if absent
if grep -q '^ *download.use_deltarpm' /etc/zypp/zypp.conf; then
  sed -i 's/^ *download\.use_deltarpm.*/download.use_deltarpm = false/' /etc/zypp/zypp.conf
else
  echo 'download.use_deltarpm = false' >> /etc/zypp/zypp.conf
fi

REL="15.6"  # OpenSUSE Leap version; update this if upgrading the OS
# Remove the default repos before re-adding; 2>/dev/null suppresses errors if an alias doesn't exist
# || true prevents the command from failing if none of these repos are currently registered
zypper rr repo-oss repo-non-oss repo-update repo-update-non-oss \
  repo-backports-update repo-sle-update 2>/dev/null || true
# Re-add repos with explicit full URLs so they match the domain patterns in the Squid allowlist
# zypper ar: add repository; -f: enable automatic metadata refresh
zypper ar -f "https://download.opensuse.org/distribution/leap/${REL}/repo/oss/"     repo-oss
zypper ar -f "https://download.opensuse.org/distribution/leap/${REL}/repo/non-oss/" repo-non-oss
zypper ar -f "https://download.opensuse.org/update/leap/${REL}/oss/"                 repo-update
zypper ar -f "https://download.opensuse.org/update/leap/${REL}/non-oss/"             repo-update-non-oss
zypper ar -f "https://download.opensuse.org/update/leap/${REL}/backports/"           repo-backports-update
zypper ar -f "https://download.opensuse.org/update/leap/${REL}/sle/"                 repo-sle-update
zypper -vvv refresh  # -vvv: verbose; confirms the proxy is being used and all repos are reachable
```

### Step 5 — proxychains, pip, git, btcli wrapper

```shell
# proxychains-ng: intercepts outbound TCP connections from tools that don't natively support
# proxy config (or that override proxy env vars) and forces them through Squid
zypper install -y proxychains-ng

cat > /etc/proxychains.conf <<'EOF'
strict_chain    # fail if the proxy is unreachable; do NOT fall back to a direct connection
proxy_dns       # resolve hostnames through the proxy instead of locally — prevents DNS leaks
                # where the destination hostname would be visible to local network monitors
                # TODO: verify exactly how Squid handles DNS resolution for CONNECT tunnels in this mode

[ProxyList]
http 127.0.0.1 3128  # route all proxied connections through Squid on localhost port 3128
EOF

cat > /etc/pip.conf <<'EOF'
[global]
proxy = http://127.0.0.1:3128  # route all pip install / pip download traffic through Squid
EOF

# btcli wrapper: forces btcli through proxychains without relying on env vars alone
cat > /usr/local/bin/btc <<'EOF'
#!/usr/bin/env bash
# Unset proxy env vars before exec to prevent a double-proxy loop:
# if http_proxy is already set AND proxychains is active, btcli would proxy to Squid,
# then proxychains would proxy that already-proxied connection to Squid a second time
unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
# exec replaces this wrapper process with proxychains4 (no extra shell process left behind)
# proxychains4 is the binary name installed by the proxychains-ng package
# "$@" passes all arguments through to btcli unchanged
exec proxychains4 btcli "$@"
EOF
chmod +x /usr/local/bin/btc  # make the wrapper executable
```

As your normal user:

```shell
# git uses its own proxy config and does not pick up system env vars or proxychains automatically
# --global writes to ~/.gitconfig for the current user
git config --global http.proxy  http://127.0.0.1:3128
git config --global https.proxy http://127.0.0.1:3128
```

### Step 6 — Test

```shell
# 1. Confirm Squid is responding — '400 Bad Request' (no Host header) means Squid is up and listening
curl -I http://127.0.0.1:3128

# 2. Set proxy env vars for the curl tests below
export http_proxy="http://127.0.0.1:3128" https_proxy="http://127.0.0.1:3128"

# 3. Test an allowlisted domain — should succeed (200 or redirect response)
curl -I https://www.opentensor.ai

# 4. Test a non-allowlisted domain — should be blocked by Squid; || echo confirms the block is working
curl -I https://example.com || echo "blocked ✓"

# 5. Verify zypper can reach all repos through the proxy
zypper -vvv refresh

# 6. Unset proxy env vars, then test btcli through the proxychains wrapper
unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
btc wallet list  # 'btc' is the wrapper at /usr/local/bin/btc that calls proxychains4 btcli

# 7. Watch Squid's access log in real-time to observe what is being allowed and blocked
tail -f /var/log/squid/access.log
```

## Limitations

Egress control is effective against the specific pattern of malicious code phoning home over HTTPS. It does not cover:

- **DNS tunneling:** attackers can encode data in DNS queries. The rules restrict DNS to specific resolvers, which reduces but does not eliminate this risk.
- **ICMP tunneling:** blocked by the `DROP` egress policy since ICMP is not explicitly permitted.
- **Domain fronting / CDN abuse:** traffic routed through an allowlisted domain as a covert channel. Detecting this requires SSL inspection.
- **Root-level compromise:** an attacker with root can modify firewall rules directly.
- **Non-network harm:** malicious code can still corrupt data or delete files without network access.


## Running in a hardened VM on macOS

### Choosing your security posture

Before setting up a VM, consider what threat model you are actually defending against. The right setup depends on the value of your holdings and your tolerance for inconvenience.

| Setup | What it protects against | Remaining exposure |
|---|---|---|
| **Hardware wallet** | Key never exists in software | Physical theft of device |
| **Airgapped dedicated machine** | All network-based attacks | Physical access |
| **Dedicated Linux machine** | Malware on a separate host OS | The Linux machine itself |
| **Hardened VM on Mac** (this guide) | Casual process isolation, accidental leakage | macOS host privilege, keyloggers, firmware |
| **Native macOS** | Nothing specific | Everything |

The hardened VM raises the cost and sophistication required to attack you substantially compared to doing coldkey operations on native macOS. It is a reasonable choice for moderate holdings where the inconvenience of dedicated hardware isn't justified. For large holdings, a hardware wallet or dedicated machine is worth the inconvenience — the VM is a convenience tradeoff, not an equivalent.

### What the VM does and does not protect

**LUKS encryption protects the disk at rest** — when the VM is off, the image file on your Mac is unreadable ciphertext. This is real and valuable.

**It does not protect against a compromised macOS host while the VM is running.** The hypervisor runs in the macOS kernel. Any process on macOS with sufficient privilege — malware, a compromised kernel extension, a malicious app — can in principle read VM memory, observe keystrokes before they reach the VM, or interact with the running hypervisor. Your LUKS passphrase and wallet passphrase both pass through macOS input handling at entry time, where a keylogger captures them before the VM ever sees them.

The honest framing: if macOS itself is compromised by targeted malware, this setup does not protect you. It protects you from opportunistic attacks, accidental data exposure, and an attacker who steals your disk but not your running machine.

### What you need

- **UTM** — The Mac App Store version is code-signed by Apple and provides a stronger supply chain guarantee than the direct download. The direct download from **mac.getutm.app** is free and functionally identical; the App Store version costs a small amount. Either is acceptable; the App Store version is preferable for a security-sensitive setup.
- **OpenSUSE Leap 15.6 ISO** — from `get.opensuse.org/leap/15.6/server`

### Verify the ISO before use

A SHA-256 hash from the same server that served the ISO does not protect against a compromised download source — both would be wrong together. Verify the GPG signature instead, using openSUSE's signing key which is independently distributed:

1. On the download page, download the `.iso`, the `.iso.sha256` checksum file, and the `.iso.sha256.gpg` signature file.
2. Import the openSUSE signing key and verify the signature:

```shell
# Import the openSUSE signing key (fetch from a keyserver or from opensuse.org)
gpg --keyserver keys.gnupg.net --recv-keys 0x22C07BA534178CD02EFE22AAB88B2FD43DBDC284

# Verify the checksum file's signature
gpg --verify openSUSE-Leap-15.6-*.iso.sha256.gpg openSUSE-Leap-15.6-*.iso.sha256

# Verify the ISO against the checksum
sha256sum -c openSUSE-Leap-15.6-*.iso.sha256
```

A `Good signature` result means the checksum file was signed by the openSUSE key. A matching checksum means the ISO matches what openSUSE published. Refer to the [openSUSE verification documentation](https://en.opensuse.org/SDB:Download_help#Verification) for the current signing key fingerprint — confirm it matches before trusting the result.

### Step 1 — Create the VM in UTM

1. UTM → **Create a New Virtual Machine** → **Virtualize** → **Linux**
2. Boot ISO Image: browse to the OpenSUSE Leap ISO
3. Memory: 2048 MB; CPU: 2 cores; Storage: 20 GB (sufficient for the OS, Squid cache, and btcli — do not go smaller)
4. **Shared Directory: leave empty** — do not share any macOS folder into the VM
5. In VM settings, disable clipboard sharing
6. **Network mode: NAT** (default). The egress firewall and Squid allowlist provide the network isolation; host-only would prevent btcli from reaching the chain. If you are using the VM purely for offline key generation and do not need to query the chain, switch to host-only for stronger isolation.

### Step 2 — Install OpenSUSE with full disk encryption

Boot the VM and select **Installation** from the Leap boot menu.

1. **System Role:** Server (minimal, no desktop)
2. **Suggested Partitioning:** click "Guided Setup" → enable **"Encrypt Volume Group"**

   :::warning Choose your LUKS passphrase carefully
   This passphrase is the only thing protecting your VM image if your Mac is stolen or accessed. It is independent of your login password and your wallet passphrase — you will need all three separately.

   Use a [diceware](https://www.eff.org/dice) passphrase of at least five words, or equivalent entropy. Do not store it in macOS Keychain or any app on the same machine — that defeats the purpose. Write it down and store it physically, separately from the machine. If you forget this passphrase, the VM and everything in it is permanently unrecoverable. Your seed phrase (written down separately) is how you recover your wallet — the VM is not recoverable.
   :::

3. **Timezone and user account:** set a strong login password
4. **SSH:** disable SSH unless you specifically need it. For a coldkey VM, the UTM console is sufficient and SSH is an unnecessary attack surface. If you do enable SSH: disable password authentication and use key-based auth only (`PasswordAuthentication no` in `/etc/ssh/sshd_config`).
5. Install and reboot

On every subsequent boot, the VM pauses for the LUKS passphrase before starting.

### Step 3 — Follow the Linux steps

Once the VM is running, use the UTM console (or SSH if you enabled it) and follow the setup steps at the top of this page. The OS is the same; the commands are identical.

### Operational notes

**Your coldkey lives only inside the VM.** Never copy `~/.bittensor/wallets/` to the Mac host, paste the seed phrase into any Mac application, or configure a shared folder.

**Backup is the seed phrase, not the VM.** Write it on paper, store it separately from your machine. The VM is replaceable from scratch using the seed phrase. The LUKS passphrase protects the disk at rest; the wallet passphrase protects the key file; the seed phrase is how you recover if the VM is destroyed.

**Shutdown before walking away.** `sudo shutdown now` locks the LUKS disk immediately. While the VM is running, the decrypted disk is accessible to the hypervisor. Shut down whenever you are done — do not leave it running unattended.

**Do not take snapshots with keys loaded.** UTM/QEMU snapshots can capture unencrypted VM memory including key material. Only snapshot a clean state — after setup, before any wallet is loaded.
