bittensor.utils.version
=======================

.. py:module:: bittensor.utils.version


Attributes
----------

.. autoapisummary::

   bittensor.utils.version.VERSION_CHECK_THRESHOLD


Exceptions
----------

.. autoapisummary::

   bittensor.utils.version.VersionCheckError


Functions
---------

.. autoapisummary::

   bittensor.utils.version.check_latest_version_in_pypi
   bittensor.utils.version.check_version
   bittensor.utils.version.get_and_save_latest_version


Module Contents
---------------

.. py:data:: VERSION_CHECK_THRESHOLD
   :value: 86400


.. py:exception:: VersionCheckError

   Bases: :py:obj:`Exception`


   Exception raised for errors in the version check process.

   Initialize self.  See help(type(self)) for accurate signature.


.. py:function:: check_latest_version_in_pypi()

   Check for the latest version of the package on PyPI.


.. py:function:: check_version(timeout = 15)

   Check if the current version of Bittensor is up-to-date with the latest version on PyPi.
   Raises a VersionCheckError if the version check fails.

   :param timeout: The timeout for the request to PyPI in seconds.


.. py:function:: get_and_save_latest_version(timeout = 15)

   Retrieves and saves the latest version of Bittensor.

   :param timeout: The timeout for the request to PyPI in seconds.

   :returns: The latest version of Bittensor.


