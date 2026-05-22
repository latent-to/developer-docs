bittensor.core.dendrite
=======================

.. py:module:: bittensor.core.dendrite


Attributes
----------

.. autoapisummary::

   bittensor.core.dendrite.BaseModel
   bittensor.core.dendrite.DENDRITE_DEFAULT_ERROR
   bittensor.core.dendrite.DENDRITE_ERROR_MAPPING


Classes
-------

.. autoapisummary::

   bittensor.core.dendrite.Dendrite
   bittensor.core.dendrite.DendriteMixin


Functions
---------

.. autoapisummary::

   bittensor.core.dendrite.call
   bittensor.core.dendrite.event_loop_is_running


Module Contents
---------------

.. py:data:: BaseModel
   :type:  Union[bittensor.utils.registration.torch.nn.Module, object]

.. py:data:: DENDRITE_DEFAULT_ERROR
   :value: ('422', 'Failed to parse response')


.. py:data:: DENDRITE_ERROR_MAPPING
   :type:  dict[Type[Exception], tuple]

.. py:class:: Dendrite(wallet = None)

   Bases: :py:obj:`DendriteMixin`, :py:obj:`BaseModel`


   The Dendrite class represents the abstracted implementation of a network client module.

   In the brain analogy, dendrites receive signals
   from other neurons (in this case, network servers or axons), and the Dendrite class here is designed
   to send requests to those endpoint to receive inputs.

   This class includes a wallet or keypair used for signing messages, and methods for making
   HTTP requests to the network servers. It also provides functionalities such as logging
   network requests and processing server responses.

   :param keypair: The wallet or keypair used for signing messages.
   :param external_ip: The external IP address of the local system.
   :param synapse_history: A list of Synapse objects representing the historical responses.

   .. method:: __str__()

      Returns a string representation of the Dendrite object.

   .. method:: __repr__()

      Returns a string representation of the Dendrite object, acting as a fallback for __str__().

   .. method:: query(self, *args, **kwargs) -> Union[Synapse, list[Synapse]]

      Makes synchronous requests to one or multiple
      target Axons and returns responses.

   .. method:: forward(self, axons, synapse=Synapse(), timeout=12, deserialize=True, run_async=True, streaming=False) ->

      
      Synapse: Asynchronously sends requests to one or multiple Axons and collates their responses.

   .. method:: call(self, target_axon, synapse=Synapse(), timeout=12.0, deserialize=True) -> Synapse

      Asynchronously sends a
      request to a specified Axon and processes the response.

   .. method:: call_stream(self, target_axon, synapse=Synapse(), timeout=12.0, deserialize=True) ->

      
      AsyncGenerator[Synapse, None]: Sends a request to a specified Axon and yields an AsyncGenerator that
      contains streaming response chunks before finally yielding the filled Synapse as the final element.

   .. method:: preprocess_synapse_for_request(self, target_axon_info, synapse, timeout=12.0) -> Synapse

      Preprocesses the
      synapse for making a request, including building headers and signing.

   .. method:: process_server_response(self, server_response, json_response, local_synapse)

      Processes the server response,
      updates the local synapse state, and merges headers.

   .. method:: close_session(self)

      Synchronously closes the internal aiohttp client session.

   .. method:: aclose_session(self)

      Asynchronously closes the internal aiohttp client session.
      

   .. note:: When working with async `aiohttp <https://github.com/aio-libs/aiohttp>`_ client sessions, it is recommended to use a context manager.

   Example with a context manager::

       async with dendrite(wallet = bittensor_wallet.Wallet()) as d:
           print(d)
           d( <axon> ) # ping axon
           d( [<axons>] ) # ping multiple
           d( Axon(), Synapse )

   However, you are able to safely call :func:`dendrite.query()` without a context manager in a synchronous setting.

   Example without a context manager::

       d = dendrite(wallet = bittensor_wallet.Wallet() )
       print(d)
       d( <axon> ) # ping axon
       d( [<axons>] ) # ping multiple
       d( bittensor.core.axon.Axon, bittensor.core.synapse.Synapse )

   Initializes the Dendrite object, setting up essential properties.

   :param wallet: The user's wallet or keypair used for signing messages.


.. py:class:: DendriteMixin(wallet = None)

   The Dendrite class represents the abstracted implementation of a network client module.

   In the brain analogy, dendrites receive signals
   from other neurons (in this case, network servers or axons), and the Dendrite class here is designed
   to send requests to those endpoint to receive inputs.

   This class includes a wallet or keypair used for signing messages, and methods for making
   HTTP requests to the network servers. It also provides functionalities such as logging
   network requests and processing server responses.

   :param keypair: The wallet or keypair used for signing messages.
   :param external_ip: The external IP address of the local system.
   :param synapse_history: A list of Synapse objects representing the historical responses.

   .. method:: __str__()

      Returns a string representation of the Dendrite object.

   .. method:: __repr__()

      Returns a string representation of the Dendrite object, acting as a fallback for __str__().

   .. method:: query(self, *args, **kwargs) -> Union[Synapse, list[Synapse]]

      Makes synchronous requests to one or multiple
      target Axons and returns responses.

   .. method:: forward(self, axons, synapse=Synapse(), timeout=12, deserialize=True, run_async=True, streaming=False) ->

      
      Synapse: Asynchronously sends requests to one or multiple Axons and collates their responses.

   .. method:: call(self, target_axon, synapse=Synapse(), timeout=12.0, deserialize=True) -> Synapse

      Asynchronously sends a
      request to a specified Axon and processes the response.

   .. method:: call_stream(self, target_axon, synapse=Synapse(), timeout=12.0, deserialize=True) ->

      
      AsyncGenerator[Synapse, None]: Sends a request to a specified Axon and yields an AsyncGenerator that
      contains streaming response chunks before finally yielding the filled Synapse as the final element.

   .. method:: preprocess_synapse_for_request(self, target_axon_info, synapse, timeout=12.0) -> Synapse

      Preprocesses the
      synapse for making a request, including building headers and signing.

   .. method:: process_server_response(self, server_response, json_response, local_synapse)

      Processes the server response,
      updates the local synapse state, and merges headers.

   .. method:: close_session(self)

      Synchronously closes the internal aiohttp client session.

   .. method:: aclose_session(self)

      Asynchronously closes the internal aiohttp client session.
      

   .. note:: When working with async `aiohttp <https://github.com/aio-libs/aiohttp>`_ client sessions, it is recommended to use a context manager.

   Example with a context manager::

       async with dendrite(wallet = bittensor_wallet.Wallet()) as d:
           print(d)
           d( <axon> ) # ping axon
           d( [<axons>] ) # ping multiple
           d( Axon(), Synapse )

   However, you are able to safely call :func:`dendrite.query()` without a context manager in a synchronous setting.

   Example without a context manager::

       d = dendrite(wallet = bittensor_wallet.Wallet() )
       print(d)
       d( <axon> ) # ping axon
       d( [<axons>] ) # ping multiple
       d( bittensor.core.axon.Axon, bittensor.core.synapse.Synapse )

   Initializes the Dendrite object, setting up essential properties.

   :param wallet: The user's wallet or keypair used for signing messages.


   .. py:method:: aclose_session()
      :async:


      Asynchronously closes the internal `aiohttp <https://github.com/aio-libs/aiohttp>`_ client session.

      This method is the asynchronous counterpart to the :func:`close_session` method. It should be used in
      asynchronous contexts to ensure that the aiohttp client session is closed properly. The method
      releases resources associated with the session, such as open connections and internal buffers,
      which is essential for resource management in asynchronous applications.

      .. admonition:: Example

         Usage::
             When finished with dendrite in an asynchronous context
             await :func:`dendrite_instance.aclose_session()`.

      .. admonition:: Example

         Usage::
             async with dendrite_instance:
                 # Operations using dendrite
                 pass
             # The session will be closed automatically after the above block



   .. py:method:: aquery(*args, **kwargs)
      :async:



   .. py:method:: call(target_axon, synapse = Synapse(), timeout = 12.0, deserialize = True)
      :async:


      Asynchronously sends a request to a specified Axon and processes the response.

      This function establishes a connection with a specified Axon, sends the encapsulated data through the Synapse
      object, waits for a response, processes it, and then returns the updated Synapse object.

      :param target_axon: The target Axon to send the request to.
      :param synapse: The Synapse object encapsulating the data.
      :param timeout: Maximum duration to wait for a response from the Axon in seconds.
      :param deserialize: Determines if the received response should be deserialized.

      :returns: The Synapse object, updated with the response data from the Axon.
      :rtype: bittensor.core.synapse.Synapse



   .. py:method:: call_stream(target_axon, synapse = Synapse(), timeout = 12.0, deserialize = True)
      :async:


      Sends a request to a specified Axon and yields streaming responses.

      Similar to ``call``, but designed for scenarios where the Axon sends back data in
      multiple chunks or streams. The function yields each chunk as it is received. This is
      useful for processing large responses piece by piece without waiting for the entire
      data to be transmitted.

      :param target_axon: The target Axon to send the request to.
      :param synapse: The Synapse object encapsulating the data.
      :param timeout: Maximum duration to wait for a response (or a chunk of the response) from the Axon in seconds.
      :param deserialize: Determines if each received chunk should be deserialized.

      :Yields: *object* -- Each yielded object contains a chunk of the arbitrary response data from the Axon.
               bittensor.core.synapse.Synapse: After the AsyncGenerator has been exhausted, yields the final filled Synapse.



   .. py:method:: close_session(using_new_loop = False)

      Closes the internal `aiohttp <https://github.com/aio-libs/aiohttp>`_ client session synchronously.

      This method ensures the proper closure and cleanup of the aiohttp client session, releasing any
      resources like open connections and internal buffers. It is crucial for preventing resource leakage
      and should be called when the dendrite instance is no longer in use, especially in synchronous contexts.

      :param using_new_loop: A flag to determine whether this has been called with a new event loop rather than
                             the default. This will indicate whether to close this event loop at the end of this call.

      .. note::

         This method utilizes asyncio's event loop to close the session asynchronously from a synchronous context.
         It is advisable to use this method only when asynchronous context management is not feasible.

      Usage:
          When finished with dendrite in a synchronous context
          :func:`dendrite_instance.close_session()`.



   .. py:attribute:: external_ip


   .. py:method:: forward(axons, synapse = Synapse(), timeout = 12, deserialize = True, run_async = True, streaming = False)
      :async:


      Asynchronously sends requests to one or multiple Axons and collates their responses.

      This function acts as a bridge for sending multiple requests concurrently or sequentially based on the provided
      parameters. It checks the type of the target Axons, preprocesses the requests, and then sends them off. After
      getting the responses, it processes and collates them into a unified format.

      When querying an Axon that sends a single response, this function returns a Synapse object containing the
      response data. If multiple Axons are queried, a list of Synapse objects is returned, each containing the
      response from the corresponding Axon.

      .. admonition:: Example

         ...
         import bittensor
         wallet = bittensor.Wallet()                     # Initialize a wallet
         synapse = bittensor.Synapse(...)                # Create a synapse object that contains query data
         dendrite = bittensor.Dendrite(wallet = wallet)  # Initialize a dendrite instance
         netuid = ...                                    # Provide subnet ID
         metagraph = bittensor.Metagraph(netuid)         # Initialize a metagraph instance
         axons = metagraph.axons                         # Create a list of axons to query
         responses = await dendrite(axons, synapse)      # Send the query to all axons and await the responses

      When querying an Axon that sends back data in chunks using the Dendrite, this function
      returns an AsyncGenerator that yields each chunk as it is received. The generator can be
      iterated over to process each chunk individually.

      .. admonition:: Example

         ...
         dendrite = bittensor.Dendrite(wallet = wallet)
         async for chunk in dendrite.forward(axons, synapse, timeout, deserialize, run_async, streaming):
             # Process each chunk here
             print(chunk)

      :param axons: The target Axons to send requests to. Can be a single Axon or a list of Axons.
      :param synapse: The Synapse object encapsulating the data.
      :param timeout: Maximum duration to wait for a response from an Axon in seconds.
      :param deserialize: Determines if the received response should be deserialized.
      :param run_async: If ``True``, sends requests concurrently. Otherwise, sends requests sequentially.
      :param streaming: Indicates if the response is expected to be in streaming format.

      :returns: If a single `Axon` is targeted, returns its response. If multiple Axons are targeted, returns a list of
                their responses.



   .. py:attribute:: keypair


   .. py:method:: log_exception(exception)

      Logs an exception with a unique identifier.

      This method generates a unique UUID for the error, extracts the error type,
      and logs the error message using Bittensor's logging system.

      :param exception: The exception object to be logged.

      :returns: None



   .. py:method:: preprocess_synapse_for_request(target_axon_info, synapse, timeout = 12.0)

      Preprocesses the synapse for making a request. This includes building headers for Dendrite and Axon and signing
      the request.

      :param target_axon_info: The target axon information.
      :param synapse: The synapse object to be preprocessed.
      :param timeout: The request timeout duration in seconds.

      :returns: The preprocessed synapse.



   .. py:method:: process_error_message(synapse, request_name, exception)

      Handles exceptions that occur during network requests, updating the synapse with appropriate status codes and
      messages.

      This method interprets different types of exceptions and sets the corresponding status code and message in the
      synapse object. It covers common network errors such as connection issues and timeouts.

      :param synapse: The synapse object associated with the request.
      :param request_name: The name of the request during which the exception occurred.
      :param exception: The exception object caught during the request.

      :returns: The updated synapse object with the error status code and message.
      :rtype: Synapse

      .. note:: This method updates the synapse object in-place.



   .. py:method:: process_server_response(server_response, json_response, local_synapse)

      Processes the server response, updates the local synapse state with the server's state and merges headers set
      by the server.

      :param server_response: The `aiohttp <https://github.com/aio-libs/aiohttp>`_ response object from the server.
      :param json_response: The parsed JSON response from the server.
      :param local_synapse: The local synapse object to be updated.

      :raises None: But errors in attribute setting are silently ignored.



   .. py:method:: query(*args, **kwargs)

      Makes a synchronous request to multiple target Axons and returns the server responses.

      Cleanup is automatically handled and sessions are closed upon completed requests.

      :param axons: The list of target Axon information.
      :param synapse: The Synapse object.
      :param timeout: The request timeout duration in seconds.

      :returns: If a single target axon is provided, returns the response from that axon. If multiple target axons are
                provided, returns a list of responses from all target axons.



   .. py:property:: session
      :type: aiohttp.ClientSession


      An asynchronous property that provides access to the internal `aiohttp <https://github.com/aio-libs/aiohttp>`_
      client session.

      This property ensures the management of HTTP connections in an efficient way. It lazily
      initializes the `aiohttp.ClientSession <https://docs.aiohttp.org/en/stable/client_reference.html#aiohttp.ClientSession>`_
      on its first use. The session is then reused for subsequent HTTP requests, offering performance benefits by
      reusing underlying connections.

      This is used internally by the dendrite when querying axons, and should not be used directly
      unless absolutely necessary for your application.

      :returns: The active `aiohttp <https://github.com/aio-libs/aiohttp>`_ client session instance.
                If no session exists, a new one is created and returned. This session is used for asynchronous HTTP requests
                within the dendrite, adhering to the async nature of the network interactions in the Bittensor framework.
      :rtype: aiohttp.ClientSession

      Example usage::

          import bittensor                                # Import bittensor
          wallet = bittensor.Wallet( ... )                # Initialize a wallet
          dendrite = bittensor.Dendrite(wallet=wallet)   # Initialize a dendrite instance with the wallet

          async with (await dendrite.session).post(       # Use the session to make an HTTP POST request
              url,                                        # URL to send the request to
              headers={...},                              # Headers dict to be sent with the request
              json={...},                                 # JSON body data to be sent with the request
              timeout=10,                                 # Timeout duration in seconds
          ) as response:
              json_response = await response.json()       # Extract the JSON response from the server


   .. py:attribute:: synapse_history
      :type:  list
      :value: []



   .. py:attribute:: uuid
      :value: ''



.. py:function:: call(self, *args, **kwargs)
   :async:


.. py:function:: event_loop_is_running()

