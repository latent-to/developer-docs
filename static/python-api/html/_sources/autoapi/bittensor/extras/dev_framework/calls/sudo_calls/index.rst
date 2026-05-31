bittensor.extras.dev_framework.calls.sudo_calls
===============================================

.. py:module:: bittensor.extras.dev_framework.calls.sudo_calls

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

   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_AS
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_ACTIVITY_CUTOFF
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_ADJUSTMENT_ALPHA
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_ADJUSTMENT_INTERVAL
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_ADMIN_FREEZE_WINDOW
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_ALPHA_SIGMOID_STEEPNESS
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_ALPHA_VALUES
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_BONDS_MOVING_AVERAGE
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_BONDS_PENALTY
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_BONDS_RESET_ENABLED
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_BURN_HALF_LIFE
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_BURN_INCREASE_MULT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_CK_BURN
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_COLDKEY_SWAP_ANNOUNCEMENT_DELAY
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_COLDKEY_SWAP_REANNOUNCEMENT_DELAY
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_COMMIT_REVEAL_VERSION
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_COMMIT_REVEAL_WEIGHTS_ENABLED
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_COMMIT_REVEAL_WEIGHTS_INTERVAL
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_DEFAULT_TAKE
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_DIFFICULTY
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_DISSOLVE_NETWORK_SCHEDULE_DURATION
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_EMA_PRICE_HALVING_PERIOD
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_EVM_CHAIN_ID
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_IMMUNITY_PERIOD
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_KAPPA
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_LIQUID_ALPHA_ENABLED
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_LOCK_REDUCTION_INTERVAL
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MAX_ALLOWED_UIDS
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MAX_ALLOWED_VALIDATORS
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MAX_BURN
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MAX_CHILDKEY_TAKE
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MAX_DIFFICULTY
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MAX_MECHANISM_COUNT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MAX_REGISTRATIONS_PER_BLOCK
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MECHANISM_COUNT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MECHANISM_EMISSION_SPLIT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MIN_ALLOWED_UIDS
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MIN_ALLOWED_WEIGHTS
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MIN_BURN
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MIN_CHILDKEY_TAKE
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MIN_DELEGATE_TAKE
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MIN_DIFFICULTY
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_MIN_NON_IMMUNE_UIDS
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_NETWORK_IMMUNITY_PERIOD
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_NETWORK_MIN_LOCK_COST
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_NETWORK_POW_REGISTRATION_ALLOWED
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_NETWORK_RATE_LIMIT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_NETWORK_REGISTRATION_ALLOWED
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_NOMINATOR_MIN_REQUIRED_STAKE
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_NUM_ROOT_CLAIMS
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_OWNER_HPARAM_RATE_LIMIT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_OWNER_IMMUNE_NEURON_LIMIT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_RAO_RECYCLED
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_RECYCLE_OR_BURN
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_RHO
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_ROOT_CLAIM_THRESHOLD
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_SERVING_RATE_LIMIT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_SN_OWNER_HOTKEY
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_STAKE_THRESHOLD
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_START_CALL_DELAY
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_SUBNET_LIMIT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_SUBNET_MOVING_ALPHA
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_SUBNET_OWNER_CUT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_SUBNET_OWNER_HOTKEY
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_SUBTOKEN_ENABLED
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_TAO_FLOW_CUTOFF
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_TAO_FLOW_NORMALIZATION_EXPONENT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_TAO_FLOW_SMOOTHING_FACTOR
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_TARGET_REGISTRATIONS_PER_INTERVAL
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_TEMPO
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_TOGGLE_TRANSFER
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_TOTAL_ISSUANCE
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_TX_CHILDKEY_TAKE_RATE_LIMIT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_TX_DELEGATE_TAKE_RATE_LIMIT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_TX_RATE_LIMIT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_VOTING_POWER_EMA_ALPHA
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_WEIGHTS_SET_RATE_LIMIT
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_WEIGHTS_VERSION_KEY
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_SET_YUMA3_ENABLED
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_TOGGLE_EVM_PRECOMPILE
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_TRIM_TO_MAX_ALLOWED_UIDS
   bittensor.extras.dev_framework.calls.sudo_calls.SUDO_UNCHECKED_WEIGHT


Module Contents
---------------

.. py:class:: SUDO_AS

   Bases: :py:obj:`tuple`


   .. py:attribute:: call


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


   .. py:attribute:: who


.. py:class:: SUDO_SET_ACTIVITY_CUTOFF

   Bases: :py:obj:`tuple`


   .. py:attribute:: activity_cutoff


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_ADJUSTMENT_ALPHA

   Bases: :py:obj:`tuple`


   .. py:attribute:: adjustment_alpha


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_ADJUSTMENT_INTERVAL

   Bases: :py:obj:`tuple`


   .. py:attribute:: adjustment_interval


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_ADMIN_FREEZE_WINDOW

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


   .. py:attribute:: window


.. py:class:: SUDO_SET_ALPHA_SIGMOID_STEEPNESS

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: steepness


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_ALPHA_VALUES

   Bases: :py:obj:`tuple`


   .. py:attribute:: alpha_high


   .. py:attribute:: alpha_low


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_BONDS_MOVING_AVERAGE

   Bases: :py:obj:`tuple`


   .. py:attribute:: bonds_moving_average


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_BONDS_PENALTY

   Bases: :py:obj:`tuple`


   .. py:attribute:: bonds_penalty


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_BONDS_RESET_ENABLED

   Bases: :py:obj:`tuple`


   .. py:attribute:: enabled


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_BURN_HALF_LIFE

   Bases: :py:obj:`tuple`


   .. py:attribute:: burn_half_life


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_BURN_INCREASE_MULT

   Bases: :py:obj:`tuple`


   .. py:attribute:: burn_increase_mult


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_CK_BURN

   Bases: :py:obj:`tuple`


   .. py:attribute:: burn


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_COLDKEY_SWAP_ANNOUNCEMENT_DELAY

   Bases: :py:obj:`tuple`


   .. py:attribute:: duration


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_COLDKEY_SWAP_REANNOUNCEMENT_DELAY

   Bases: :py:obj:`tuple`


   .. py:attribute:: duration


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_COMMIT_REVEAL_VERSION

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: version


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_COMMIT_REVEAL_WEIGHTS_ENABLED

   Bases: :py:obj:`tuple`


   .. py:attribute:: enabled


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_COMMIT_REVEAL_WEIGHTS_INTERVAL

   Bases: :py:obj:`tuple`


   .. py:attribute:: interval


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_DEFAULT_TAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: default_take


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_DIFFICULTY

   Bases: :py:obj:`tuple`


   .. py:attribute:: difficulty


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_DISSOLVE_NETWORK_SCHEDULE_DURATION

   Bases: :py:obj:`tuple`


   .. py:attribute:: duration


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_EMA_PRICE_HALVING_PERIOD

   Bases: :py:obj:`tuple`


   .. py:attribute:: ema_halving


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_EVM_CHAIN_ID

   Bases: :py:obj:`tuple`


   .. py:attribute:: chain_id


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_IMMUNITY_PERIOD

   Bases: :py:obj:`tuple`


   .. py:attribute:: immunity_period


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_KAPPA

   Bases: :py:obj:`tuple`


   .. py:attribute:: kappa


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_LIQUID_ALPHA_ENABLED

   Bases: :py:obj:`tuple`


   .. py:attribute:: enabled


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_LOCK_REDUCTION_INTERVAL

   Bases: :py:obj:`tuple`


   .. py:attribute:: interval


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MAX_ALLOWED_UIDS

   Bases: :py:obj:`tuple`


   .. py:attribute:: max_allowed_uids


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MAX_ALLOWED_VALIDATORS

   Bases: :py:obj:`tuple`


   .. py:attribute:: max_allowed_validators


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MAX_BURN

   Bases: :py:obj:`tuple`


   .. py:attribute:: max_burn


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MAX_CHILDKEY_TAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: take


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MAX_DIFFICULTY

   Bases: :py:obj:`tuple`


   .. py:attribute:: max_difficulty


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MAX_MECHANISM_COUNT

   Bases: :py:obj:`tuple`


   .. py:attribute:: max_mechanism_count


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MAX_REGISTRATIONS_PER_BLOCK

   Bases: :py:obj:`tuple`


   .. py:attribute:: max_registrations_per_block


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MECHANISM_COUNT

   Bases: :py:obj:`tuple`


   .. py:attribute:: mechanism_count


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MECHANISM_EMISSION_SPLIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: maybe_split


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MIN_ALLOWED_UIDS

   Bases: :py:obj:`tuple`


   .. py:attribute:: min_allowed_uids


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MIN_ALLOWED_WEIGHTS

   Bases: :py:obj:`tuple`


   .. py:attribute:: min_allowed_weights


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MIN_BURN

   Bases: :py:obj:`tuple`


   .. py:attribute:: min_burn


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MIN_CHILDKEY_TAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: take


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MIN_DELEGATE_TAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: take


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MIN_DIFFICULTY

   Bases: :py:obj:`tuple`


   .. py:attribute:: min_difficulty


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_MIN_NON_IMMUNE_UIDS

   Bases: :py:obj:`tuple`


   .. py:attribute:: min


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_NETWORK_IMMUNITY_PERIOD

   Bases: :py:obj:`tuple`


   .. py:attribute:: immunity_period


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_NETWORK_MIN_LOCK_COST

   Bases: :py:obj:`tuple`


   .. py:attribute:: lock_cost


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_NETWORK_POW_REGISTRATION_ALLOWED

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: registration_allowed


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_NETWORK_RATE_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: rate_limit


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_NETWORK_REGISTRATION_ALLOWED

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: registration_allowed


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_NOMINATOR_MIN_REQUIRED_STAKE

   Bases: :py:obj:`tuple`


   .. py:attribute:: min_stake


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_NUM_ROOT_CLAIMS

   Bases: :py:obj:`tuple`


   .. py:attribute:: new_value


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_OWNER_HPARAM_RATE_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: epochs


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_OWNER_IMMUNE_NEURON_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: immune_neurons


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_RAO_RECYCLED

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: rao_recycled


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_RECYCLE_OR_BURN

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: recycle_or_burn


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_RHO

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: rho


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_ROOT_CLAIM_THRESHOLD

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: new_value


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_SERVING_RATE_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: serving_rate_limit


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_SN_OWNER_HOTKEY

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_STAKE_THRESHOLD

   Bases: :py:obj:`tuple`


   .. py:attribute:: min_stake


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_START_CALL_DELAY

   Bases: :py:obj:`tuple`


   .. py:attribute:: delay


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_SUBNET_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: max_subnets


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_SUBNET_MOVING_ALPHA

   Bases: :py:obj:`tuple`


   .. py:attribute:: alpha


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_SUBNET_OWNER_CUT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: subnet_owner_cut


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_SUBNET_OWNER_HOTKEY

   Bases: :py:obj:`tuple`


   .. py:attribute:: hotkey


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_SUBTOKEN_ENABLED

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: subtoken_enabled


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_TAO_FLOW_CUTOFF

   Bases: :py:obj:`tuple`


   .. py:attribute:: flow_cutoff


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_TAO_FLOW_NORMALIZATION_EXPONENT

   Bases: :py:obj:`tuple`


   .. py:attribute:: exponent


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_TAO_FLOW_SMOOTHING_FACTOR

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: smoothing_factor


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_TARGET_REGISTRATIONS_PER_INTERVAL

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: target_registrations_per_interval


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_TEMPO

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: tempo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_TOGGLE_TRANSFER

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: toggle


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_TOTAL_ISSUANCE

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: total_issuance


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_TX_CHILDKEY_TAKE_RATE_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: tx_rate_limit


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_TX_DELEGATE_TAKE_RATE_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: tx_rate_limit


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_TX_RATE_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: tx_rate_limit


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_VOTING_POWER_EMA_ALPHA

   Bases: :py:obj:`tuple`


   .. py:attribute:: alpha


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_SET_WEIGHTS_SET_RATE_LIMIT

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


   .. py:attribute:: weights_set_rate_limit


.. py:class:: SUDO_SET_WEIGHTS_VERSION_KEY

   Bases: :py:obj:`tuple`


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


   .. py:attribute:: weights_version_key


.. py:class:: SUDO_SET_YUMA3_ENABLED

   Bases: :py:obj:`tuple`


   .. py:attribute:: enabled


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_TOGGLE_EVM_PRECOMPILE

   Bases: :py:obj:`tuple`


   .. py:attribute:: enabled


   .. py:attribute:: pallet


   .. py:attribute:: precompile_id


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_TRIM_TO_MAX_ALLOWED_UIDS

   Bases: :py:obj:`tuple`


   .. py:attribute:: max_n


   .. py:attribute:: netuid


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


.. py:class:: SUDO_UNCHECKED_WEIGHT

   Bases: :py:obj:`tuple`


   .. py:attribute:: call


   .. py:attribute:: pallet


   .. py:attribute:: sudo


   .. py:attribute:: wallet


   .. py:attribute:: weight


