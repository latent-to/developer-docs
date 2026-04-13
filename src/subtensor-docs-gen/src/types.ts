/**
 * types.ts
 *
 * Custom type definitions for the Bittensor (Subtensor) runtime.
 * These must be registered with @polkadot/api before connecting so that
 * storage items and RPC return values using Bittensor-specific structs
 * can be decoded correctly.
 *
 * Source of truth: pallets/subtensor/src/rpc.rs and pallets/subtensor/src/lib.rs
 * in opentensor/subtensor.
 */

export const bittensorTypes = {
  // ── Neuron endpoint info ──────────────────────────────────────────────────

  AxonInfo: {
    block: 'u64',
    version: 'u32',
    ip: 'u128',
    port: 'u16',
    ip_type: 'u8',
    protocol: 'u8',
    placeholder1: 'u8',
    placeholder2: 'u8',
  },

  PrometheusInfo: {
    block: 'u64',
    version: 'u32',
    ip: 'u128',
    port: 'u16',
    ip_type: 'u8',
  },

  // ── Full neuron snapshot (returned by RPC calls) ──────────────────────────

  NeuronInfo: {
    hotkey: 'AccountId',
    coldkey: 'AccountId',
    uid: 'Compact<u16>',
    netuid: 'Compact<u16>',
    active: 'bool',
    axon_info: 'AxonInfo',
    prometheus_info: 'PrometheusInfo',
    stake: 'Vec<(AccountId, Compact<u64>)>',
    rank: 'Compact<u16>',
    emission: 'Compact<u64>',
    incentive: 'Compact<u16>',
    consensus: 'Compact<u16>',
    trust: 'Compact<u16>',
    validator_trust: 'Compact<u16>',
    dividends: 'Compact<u16>',
    last_update: 'Compact<u64>',
    validator_permit: 'bool',
    weights: 'Vec<(Compact<u16>, Compact<u16>)>',
    bonds: 'Vec<(Compact<u16>, Compact<u16>)>',
    pruning_score: 'Compact<u16>',
  },

  NeuronInfoLite: {
    hotkey: 'AccountId',
    coldkey: 'AccountId',
    uid: 'Compact<u16>',
    netuid: 'Compact<u16>',
    active: 'bool',
    axon_info: 'AxonInfo',
    prometheus_info: 'PrometheusInfo',
    stake: 'Vec<(AccountId, Compact<u64>)>',
    rank: 'Compact<u16>',
    emission: 'Compact<u64>',
    incentive: 'Compact<u16>',
    consensus: 'Compact<u16>',
    trust: 'Compact<u16>',
    validator_trust: 'Compact<u16>',
    dividends: 'Compact<u16>',
    last_update: 'Compact<u64>',
    validator_permit: 'bool',
    pruning_score: 'Compact<u16>',
  },

  // ── Subnet info ───────────────────────────────────────────────────────────

  SubnetInfo: {
    netuid: 'Compact<u16>',
    rho: 'Compact<u16>',
    kappa: 'Compact<u16>',
    difficulty: 'Compact<u64>',
    immunity_period: 'Compact<u16>',
    max_allowed_validators: 'Compact<u16>',
    min_allowed_weights: 'Compact<u16>',
    max_weights_limit: 'Compact<u16>',
    scaling_law_power: 'Compact<u16>',
    subnetwork_n: 'Compact<u16>',
    max_allowed_uids: 'Compact<u16>',
    blocks_since_last_step: 'Compact<u64>',
    tempo: 'Compact<u16>',
    network_modality: 'Compact<u16>',
    network_connect: 'Vec<[u16; 2]>',
    emission_values: 'Compact<u64>',
    burn: 'Compact<u64>',
    owner: 'AccountId',
    owner_cut: 'Compact<u16>',
    activity_cutoff: 'Compact<u16>',
    registration_allowed: 'bool',
    target_regs_per_interval: 'Compact<u16>',
    min_burn: 'Compact<u64>',
    max_burn: 'Compact<u64>',
    bonds_moving_avg: 'Compact<u64>',
    max_regs_per_block: 'Compact<u16>',
    serving_rate_limit: 'Compact<u64>',
    cr_enabled: 'bool',
    liquid_alpha_enabled: 'bool',
    alpha_high: 'Compact<u16>',
    alpha_low: 'Compact<u16>',
  },

  SubnetHyperparams: {
    rho: 'Compact<u16>',
    kappa: 'Compact<u16>',
    immunity_period: 'Compact<u16>',
    min_allowed_weights: 'Compact<u16>',
    max_weights_limit: 'Compact<u16>',
    tempo: 'Compact<u16>',
    min_difficulty: 'Compact<u64>',
    max_difficulty: 'Compact<u64>',
    weights_version: 'Compact<u64>',
    weights_rate_limit: 'Compact<u64>',
    adjustment_interval: 'Compact<u16>',
    activity_cutoff: 'Compact<u16>',
    registration_allowed: 'bool',
    target_regs_per_interval: 'Compact<u16>',
    min_burn: 'Compact<u64>',
    max_burn: 'Compact<u64>',
    bonds_moving_avg: 'Compact<u64>',
    max_regs_per_block: 'Compact<u16>',
    serving_rate_limit: 'Compact<u64>',
    max_validators: 'Compact<u16>',
    adjustment_alpha: 'Compact<u64>',
    difficulty: 'Compact<u64>',
    commit_reveal_weights_interval: 'Compact<u64>',
    commit_reveal_weights_enabled: 'bool',
    alpha_high: 'Compact<u16>',
    alpha_low: 'Compact<u16>',
    liquid_alpha_enabled: 'bool',
  },

  // ── Delegation ────────────────────────────────────────────────────────────

  DelegateInfo: {
    delegate_ss58: 'AccountId',
    take: 'Compact<u16>',
    nominators: 'Vec<(AccountId, Compact<u64>)>',
    owner_ss58: 'AccountId',
    registrations: 'Vec<Compact<u16>>',
    validator_permits: 'Vec<Compact<u16>>',
    return_per_1000: 'Compact<u64>',
    total_daily_return: 'Compact<u64>',
  },

  DelegateInfoLite: {
    delegate_ss58: 'AccountId',
    owner_ss58: 'AccountId',
    take: 'Compact<u16>',
    total_stake: 'Compact<u64>',
    registrations: 'Vec<Compact<u16>>',
    validator_permits: 'Vec<Compact<u16>>',
    return_per_1000: 'Compact<u64>',
    total_daily_return: 'Compact<u64>',
  },

  // ── Stake info ────────────────────────────────────────────────────────────

  StakeInfo: {
    hotkey: 'AccountId',
    coldkey: 'AccountId',
    stake: 'Compact<u64>',
    locked: 'Compact<u64>',
    emission: 'Compact<u64>',
    drain: 'Compact<u64>',
    is_registered: 'bool',
  },

  // ── Commitment ────────────────────────────────────────────────────────────

  CommitmentInfo: {
    fields: 'Vec<CommitmentField>',
  },

  CommitmentField: {
    _enum: {
      None: null,
      Raw0: '[u8; 0]',
      Raw1: '[u8; 1]',
      Raw2: '[u8; 2]',
      Raw3: '[u8; 3]',
      Raw4: '[u8; 4]',
      Raw5: '[u8; 5]',
      Raw6: '[u8; 6]',
      Raw7: '[u8; 7]',
      Raw8: '[u8; 8]',
      Raw9: '[u8; 9]',
      Raw10: '[u8; 10]',
      Raw11: '[u8; 11]',
      Raw12: '[u8; 12]',
      Raw13: '[u8; 13]',
      Raw14: '[u8; 14]',
      Raw15: '[u8; 15]',
      Raw16: '[u8; 16]',
      Raw17: '[u8; 17]',
      Raw18: '[u8; 18]',
      Raw19: '[u8; 19]',
      Raw20: '[u8; 20]',
      Raw21: '[u8; 21]',
      Raw22: '[u8; 22]',
      Raw23: '[u8; 23]',
      Raw24: '[u8; 24]',
      Raw25: '[u8; 25]',
      Raw26: '[u8; 26]',
      Raw27: '[u8; 27]',
      Raw28: '[u8; 28]',
      Raw29: '[u8; 29]',
      Raw30: '[u8; 30]',
      Raw31: '[u8; 31]',
      Raw32: '[u8; 32]',
      BlakeTwo256: 'H256',
      Sha256: 'H256',
      Keccak256: 'H256',
      ShaThree256: 'H256',
    },
  },

  // ── Proxy types ───────────────────────────────────────────────────────────

  ProxyType: {
    _enum: [
      'Any',
      'Owner',
      'NonTransfer',
      'Senate',
      'NonFungibile',
      'Triumvirate',
      'Governance',
      'SmallStake',
      'BigStake',
      'Registration',
      'Transfer',
      'RootWeights',
    ],
  },
};

/**
 * Custom RPC definitions for Subtensor.
 * These supplement the standard Substrate RPC set.
 * Source: pallets/subtensor/src/rpc.rs and node/src/rpc.rs
 */
export const bittensorRpc = {
  neuronInfo: {
    getNeurons: {
      description: 'Get the full NeuronInfo for all neurons on a subnet.',
      params: [{ name: 'netuid', type: 'u16' }],
      type: 'Vec<NeuronInfo>',
    },
    getNeuronsLite: {
      description: 'Get lightweight NeuronInfoLite for all neurons on a subnet (no weights/bonds).',
      params: [{ name: 'netuid', type: 'u16' }],
      type: 'Vec<NeuronInfoLite>',
    },
    getNeuron: {
      description: 'Get NeuronInfo for a single neuron by UID.',
      params: [
        { name: 'netuid', type: 'u16' },
        { name: 'uid', type: 'u16' },
      ],
      type: 'Option<NeuronInfo>',
    },
    getNeuronLite: {
      description: 'Get NeuronInfoLite for a single neuron by UID.',
      params: [
        { name: 'netuid', type: 'u16' },
        { name: 'uid', type: 'u16' },
      ],
      type: 'Option<NeuronInfoLite>',
    },
  },

  subnetInfo: {
    getSubnetInfo: {
      description: 'Get the SubnetInfo snapshot for a subnet.',
      params: [{ name: 'netuid', type: 'u16' }],
      type: 'Option<SubnetInfo>',
    },
    getSubnetInfoLite: {
      description: 'Get a lightweight subnet info snapshot.',
      params: [{ name: 'netuid', type: 'u16' }],
      type: 'Option<SubnetInfo>',
    },
    getSubnetsInfo: {
      description: 'Get SubnetInfo for all active subnets.',
      params: [],
      type: 'Vec<Option<SubnetInfo>>',
    },
    getSubnetsInfoLite: {
      description: 'Get lightweight info for all active subnets.',
      params: [],
      type: 'Vec<Option<SubnetInfo>>',
    },
    getSubnetHyperparams: {
      description: 'Get all hyperparameters for a subnet.',
      params: [{ name: 'netuid', type: 'u16' }],
      type: 'Option<SubnetHyperparams>',
    },
  },

  delegateInfo: {
    getDelegates: {
      description: 'Get DelegateInfo for all registered delegates.',
      params: [],
      type: 'Vec<DelegateInfo>',
    },
    getDelegatesLite: {
      description: 'Get lightweight delegate info for all delegates.',
      params: [],
      type: 'Vec<DelegateInfoLite>',
    },
    getDelegate: {
      description: 'Get DelegateInfo for a specific hotkey.',
      params: [{ name: 'hotkey_ss58', type: 'AccountId' }],
      type: 'Option<DelegateInfo>',
    },
    getDelegateLite: {
      description: 'Get lightweight delegate info for a specific hotkey.',
      params: [{ name: 'hotkey_ss58', type: 'AccountId' }],
      type: 'Option<DelegateInfoLite>',
    },
    getDelegated: {
      description: 'Get all hotkeys that a coldkey has delegated stake to.',
      params: [{ name: 'coldkey_ss58', type: 'AccountId' }],
      type: 'Vec<(DelegateInfo, Compact<u64>)>',
    },
  },

  stakeInfo: {
    getStakeInfoForColdkey: {
      description: 'Get all StakeInfo records for a coldkey across all hotkeys.',
      params: [{ name: 'coldkey_ss58', type: 'AccountId' }],
      type: 'Vec<StakeInfo>',
    },
    getStakeInfoForColdkeys: {
      description: 'Get StakeInfo for a batch of coldkeys.',
      params: [{ name: 'coldkey_ss58_vec', type: 'Vec<AccountId>' }],
      type: 'Vec<(AccountId, Vec<StakeInfo>)>',
    },
  },
};
