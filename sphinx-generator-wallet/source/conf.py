# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

# project = 'BTCLI Docs'
project = "Bittensor Wallet SDK Docs"
copyright = "2025, Opentensor Foundation"
author = "Opentensor Foundation"
# release = '1.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration


import os
import site
import sys

# Add current directory and parent directories to path for local imports
sys.path.insert(0, os.path.abspath("."))
sys.path.insert(0, os.path.abspath(".."))

# Add site-packages to path (where bittensor_wallet will be installed)
for site_path in site.getsitepackages():
    if site_path not in sys.path:
        sys.path.append(site_path)

html_theme = "sphinx_book_theme"
html_theme_options = {
    "show_navbar_depth": 4,
    "logo": {
        "image_light": "_static/logo.svg",
        "image_dark": "_static/logo-dark-mode.svg",
    },
    "repository_url": "https://github.com/RaoFoundation/btwallet",
    "use_source_button": True,
    "use_repository_button": True,
    "use_issues_button": True,
}
extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.autosummary",
    "sphinx.ext.napoleon",
    "sphinx.ext.viewcode",
    "myst_parser",
    "sphinx.ext.intersphinx",
]

myst_enable_extensions = ["dollarmath", "amsmath"]

# Napoleon settings
napoleon_google_docstring = True
napoleon_numpy_docstring = False
napoleon_include_init_with_doc = True
napoleon_include_private_with_doc = True
napoleon_include_special_with_doc = True
napoleon_use_admonition_for_examples = True
napoleon_use_admonition_for_notes = True
napoleon_use_admonition_for_references = True
napoleon_use_ivar = True

intersphinx_mapping = {
    "python": ("https://docs.python.org/3", None),
    "numpy": ("https://numpy.org/doc/stable/", None),
    "torch": ("https://pytorch.org/docs/stable/", None),
    "pydantic": ("https://docs.pydantic.dev/latest/", None),
}

autosummary_generate = True
autosummary_imported_members = True  # Include imported members to get class methods
autosummary_ignore_module_all = False
# Mock the mock module so autosummary can handle it without importing
autodoc_mock_imports = ["bittensor_wallet.mock", "Crypto"]
autodoc_typehints = "description"
autodoc_default_options = {
    "members": True,
    "undoc-members": True,
    "show-inheritance": True,
    "special-members": "__init__",
    "no-index": True,
}
templates_path = []
# Exclude mock module from being documented
exclude_patterns = ["generated/bittensor_wallet.mock.rst"]

# Make Sphinx more tolerant of formatting issues
suppress_warnings = [
    "autosectionlabel.*",
    "autosummary.*mock",  # Suppress warnings about mock module (test-only, not needed for docs)
    "autosummary:failed to import mock",  # Suppress specific mock import warnings
]
nitpicky = False

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_static_path = ["_static"]
html_css_files = ["bittensor-custom.css"]

from docstring_utils import format_docstring, load_rust_docstrings, needs_reformatting

DOC_OVERRIDES = load_rust_docstrings()


def _short_name(fullname: str) -> str:
    return fullname.split(".")[-1]


def handle_autodoc(app, what, name, obj, options, lines):
    existing = "\n".join(lines).strip()
    source_text = existing
    key = _short_name(name)
    
    # Try to get docstring from overrides if missing or needs reformatting
    if not source_text:
        source_text = DOC_OVERRIDES.get(key, "")
    elif needs_reformatting(source_text):
        # If existing docstring needs reformatting, use it
        pass
    else:
        # If docstring exists and doesn't need reformatting, return early
        return
    
    if not source_text:
        return
    
    formatted = format_docstring(source_text)
    if formatted:
        lines[:] = formatted


def setup(app):
    app.connect("autodoc-process-docstring", handle_autodoc)
