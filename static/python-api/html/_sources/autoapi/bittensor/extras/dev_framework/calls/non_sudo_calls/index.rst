bittensor.extras.dev_framework.calls.non_sudo_calls
===================================================

.. py:module:: bittensor.extras.dev_framework.calls.non_sudo_calls

.. autoapi-nested-parse::

   This file is auto-generated. Do not edit manually.

   For developers:
   - Use the function `recreate_calls_subpackage()` to regenerate this file.
   - The command lists are built dynamically from the current Subtensor metadata (`Subtensor.substrate.metadata`).
   - Each command is represented as a `namedtuple` with fields:
       * System arguments: wallet, pallet (and `sudo` for sudo calls).
       * Additional arguments: taken from the extrinsic definition (with type hints for reference).
   - These namedtuples are intended as convenient templates for building commands in tests and end-to-end scenarios.

   .. note::

      Any manual changes will be overwritten the next time the generator is run.
      Subtensor spec version: 397



Classes
-------

.. autoapisummary::

   bittensor.extras.dev_framework.calls.non_sudo_calls.ADD_LIQUIDITY
   bittensor.extras.dev_framework.calls.non_sudo_calls.ADD_PROXY
   bittensor.extras.dev_framework.calls.non_sudo_calls.ADD_STAKE
   bittensor.extras.dev_framework.calls.non_sudo_calls.ADD_STAKE_BURN
   bittensor.extras.dev_framework.calls.non_sudo_calls.ADD_STAKE_LIMIT
   bittensor.extras.dev_framework.calls.non_sudo_calls.ANNOUNCE
   bittensor.extras.dev_framework.calls.non_sudo_calls.ANNOUNCE_COLDKEY_SWAP
   bittensor.extras.dev_framework.calls.non_sudo_calls.ANNOUNCE_NEXT_KEY
   bittensor.extras.dev_framework.calls.non_sudo_calls.APPLY_AUTHORIZED_UPGRADE
   bittensor.extras.dev_framework.calls.non_sudo_calls.APPROVE_AS_MULTI
   bittensor.extras.dev_framework.calls.non_sudo_calls.ASSOCIATE_EVM_KEY
   bittensor.extras.dev_framework.calls.non_sudo_calls.AS_DERIVATIVE
   bittensor.extras.dev_framework.calls.non_sudo_calls.AS_MULTI
   bittensor.extras.dev_framework.calls.non_sudo_calls.AS_MULTI_THRESHOLD_1
   bittensor.extras.dev_framework.calls.non_sudo_calls.AUTHORIZE_UPGRADE
   bittensor.extras.dev_framework.calls.non_sudo_calls.AUTHORIZE_UPGRADE_WITHOUT_CHECKS
   bittensor.extras.dev_framework.calls.non_sudo_calls.BATCH
   bittensor.extras.dev_framework.calls.non_sudo_calls.BATCH_ALL
   bittensor.extras.dev_framework.calls.non_sudo_calls.BATCH_COMMIT_WEIGHTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.BATCH_REVEAL_WEIGHTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.BATCH_SET_WEIGHTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.BURN
   bittensor.extras.dev_framework.calls.non_sudo_calls.BURNED_REGISTER
   bittensor.extras.dev_framework.calls.non_sudo_calls.BURN_ALPHA
   bittensor.extras.dev_framework.calls.non_sudo_calls.CALL
   bittensor.extras.dev_framework.calls.non_sudo_calls.CALL
   bittensor.extras.dev_framework.calls.non_sudo_calls.CALL_OLD_WEIGHT
   bittensor.extras.dev_framework.calls.non_sudo_calls.CANCEL
   bittensor.extras.dev_framework.calls.non_sudo_calls.CANCEL_AS_MULTI
   bittensor.extras.dev_framework.calls.non_sudo_calls.CANCEL_NAMED
   bittensor.extras.dev_framework.calls.non_sudo_calls.CANCEL_RETRY
   bittensor.extras.dev_framework.calls.non_sudo_calls.CANCEL_RETRY_NAMED
   bittensor.extras.dev_framework.calls.non_sudo_calls.CLAIM_ROOT
   bittensor.extras.dev_framework.calls.non_sudo_calls.CLEAR_COLDKEY_SWAP_ANNOUNCEMENT
   bittensor.extras.dev_framework.calls.non_sudo_calls.CLEAR_IDENTITY
   bittensor.extras.dev_framework.calls.non_sudo_calls.COMMIT_CRV3_MECHANISM_WEIGHTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.COMMIT_MECHANISM_WEIGHTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.COMMIT_TIMELOCKED_MECHANISM_WEIGHTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.COMMIT_TIMELOCKED_WEIGHTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.COMMIT_WEIGHTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.CONTRIBUTE
   bittensor.extras.dev_framework.calls.non_sudo_calls.CREATE
   bittensor.extras.dev_framework.calls.non_sudo_calls.CREATE
   bittensor.extras.dev_framework.calls.non_sudo_calls.CREATE2
   bittensor.extras.dev_framework.calls.non_sudo_calls.CREATE_PURE
   bittensor.extras.dev_framework.calls.non_sudo_calls.DECREASE_TAKE
   bittensor.extras.dev_framework.calls.non_sudo_calls.DISABLE_LP
   bittensor.extras.dev_framework.calls.non_sudo_calls.DISABLE_VOTING_POWER_TRACKING
   bittensor.extras.dev_framework.calls.non_sudo_calls.DISABLE_WHITELIST
   bittensor.extras.dev_framework.calls.non_sudo_calls.DISPATCH_AS
   bittensor.extras.dev_framework.calls.non_sudo_calls.DISPATCH_AS_FALLIBLE
   bittensor.extras.dev_framework.calls.non_sudo_calls.DISPUTE_COLDKEY_SWAP
   bittensor.extras.dev_framework.calls.non_sudo_calls.DISSOLVE
   bittensor.extras.dev_framework.calls.non_sudo_calls.DISSOLVE_NETWORK
   bittensor.extras.dev_framework.calls.non_sudo_calls.ENABLE_VOTING_POWER_TRACKING
   bittensor.extras.dev_framework.calls.non_sudo_calls.ENSURE_UPDATED
   bittensor.extras.dev_framework.calls.non_sudo_calls.ENTER
   bittensor.extras.dev_framework.calls.non_sudo_calls.EXTEND
   bittensor.extras.dev_framework.calls.non_sudo_calls.FAUCET
   bittensor.extras.dev_framework.calls.non_sudo_calls.FINALIZE
   bittensor.extras.dev_framework.calls.non_sudo_calls.FORCE_ADJUST_TOTAL_ISSUANCE
   bittensor.extras.dev_framework.calls.non_sudo_calls.FORCE_BATCH
   bittensor.extras.dev_framework.calls.non_sudo_calls.FORCE_ENTER
   bittensor.extras.dev_framework.calls.non_sudo_calls.FORCE_EXIT
   bittensor.extras.dev_framework.calls.non_sudo_calls.FORCE_EXTEND
   bittensor.extras.dev_framework.calls.non_sudo_calls.FORCE_RELEASE_DEPOSIT
   bittensor.extras.dev_framework.calls.non_sudo_calls.FORCE_SET_BALANCE
   bittensor.extras.dev_framework.calls.non_sudo_calls.FORCE_SLASH_DEPOSIT
   bittensor.extras.dev_framework.calls.non_sudo_calls.FORCE_TRANSFER
   bittensor.extras.dev_framework.calls.non_sudo_calls.FORCE_UNRESERVE
   bittensor.extras.dev_framework.calls.non_sudo_calls.IF_ELSE
   bittensor.extras.dev_framework.calls.non_sudo_calls.INCREASE_TAKE
   bittensor.extras.dev_framework.calls.non_sudo_calls.INSTANTIATE
   bittensor.extras.dev_framework.calls.non_sudo_calls.INSTANTIATE_OLD_WEIGHT
   bittensor.extras.dev_framework.calls.non_sudo_calls.INSTANTIATE_WITH_CODE
   bittensor.extras.dev_framework.calls.non_sudo_calls.INSTANTIATE_WITH_CODE_OLD_WEIGHT
   bittensor.extras.dev_framework.calls.non_sudo_calls.KILL_PREFIX
   bittensor.extras.dev_framework.calls.non_sudo_calls.KILL_PURE
   bittensor.extras.dev_framework.calls.non_sudo_calls.KILL_STORAGE
   bittensor.extras.dev_framework.calls.non_sudo_calls.MIGRATE
   bittensor.extras.dev_framework.calls.non_sudo_calls.MODIFY_POSITION
   bittensor.extras.dev_framework.calls.non_sudo_calls.MOVE_STAKE
   bittensor.extras.dev_framework.calls.non_sudo_calls.NOTE_PREIMAGE
   bittensor.extras.dev_framework.calls.non_sudo_calls.NOTE_STALLED
   bittensor.extras.dev_framework.calls.non_sudo_calls.POKE_DEPOSIT
   bittensor.extras.dev_framework.calls.non_sudo_calls.POKE_DEPOSIT
   bittensor.extras.dev_framework.calls.non_sudo_calls.PROXY
   bittensor.extras.dev_framework.calls.non_sudo_calls.PROXY_ANNOUNCED
   bittensor.extras.dev_framework.calls.non_sudo_calls.RECYCLE_ALPHA
   bittensor.extras.dev_framework.calls.non_sudo_calls.REFUND
   bittensor.extras.dev_framework.calls.non_sudo_calls.REGISTER
   bittensor.extras.dev_framework.calls.non_sudo_calls.REGISTER_LEASED_NETWORK
   bittensor.extras.dev_framework.calls.non_sudo_calls.REGISTER_LIMIT
   bittensor.extras.dev_framework.calls.non_sudo_calls.REGISTER_NETWORK
   bittensor.extras.dev_framework.calls.non_sudo_calls.REGISTER_NETWORK_WITH_IDENTITY
   bittensor.extras.dev_framework.calls.non_sudo_calls.REJECT_ANNOUNCEMENT
   bittensor.extras.dev_framework.calls.non_sudo_calls.RELEASE_DEPOSIT
   bittensor.extras.dev_framework.calls.non_sudo_calls.REMARK
   bittensor.extras.dev_framework.calls.non_sudo_calls.REMARK_WITH_EVENT
   bittensor.extras.dev_framework.calls.non_sudo_calls.REMOVE_ANNOUNCEMENT
   bittensor.extras.dev_framework.calls.non_sudo_calls.REMOVE_CODE
   bittensor.extras.dev_framework.calls.non_sudo_calls.REMOVE_KEY
   bittensor.extras.dev_framework.calls.non_sudo_calls.REMOVE_LIQUIDITY
   bittensor.extras.dev_framework.calls.non_sudo_calls.REMOVE_PROXIES
   bittensor.extras.dev_framework.calls.non_sudo_calls.REMOVE_PROXY
   bittensor.extras.dev_framework.calls.non_sudo_calls.REMOVE_STAKE
   bittensor.extras.dev_framework.calls.non_sudo_calls.REMOVE_STAKE_FULL_LIMIT
   bittensor.extras.dev_framework.calls.non_sudo_calls.REMOVE_STAKE_LIMIT
   bittensor.extras.dev_framework.calls.non_sudo_calls.REPORT_EQUIVOCATION
   bittensor.extras.dev_framework.calls.non_sudo_calls.REPORT_EQUIVOCATION_UNSIGNED
   bittensor.extras.dev_framework.calls.non_sudo_calls.REQUEST_PREIMAGE
   bittensor.extras.dev_framework.calls.non_sudo_calls.RESET_COLDKEY_SWAP
   bittensor.extras.dev_framework.calls.non_sudo_calls.REVEAL_MECHANISM_WEIGHTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.REVEAL_WEIGHTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.ROOT_DISSOLVE_NETWORK
   bittensor.extras.dev_framework.calls.non_sudo_calls.ROOT_REGISTER
   bittensor.extras.dev_framework.calls.non_sudo_calls.SCHEDULE
   bittensor.extras.dev_framework.calls.non_sudo_calls.SCHEDULE_AFTER
   bittensor.extras.dev_framework.calls.non_sudo_calls.SCHEDULE_GRANDPA_CHANGE
   bittensor.extras.dev_framework.calls.non_sudo_calls.SCHEDULE_NAMED
   bittensor.extras.dev_framework.calls.non_sudo_calls.SCHEDULE_NAMED_AFTER
   bittensor.extras.dev_framework.calls.non_sudo_calls.SCHEDULE_SWAP_COLDKEY
   bittensor.extras.dev_framework.calls.non_sudo_calls.SERVE_AXON
   bittensor.extras.dev_framework.calls.non_sudo_calls.SERVE_AXON_TLS
   bittensor.extras.dev_framework.calls.non_sudo_calls.SERVE_PROMETHEUS
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_AUTO_PARENT_DELEGATION_ENABLED
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_BASE_FEE_PER_GAS
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_BEACON_CONFIG
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_CHILDKEY_TAKE
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_CHILDREN
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_CODE
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_CODE
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_CODE_WITHOUT_CHECKS
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_COLDKEY_AUTO_STAKE_HOTKEY
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_COMMITMENT
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_ELASTICITY
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_FEE_RATE
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_HEAP_PAGES
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_IDENTITY
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_IDENTITY
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_KEY
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_MAX_EXTRINSIC_WEIGHT
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_MAX_PENDING_EXTRINSICS_NUMBER
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_MAX_SPACE
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_MECHANISM_WEIGHTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_OLDEST_STORED_ROUND
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_ON_INITIALIZE_WEIGHT
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_PENDING_CHILDKEY_COOLDOWN
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_REAL_PAYS_FEE
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_RETRY
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_RETRY_NAMED
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_ROOT_CLAIM_TYPE
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_STORAGE
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_STORED_EXTRINSIC_LIFETIME
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_SUBNET_IDENTITY
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_WEIGHTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.SET_WHITELIST
   bittensor.extras.dev_framework.calls.non_sudo_calls.START_CALL
   bittensor.extras.dev_framework.calls.non_sudo_calls.STORE_ENCRYPTED
   bittensor.extras.dev_framework.calls.non_sudo_calls.SUBMIT_ENCRYPTED
   bittensor.extras.dev_framework.calls.non_sudo_calls.SUDO
   bittensor.extras.dev_framework.calls.non_sudo_calls.SWAP_AUTHORITIES
   bittensor.extras.dev_framework.calls.non_sudo_calls.SWAP_COLDKEY
   bittensor.extras.dev_framework.calls.non_sudo_calls.SWAP_COLDKEY_ANNOUNCED
   bittensor.extras.dev_framework.calls.non_sudo_calls.SWAP_HOTKEY
   bittensor.extras.dev_framework.calls.non_sudo_calls.SWAP_HOTKEY_V2
   bittensor.extras.dev_framework.calls.non_sudo_calls.SWAP_STAKE
   bittensor.extras.dev_framework.calls.non_sudo_calls.SWAP_STAKE_LIMIT
   bittensor.extras.dev_framework.calls.non_sudo_calls.TERMINATE_LEASE
   bittensor.extras.dev_framework.calls.non_sudo_calls.TOGGLE_USER_LIQUIDITY
   bittensor.extras.dev_framework.calls.non_sudo_calls.TRANSACT
   bittensor.extras.dev_framework.calls.non_sudo_calls.TRANSFER_ALL
   bittensor.extras.dev_framework.calls.non_sudo_calls.TRANSFER_ALLOW_DEATH
   bittensor.extras.dev_framework.calls.non_sudo_calls.TRANSFER_KEEP_ALIVE
   bittensor.extras.dev_framework.calls.non_sudo_calls.TRANSFER_STAKE
   bittensor.extras.dev_framework.calls.non_sudo_calls.TRY_ASSOCIATE_HOTKEY
   bittensor.extras.dev_framework.calls.non_sudo_calls.UNNOTE_PREIMAGE
   bittensor.extras.dev_framework.calls.non_sudo_calls.UNREQUEST_PREIMAGE
   bittensor.extras.dev_framework.calls.non_sudo_calls.UNSTAKE_ALL
   bittensor.extras.dev_framework.calls.non_sudo_calls.UNSTAKE_ALL_ALPHA
   bittensor.extras.dev_framework.calls.non_sudo_calls.UPDATE_CAP
   bittensor.extras.dev_framework.calls.non_sudo_calls.UPDATE_END
   bittensor.extras.dev_framework.calls.non_sudo_calls.UPDATE_MIN_CONTRIBUTION
   bittensor.extras.dev_framework.calls.non_sudo_calls.UPDATE_SYMBOL
   bittensor.extras.dev_framework.calls.non_sudo_calls.UPGRADE_ACCOUNTS
   bittensor.extras.dev_framework.calls.non_sudo_calls.UPLOAD_CODE
   bittensor.extras.dev_framework.calls.non_sudo_calls.WITHDRAW
   bittensor.extras.dev_framework.calls.non_sudo_calls.WITHDRAW
   bittensor.extras.dev_framework.calls.non_sudo_calls.WITH_WEIGHT
   bittensor.extras.dev_framework.calls.non_sudo_calls.WRITE_PULSE


Module Contents
---------------

.. py:class:: ADD_LIQUIDITY

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: liquidity


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: tick_high


   .. py:attribute:: tick_low


   .. py:attribute:: wallet


.. py:class:: ADD_PROXY

   Bases: :py:obj:`tuple`


   .. py:attribute:: delay


   .. py:attribute:: delegate


   .. py:attribute:: pallet


   .. py:attribute:: proxy_type


   .. py:attribute:: wallet


.. py:class:: ADD_STAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: amount_staked


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: ADD_STAKE_BURN

   Bases: :py:obj:`tuple`


   .. py:attribute:: amount


   .. py:attribute:: hotkey


   .. py:attribute:: limit


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: ADD_STAKE_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: allow_partial


   .. py:attribute:: amount_staked


   .. py:attribute:: hotkey


   .. py:attribute:: limit_price


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: ANNOUNCE

   Bases: :py:obj:`tuple`


   .. py:attribute:: call_hash


   .. py:attribute:: pallet


   .. py:attribute:: real


   .. py:attribute:: wallet


.. py:class:: ANNOUNCE_COLDKEY_SWAP

   Bases: :py:obj:`tuple`


   .. py:attribute:: new_coldkey_hash


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: ANNOUNCE_NEXT_KEY

   Bases: :py:obj:`tuple`


   .. py:attribute:: enc_key


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: APPLY_AUTHORIZED_UPGRADE

   Bases: :py:obj:`tuple`


   .. py:attribute:: code


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: APPROVE_AS_MULTI

   Bases: :py:obj:`tuple`


   .. py:attribute:: call_hash


   .. py:attribute:: max_weight


   .. py:attribute:: maybe_timepoint


   .. py:attribute:: other_signatories


   .. py:attribute:: pallet


   .. py:attribute:: threshold


   .. py:attribute:: wallet


.. py:class:: ASSOCIATE_EVM_KEY

   Bases: :py:obj:`tuple`


   .. py:attribute:: block_number


   .. py:attribute:: evm_key


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: signature


   .. py:attribute:: wallet


.. py:class:: AS_DERIVATIVE

   Bases: :py:obj:`tuple`


   .. py:attribute:: call


   .. py:attribute:: index


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: AS_MULTI

   Bases: :py:obj:`tuple`


   .. py:attribute:: call


   .. py:attribute:: max_weight


   .. py:attribute:: maybe_timepoint


   .. py:attribute:: other_signatories


   .. py:attribute:: pallet


   .. py:attribute:: threshold


   .. py:attribute:: wallet


.. py:class:: AS_MULTI_THRESHOLD_1

   Bases: :py:obj:`tuple`


   .. py:attribute:: call


   .. py:attribute:: other_signatories


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: AUTHORIZE_UPGRADE

   Bases: :py:obj:`tuple`


   .. py:attribute:: code_hash


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: AUTHORIZE_UPGRADE_WITHOUT_CHECKS

   Bases: :py:obj:`tuple`


   .. py:attribute:: code_hash


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: BATCH

   Bases: :py:obj:`tuple`


   .. py:attribute:: calls


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: BATCH_ALL

   Bases: :py:obj:`tuple`


   .. py:attribute:: calls


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: BATCH_COMMIT_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: commit_hashes


   .. py:attribute:: netuids


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: BATCH_REVEAL_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: salts_list


   .. py:attribute:: uids_list


   .. py:attribute:: values_list


   .. py:attribute:: version_keys


   .. py:attribute:: wallet


.. py:class:: BATCH_SET_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuids


   .. py:attribute:: pallet


   .. py:attribute:: version_keys


   .. py:attribute:: wallet


   .. py:attribute:: weights


.. py:class:: BURN

   Bases: :py:obj:`tuple`


   .. py:attribute:: keep_alive


   .. py:attribute:: pallet


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: BURNED_REGISTER

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: BURN_ALPHA

   Bases: :py:obj:`tuple`


   .. py:attribute:: amount


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: CALL

   Bases: :py:obj:`tuple`


   .. py:attribute:: data


   .. py:attribute:: dest


   .. py:attribute:: gas_limit


   .. py:attribute:: pallet


   .. py:attribute:: storage_deposit_limit


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: CALL

   Bases: :py:obj:`tuple`


   .. py:attribute:: access_list


   .. py:attribute:: authorization_list


   .. py:attribute:: gas_limit


   .. py:attribute:: input


   .. py:attribute:: max_fee_per_gas


   .. py:attribute:: max_priority_fee_per_gas


   .. py:attribute:: nonce


   .. py:attribute:: pallet


   .. py:attribute:: source


   .. py:attribute:: target


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: CALL_OLD_WEIGHT

   Bases: :py:obj:`tuple`


   .. py:attribute:: data


   .. py:attribute:: dest


   .. py:attribute:: gas_limit


   .. py:attribute:: pallet


   .. py:attribute:: storage_deposit_limit


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: CANCEL

   Bases: :py:obj:`tuple`


   .. py:attribute:: index


   .. py:attribute:: pallet


   .. py:attribute:: wallet


   .. py:attribute:: when


.. py:class:: CANCEL_AS_MULTI

   Bases: :py:obj:`tuple`


   .. py:attribute:: call_hash


   .. py:attribute:: other_signatories


   .. py:attribute:: pallet


   .. py:attribute:: threshold


   .. py:attribute:: timepoint


   .. py:attribute:: wallet


.. py:class:: CANCEL_NAMED

   Bases: :py:obj:`tuple`


   .. py:attribute:: id


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: CANCEL_RETRY

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: task


   .. py:attribute:: wallet


.. py:class:: CANCEL_RETRY_NAMED

   Bases: :py:obj:`tuple`


   .. py:attribute:: id


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: CLAIM_ROOT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: subnets


   .. py:attribute:: wallet


.. py:class:: CLEAR_COLDKEY_SWAP_ANNOUNCEMENT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: CLEAR_IDENTITY

   Bases: :py:obj:`tuple`


   .. py:attribute:: identified


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: COMMIT_CRV3_MECHANISM_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: commit


   .. py:attribute:: mecid


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: reveal_round


   .. py:attribute:: wallet


.. py:class:: COMMIT_MECHANISM_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: commit_hash


   .. py:attribute:: mecid


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: COMMIT_TIMELOCKED_MECHANISM_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: commit


   .. py:attribute:: commit_reveal_version


   .. py:attribute:: mecid


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: reveal_round


   .. py:attribute:: wallet


.. py:class:: COMMIT_TIMELOCKED_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: commit


   .. py:attribute:: commit_reveal_version


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: reveal_round


   .. py:attribute:: wallet


.. py:class:: COMMIT_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: commit_hash


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: CONTRIBUTE

   Bases: :py:obj:`tuple`


   .. py:attribute:: amount


   .. py:attribute:: crowdloan_id


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: CREATE

   Bases: :py:obj:`tuple`


   .. py:attribute:: call


   .. py:attribute:: cap


   .. py:attribute:: deposit


   .. py:attribute:: end


   .. py:attribute:: min_contribution


   .. py:attribute:: pallet


   .. py:attribute:: target_address


   .. py:attribute:: wallet


.. py:class:: CREATE

   Bases: :py:obj:`tuple`


   .. py:attribute:: access_list


   .. py:attribute:: authorization_list


   .. py:attribute:: gas_limit


   .. py:attribute:: init


   .. py:attribute:: max_fee_per_gas


   .. py:attribute:: max_priority_fee_per_gas


   .. py:attribute:: nonce


   .. py:attribute:: pallet


   .. py:attribute:: source


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: CREATE2

   Bases: :py:obj:`tuple`


   .. py:attribute:: access_list


   .. py:attribute:: authorization_list


   .. py:attribute:: gas_limit


   .. py:attribute:: init


   .. py:attribute:: max_fee_per_gas


   .. py:attribute:: max_priority_fee_per_gas


   .. py:attribute:: nonce


   .. py:attribute:: pallet


   .. py:attribute:: salt


   .. py:attribute:: source


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: CREATE_PURE

   Bases: :py:obj:`tuple`


   .. py:attribute:: delay


   .. py:attribute:: index


   .. py:attribute:: pallet


   .. py:attribute:: proxy_type


   .. py:attribute:: wallet


.. py:class:: DECREASE_TAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: pallet


   .. py:attribute:: take


   .. py:attribute:: wallet


.. py:class:: DISABLE_LP

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: DISABLE_VOTING_POWER_TRACKING

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: DISABLE_WHITELIST

   Bases: :py:obj:`tuple`


   .. py:attribute:: disabled


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: DISPATCH_AS

   Bases: :py:obj:`tuple`


   .. py:attribute:: as_origin


   .. py:attribute:: call


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: DISPATCH_AS_FALLIBLE

   Bases: :py:obj:`tuple`


   .. py:attribute:: as_origin


   .. py:attribute:: call


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: DISPUTE_COLDKEY_SWAP

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: DISSOLVE

   Bases: :py:obj:`tuple`


   .. py:attribute:: crowdloan_id


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: DISSOLVE_NETWORK

   Bases: :py:obj:`tuple`


   .. py:attribute:: coldkey


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: ENABLE_VOTING_POWER_TRACKING

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: ENSURE_UPDATED

   Bases: :py:obj:`tuple`


   .. py:attribute:: hashes


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: ENTER

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: EXTEND

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: FAUCET

   Bases: :py:obj:`tuple`


   .. py:attribute:: block_number


   .. py:attribute:: nonce


   .. py:attribute:: pallet


   .. py:attribute:: wallet


   .. py:attribute:: work


.. py:class:: FINALIZE

   Bases: :py:obj:`tuple`


   .. py:attribute:: crowdloan_id


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: FORCE_ADJUST_TOTAL_ISSUANCE

   Bases: :py:obj:`tuple`


   .. py:attribute:: delta


   .. py:attribute:: direction


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: FORCE_BATCH

   Bases: :py:obj:`tuple`


   .. py:attribute:: calls


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: FORCE_ENTER

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: FORCE_EXIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: FORCE_EXTEND

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: FORCE_RELEASE_DEPOSIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: account


   .. py:attribute:: block


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: FORCE_SET_BALANCE

   Bases: :py:obj:`tuple`


   .. py:attribute:: new_free


   .. py:attribute:: pallet


   .. py:attribute:: wallet


   .. py:attribute:: who


.. py:class:: FORCE_SLASH_DEPOSIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: account


   .. py:attribute:: block


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: FORCE_TRANSFER

   Bases: :py:obj:`tuple`


   .. py:attribute:: dest


   .. py:attribute:: pallet


   .. py:attribute:: source


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: FORCE_UNRESERVE

   Bases: :py:obj:`tuple`


   .. py:attribute:: amount


   .. py:attribute:: pallet


   .. py:attribute:: wallet


   .. py:attribute:: who


.. py:class:: IF_ELSE

   Bases: :py:obj:`tuple`


   .. py:attribute:: fallback


   .. py:attribute:: main


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: INCREASE_TAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: pallet


   .. py:attribute:: take


   .. py:attribute:: wallet


.. py:class:: INSTANTIATE

   Bases: :py:obj:`tuple`


   .. py:attribute:: code_hash


   .. py:attribute:: data


   .. py:attribute:: gas_limit


   .. py:attribute:: pallet


   .. py:attribute:: salt


   .. py:attribute:: storage_deposit_limit


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: INSTANTIATE_OLD_WEIGHT

   Bases: :py:obj:`tuple`


   .. py:attribute:: code_hash


   .. py:attribute:: data


   .. py:attribute:: gas_limit


   .. py:attribute:: pallet


   .. py:attribute:: salt


   .. py:attribute:: storage_deposit_limit


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: INSTANTIATE_WITH_CODE

   Bases: :py:obj:`tuple`


   .. py:attribute:: code


   .. py:attribute:: data


   .. py:attribute:: gas_limit


   .. py:attribute:: pallet


   .. py:attribute:: salt


   .. py:attribute:: storage_deposit_limit


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: INSTANTIATE_WITH_CODE_OLD_WEIGHT

   Bases: :py:obj:`tuple`


   .. py:attribute:: code


   .. py:attribute:: data


   .. py:attribute:: gas_limit


   .. py:attribute:: pallet


   .. py:attribute:: salt


   .. py:attribute:: storage_deposit_limit


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: KILL_PREFIX

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: prefix


   .. py:attribute:: subkeys


   .. py:attribute:: wallet


.. py:class:: KILL_PURE

   Bases: :py:obj:`tuple`


   .. py:attribute:: ext_index


   .. py:attribute:: height


   .. py:attribute:: index


   .. py:attribute:: pallet


   .. py:attribute:: proxy_type


   .. py:attribute:: spawner


   .. py:attribute:: wallet


.. py:class:: KILL_STORAGE

   Bases: :py:obj:`tuple`


   .. py:attribute:: keys


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: MIGRATE

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


   .. py:attribute:: weight_limit


.. py:class:: MODIFY_POSITION

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: liquidity_delta


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: position_id


   .. py:attribute:: wallet


.. py:class:: MOVE_STAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: alpha_amount


   .. py:attribute:: destination_hotkey


   .. py:attribute:: destination_netuid


   .. py:attribute:: origin_hotkey


   .. py:attribute:: origin_netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: NOTE_PREIMAGE

   Bases: :py:obj:`tuple`


   .. py:attribute:: bytes


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: NOTE_STALLED

   Bases: :py:obj:`tuple`


   .. py:attribute:: best_finalized_block_number


   .. py:attribute:: delay


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: POKE_DEPOSIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: call_hash


   .. py:attribute:: other_signatories


   .. py:attribute:: pallet


   .. py:attribute:: threshold


   .. py:attribute:: wallet


.. py:class:: POKE_DEPOSIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: PROXY

   Bases: :py:obj:`tuple`


   .. py:attribute:: call


   .. py:attribute:: force_proxy_type


   .. py:attribute:: pallet


   .. py:attribute:: real


   .. py:attribute:: wallet


.. py:class:: PROXY_ANNOUNCED

   Bases: :py:obj:`tuple`


   .. py:attribute:: call


   .. py:attribute:: delegate


   .. py:attribute:: force_proxy_type


   .. py:attribute:: pallet


   .. py:attribute:: real


   .. py:attribute:: wallet


.. py:class:: RECYCLE_ALPHA

   Bases: :py:obj:`tuple`


   .. py:attribute:: amount


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REFUND

   Bases: :py:obj:`tuple`


   .. py:attribute:: crowdloan_id


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REGISTER

   Bases: :py:obj:`tuple`


   .. py:attribute:: block_number


   .. py:attribute:: coldkey


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: nonce


   .. py:attribute:: pallet


   .. py:attribute:: wallet


   .. py:attribute:: work


.. py:class:: REGISTER_LEASED_NETWORK

   Bases: :py:obj:`tuple`


   .. py:attribute:: emissions_share


   .. py:attribute:: end_block


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REGISTER_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: limit_price


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REGISTER_NETWORK

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REGISTER_NETWORK_WITH_IDENTITY

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: identity


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REJECT_ANNOUNCEMENT

   Bases: :py:obj:`tuple`


   .. py:attribute:: call_hash


   .. py:attribute:: delegate


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: RELEASE_DEPOSIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: account


   .. py:attribute:: block


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REMARK

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: remark


   .. py:attribute:: wallet


.. py:class:: REMARK_WITH_EVENT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: remark


   .. py:attribute:: wallet


.. py:class:: REMOVE_ANNOUNCEMENT

   Bases: :py:obj:`tuple`


   .. py:attribute:: call_hash


   .. py:attribute:: pallet


   .. py:attribute:: real


   .. py:attribute:: wallet


.. py:class:: REMOVE_CODE

   Bases: :py:obj:`tuple`


   .. py:attribute:: code_hash


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REMOVE_KEY

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REMOVE_LIQUIDITY

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: position_id


   .. py:attribute:: wallet


.. py:class:: REMOVE_PROXIES

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REMOVE_PROXY

   Bases: :py:obj:`tuple`


   .. py:attribute:: delay


   .. py:attribute:: delegate


   .. py:attribute:: pallet


   .. py:attribute:: proxy_type


   .. py:attribute:: wallet


.. py:class:: REMOVE_STAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: amount_unstaked


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REMOVE_STAKE_FULL_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: limit_price


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REMOVE_STAKE_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: allow_partial


   .. py:attribute:: amount_unstaked


   .. py:attribute:: hotkey


   .. py:attribute:: limit_price


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REPORT_EQUIVOCATION

   Bases: :py:obj:`tuple`


   .. py:attribute:: equivocation_proof


   .. py:attribute:: key_owner_proof


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REPORT_EQUIVOCATION_UNSIGNED

   Bases: :py:obj:`tuple`


   .. py:attribute:: equivocation_proof


   .. py:attribute:: key_owner_proof


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REQUEST_PREIMAGE

   Bases: :py:obj:`tuple`


   .. py:attribute:: hash


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: RESET_COLDKEY_SWAP

   Bases: :py:obj:`tuple`


   .. py:attribute:: coldkey


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: REVEAL_MECHANISM_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: mecid


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: salt


   .. py:attribute:: uids


   .. py:attribute:: values


   .. py:attribute:: version_key


   .. py:attribute:: wallet


.. py:class:: REVEAL_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: salt


   .. py:attribute:: uids


   .. py:attribute:: values


   .. py:attribute:: version_key


   .. py:attribute:: wallet


.. py:class:: ROOT_DISSOLVE_NETWORK

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: ROOT_REGISTER

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SCHEDULE

   Bases: :py:obj:`tuple`


   .. py:attribute:: call


   .. py:attribute:: maybe_periodic


   .. py:attribute:: pallet


   .. py:attribute:: priority


   .. py:attribute:: wallet


   .. py:attribute:: when


.. py:class:: SCHEDULE_AFTER

   Bases: :py:obj:`tuple`


   .. py:attribute:: after


   .. py:attribute:: call


   .. py:attribute:: maybe_periodic


   .. py:attribute:: pallet


   .. py:attribute:: priority


   .. py:attribute:: wallet


.. py:class:: SCHEDULE_GRANDPA_CHANGE

   Bases: :py:obj:`tuple`


   .. py:attribute:: forced


   .. py:attribute:: in_blocks


   .. py:attribute:: next_authorities


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SCHEDULE_NAMED

   Bases: :py:obj:`tuple`


   .. py:attribute:: call


   .. py:attribute:: id


   .. py:attribute:: maybe_periodic


   .. py:attribute:: pallet


   .. py:attribute:: priority


   .. py:attribute:: wallet


   .. py:attribute:: when


.. py:class:: SCHEDULE_NAMED_AFTER

   Bases: :py:obj:`tuple`


   .. py:attribute:: after


   .. py:attribute:: call


   .. py:attribute:: id


   .. py:attribute:: maybe_periodic


   .. py:attribute:: pallet


   .. py:attribute:: priority


   .. py:attribute:: wallet


.. py:class:: SCHEDULE_SWAP_COLDKEY

   Bases: :py:obj:`tuple`


   .. py:attribute:: new_coldkey


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SERVE_AXON

   Bases: :py:obj:`tuple`


   .. py:attribute:: ip


   .. py:attribute:: ip_type


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: placeholder1


   .. py:attribute:: placeholder2


   .. py:attribute:: port


   .. py:attribute:: protocol


   .. py:attribute:: version


   .. py:attribute:: wallet


.. py:class:: SERVE_AXON_TLS

   Bases: :py:obj:`tuple`


   .. py:attribute:: certificate


   .. py:attribute:: ip


   .. py:attribute:: ip_type


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: placeholder1


   .. py:attribute:: placeholder2


   .. py:attribute:: port


   .. py:attribute:: protocol


   .. py:attribute:: version


   .. py:attribute:: wallet


.. py:class:: SERVE_PROMETHEUS

   Bases: :py:obj:`tuple`


   .. py:attribute:: ip


   .. py:attribute:: ip_type


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: port


   .. py:attribute:: version


   .. py:attribute:: wallet


.. py:class:: SET

   Bases: :py:obj:`tuple`


   .. py:attribute:: now


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_AUTO_PARENT_DELEGATION_ENABLED

   Bases: :py:obj:`tuple`


   .. py:attribute:: enabled


   .. py:attribute:: hotkey


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_BASE_FEE_PER_GAS

   Bases: :py:obj:`tuple`


   .. py:attribute:: fee


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_BEACON_CONFIG

   Bases: :py:obj:`tuple`


   .. py:attribute:: config_payload


   .. py:attribute:: pallet


   .. py:attribute:: signature


   .. py:attribute:: wallet


.. py:class:: SET_CHILDKEY_TAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: take


   .. py:attribute:: wallet


.. py:class:: SET_CHILDREN

   Bases: :py:obj:`tuple`


   .. py:attribute:: children


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_CODE

   Bases: :py:obj:`tuple`


   .. py:attribute:: code


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_CODE

   Bases: :py:obj:`tuple`


   .. py:attribute:: code_hash


   .. py:attribute:: dest


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_CODE_WITHOUT_CHECKS

   Bases: :py:obj:`tuple`


   .. py:attribute:: code


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_COLDKEY_AUTO_STAKE_HOTKEY

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_COMMITMENT

   Bases: :py:obj:`tuple`


   .. py:attribute:: info


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_ELASTICITY

   Bases: :py:obj:`tuple`


   .. py:attribute:: elasticity


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_FEE_RATE

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: rate


   .. py:attribute:: wallet


.. py:class:: SET_HEAP_PAGES

   Bases: :py:obj:`tuple`


   .. py:attribute:: pages


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_IDENTITY

   Bases: :py:obj:`tuple`


   .. py:attribute:: identified


   .. py:attribute:: info


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_IDENTITY

   Bases: :py:obj:`tuple`


   .. py:attribute:: additional


   .. py:attribute:: description


   .. py:attribute:: discord


   .. py:attribute:: github_repo


   .. py:attribute:: image


   .. py:attribute:: name


   .. py:attribute:: pallet


   .. py:attribute:: url


   .. py:attribute:: wallet


.. py:class:: SET_KEY

   Bases: :py:obj:`tuple`


   .. py:attribute:: new


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_MAX_EXTRINSIC_WEIGHT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: SET_MAX_PENDING_EXTRINSICS_NUMBER

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: SET_MAX_SPACE

   Bases: :py:obj:`tuple`


   .. py:attribute:: new_limit


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_MECHANISM_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: dests


   .. py:attribute:: mecid


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: version_key


   .. py:attribute:: wallet


   .. py:attribute:: weights


.. py:class:: SET_OLDEST_STORED_ROUND

   Bases: :py:obj:`tuple`


   .. py:attribute:: oldest_round


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_ON_INITIALIZE_WEIGHT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: SET_PENDING_CHILDKEY_COOLDOWN

   Bases: :py:obj:`tuple`


   .. py:attribute:: cooldown


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_REAL_PAYS_FEE

   Bases: :py:obj:`tuple`


   .. py:attribute:: delegate


   .. py:attribute:: pallet


   .. py:attribute:: pays_fee


   .. py:attribute:: wallet


.. py:class:: SET_RETRY

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: period


   .. py:attribute:: retries


   .. py:attribute:: task


   .. py:attribute:: wallet


.. py:class:: SET_RETRY_NAMED

   Bases: :py:obj:`tuple`


   .. py:attribute:: id


   .. py:attribute:: pallet


   .. py:attribute:: period


   .. py:attribute:: retries


   .. py:attribute:: wallet


.. py:class:: SET_ROOT_CLAIM_TYPE

   Bases: :py:obj:`tuple`


   .. py:attribute:: new_root_claim_type


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_STORAGE

   Bases: :py:obj:`tuple`


   .. py:attribute:: items


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SET_STORED_EXTRINSIC_LIFETIME

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: SET_SUBNET_IDENTITY

   Bases: :py:obj:`tuple`


   .. py:attribute:: additional


   .. py:attribute:: description


   .. py:attribute:: discord


   .. py:attribute:: github_repo


   .. py:attribute:: logo_url


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: subnet_contact


   .. py:attribute:: subnet_name


   .. py:attribute:: subnet_url


   .. py:attribute:: wallet


.. py:class:: SET_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: dests


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: version_key


   .. py:attribute:: wallet


   .. py:attribute:: weights


.. py:class:: SET_WHITELIST

   Bases: :py:obj:`tuple`


   .. py:attribute:: new


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: START_CALL

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: STORE_ENCRYPTED

   Bases: :py:obj:`tuple`


   .. py:attribute:: encrypted_call


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SUBMIT_ENCRYPTED

   Bases: :py:obj:`tuple`


   .. py:attribute:: ciphertext


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SUDO

   Bases: :py:obj:`tuple`


   .. py:attribute:: call


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SWAP_AUTHORITIES

   Bases: :py:obj:`tuple`


   .. py:attribute:: new_authorities


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SWAP_COLDKEY

   Bases: :py:obj:`tuple`


   .. py:attribute:: new_coldkey


   .. py:attribute:: old_coldkey


   .. py:attribute:: pallet


   .. py:attribute:: swap_cost


   .. py:attribute:: wallet


.. py:class:: SWAP_COLDKEY_ANNOUNCED

   Bases: :py:obj:`tuple`


   .. py:attribute:: new_coldkey


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SWAP_HOTKEY

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: new_hotkey


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SWAP_HOTKEY_V2

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: keep_stake


   .. py:attribute:: netuid


   .. py:attribute:: new_hotkey


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SWAP_STAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: alpha_amount


   .. py:attribute:: destination_netuid


   .. py:attribute:: hotkey


   .. py:attribute:: origin_netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: SWAP_STAKE_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: allow_partial


   .. py:attribute:: alpha_amount


   .. py:attribute:: destination_netuid


   .. py:attribute:: hotkey


   .. py:attribute:: limit_price


   .. py:attribute:: origin_netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: TERMINATE_LEASE

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: lease_id


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: TOGGLE_USER_LIQUIDITY

   Bases: :py:obj:`tuple`


   .. py:attribute:: enable


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: TRANSACT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: transaction


   .. py:attribute:: wallet


.. py:class:: TRANSFER_ALL

   Bases: :py:obj:`tuple`


   .. py:attribute:: dest


   .. py:attribute:: keep_alive


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: TRANSFER_ALLOW_DEATH

   Bases: :py:obj:`tuple`


   .. py:attribute:: dest


   .. py:attribute:: pallet


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: TRANSFER_KEEP_ALIVE

   Bases: :py:obj:`tuple`


   .. py:attribute:: dest


   .. py:attribute:: pallet


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: TRANSFER_STAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: alpha_amount


   .. py:attribute:: destination_coldkey


   .. py:attribute:: destination_netuid


   .. py:attribute:: hotkey


   .. py:attribute:: origin_netuid


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: TRY_ASSOCIATE_HOTKEY

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: UNNOTE_PREIMAGE

   Bases: :py:obj:`tuple`


   .. py:attribute:: hash


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: UNREQUEST_PREIMAGE

   Bases: :py:obj:`tuple`


   .. py:attribute:: hash


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: UNSTAKE_ALL

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: UNSTAKE_ALL_ALPHA

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: UPDATE_CAP

   Bases: :py:obj:`tuple`


   .. py:attribute:: crowdloan_id


   .. py:attribute:: new_cap


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: UPDATE_END

   Bases: :py:obj:`tuple`


   .. py:attribute:: crowdloan_id


   .. py:attribute:: new_end


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: UPDATE_MIN_CONTRIBUTION

   Bases: :py:obj:`tuple`


   .. py:attribute:: crowdloan_id


   .. py:attribute:: new_min_contribution


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: UPDATE_SYMBOL

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: symbol


   .. py:attribute:: wallet


.. py:class:: UPGRADE_ACCOUNTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: wallet


   .. py:attribute:: who


.. py:class:: UPLOAD_CODE

   Bases: :py:obj:`tuple`


   .. py:attribute:: code


   .. py:attribute:: determinism


   .. py:attribute:: pallet


   .. py:attribute:: storage_deposit_limit


   .. py:attribute:: wallet


.. py:class:: WITHDRAW

   Bases: :py:obj:`tuple`


   .. py:attribute:: address


   .. py:attribute:: pallet


   .. py:attribute:: value


   .. py:attribute:: wallet


.. py:class:: WITHDRAW

   Bases: :py:obj:`tuple`


   .. py:attribute:: crowdloan_id


   .. py:attribute:: pallet


   .. py:attribute:: wallet


.. py:class:: WITH_WEIGHT

   Bases: :py:obj:`tuple`


   .. py:attribute:: call


   .. py:attribute:: pallet


   .. py:attribute:: wallet


   .. py:attribute:: weight


.. py:class:: WRITE_PULSE

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: pulses_payload


   .. py:attribute:: signature


   .. py:attribute:: wallet


