bittensor\_wallet.keyfile
=========================

.. automodule:: bittensor_wallet.keyfile

   
   .. autosummary::
   
      ~bittensor_wallet.keyfile.ask_password
      ~bittensor_wallet.keyfile.decrypt_keyfile_data
      ~bittensor_wallet.keyfile.deserialize_keypair_from_keyfile_data
      ~bittensor_wallet.keyfile.encrypt_keyfile_data
      ~bittensor_wallet.keyfile.get_coldkey_password_from_environment
      ~bittensor_wallet.keyfile.get_password_from_environment
      ~bittensor_wallet.keyfile.keyfile_data_encryption_method
      ~bittensor_wallet.keyfile.keyfile_data_is_encrypted
      ~bittensor_wallet.keyfile.keyfile_data_is_encrypted_ansible
      ~bittensor_wallet.keyfile.keyfile_data_is_encrypted_legacy
      ~bittensor_wallet.keyfile.keyfile_data_is_encrypted_nacl
      ~bittensor_wallet.keyfile.legacy_encrypt_keyfile_data
      ~bittensor_wallet.keyfile.serialized_keypair_to_keyfile_data
      ~bittensor_wallet.keyfile.validate_password
      ~bittensor_wallet.keyfile.Keyfile
   
   Module Contents
   ---------------
   
   .. rubric:: Functions Details
   
   .. automodule:: bittensor_wallet.keyfile
      :members:
      :undoc-members:
      :imported-members:
      :exclude-members: ask_password_to_encrypt
      :show-inheritance:
   
   .. rubric:: Classes Details
   
   .. autoclass:: bittensor_wallet.keyfile.Keyfile
      :show-inheritance:
      :special-members: __init__
      
      .. automethod:: check_and_update_encryption
      .. automethod:: decrypt
      .. automethod:: encrypt
      .. automethod:: env_var_name
      .. automethod:: exists_on_device
      .. automethod:: get_keypair
      .. automethod:: is_encrypted
      .. automethod:: is_readable
      .. automethod:: is_writable
      .. automethod:: make_dirs
      .. automethod:: set_keypair
      .. autoattribute:: data
      .. autoattribute:: keyfile_data
      .. autoattribute:: get_name
      .. autoattribute:: get_path

