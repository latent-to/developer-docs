# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

# project = 'BTCLI Docs'
project = "Bittensor SDK Docs"
copyright = "2025, Opentensor Foundation"
author = "Opentensor Foundation"
# release = '1.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration


import os
import sys

sys.path.insert(0, os.path.abspath(".."))
sys.path.insert(0, os.path.abspath("../.."))

# This below path insert is needed for the source link to work for all
sys.path.insert(0, os.path.abspath("../bittensor"))
# sys.path.insert(0, os.path.abspath('../../btwallet'))
sys.path.append("/Users/chidera/Library/Python/3.9/lib/python/site-packages/")

html_theme = "sphinx_book_theme"
html_theme_options = {
    "show_navbar_depth": 4,
    "logo": {
        "image_light": "_static/logo.svg",
        "image_dark": "_static/logo-dark-mode.svg",
    },
    "repository_url": "https://github.com/opentensor/btcli",
    "use_source_button": True,
    "use_repository_button": True,
    "use_issues_button": True,
}
extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.napoleon",
    "autoapi.extension",
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

# Source directory and ignore patterns for Bittensor SDK
autoapi_dirs = ["/Users/chidera/desktop/work/bittensor/bittensor-sdk"]
autoapi_ignore = [
    "*e2e*",
    "*setup*",
    "*test*",
    "*mock*",
    "*/site-packages/*",
    "*post*",
    "*cli*",
    "chain_interactions",
    "*/mock/*",
    "*/tests/*",
]
autoapi_python_class_content = "both"
autodoc_typehints = "description"
autodoc_default_options = {
    "special-members": "__init__",
}
autoapi_options = [
    "members",
    "undoc-members",
    "show-inheritance",
    "show-module-summary",
]
autoapi_keep_files = False

# Legacy stuff
# autoapi_ignore = ["*axon*", "*btlogging*", "*chain_data*", "*cli*", "*config*", "*dendrite*", "*errors*", "*keyfile*", "metagraph*", "*stream*", "*subtensor*", "*synapse*", "*tensor*", "*threadpool*", "*types*", "*wallet*", "*mock*", "*utils*", "*setup*"]

autoapi_member_order = "alphabetical"
templates_path = ["_templates"]
exclude_patterns = []

# Make Sphinx more tolerant of formatting issues
suppress_warnings = ["autoapi", "autosectionlabel.*"]
nitpicky = False

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_static_path = ["_static"]
html_css_files = ["bittensor-custom.css"]
