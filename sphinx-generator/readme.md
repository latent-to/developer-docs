# Generating Bittensor Python SDK Documentation with Sphinx

This guide explains how to build and publish the Bittensor Python API reference documentation using Sphinx and AutoAPI.

## Prerequisites

- Python 3.9 or higher
- Access to the Bittensor repository
- Write access to the [`developer-docs` repository](https://github.com/opentensor/developer-docs) (for publishing)

## Quick Start

### 1. Set Up Virtual Environment

Run the following command from the root of the developer-docs directory:

```bash
cd sphinx-generator
python3 -m venv sphinx_venv
source sphinx_venv/bin/activate
```

### 2. Install Dependencies

The `sphinx-generator` directory contains a pre-configured setup. Install required packages:

```bash
pip install -r requirements.txt
```

This installs:

- Sphinx (documentation generator)
- sphinx-autoapi (automatic API documentation from docstrings)
- sphinx-book-theme (theme with custom CSS)
- myst-parser (Markdown support)

### 3. Configure Paths

Edit `source/conf.py` and update these paths:

**Line 72** - Point to your Bittensor repository:

```python
autoapi_dirs = ["/path/to/your/bittensor"]
```

**Line 28** - Point to your Python site-packages (if needed):

```python
sys.path.append("/path/to/your/python/site-packages/")
```

### 4. Build Documentation

```bash
make html
```

The generated HTML will be in `build/html/`.

### 5. View Documentation Locally

```bash
open build/html/index.html
```

## Configuration Details

### Index Files

The `source/` directory contains different index files for different documentation types:

- `index.rst` - Main index (currently configured for Bittensor SDK)
- `index.rst.btsdk` - For Bittensor SDK documentation
- `index.rst.legacy` - For legacy documentation

To switch documentation types, copy the appropriate index file:

```bash
cp source/index.rst.btwallet source/index.rst
```

### AutoAPI Configuration

Key settings in `source/conf.py`:

```python
# Don't keep stale generated files
autoapi_keep_files = False

# Ignore test files and internal modules
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
```

### Custom Styling

Custom CSS is located in `source/_static/bittensor-custom.css` and automatically applied via the Sphinx Book Theme.

## Publishing Documentation

### 1. Clean Build Directory

Before publishing, remove the `_sources` directory (contains reStructuredText source files we don't want to version control):

```bash
rm -r build/html/_sources
```

### 2. Push to Developer Docs Repository

The documentation is published at `docs.bittensor.com` through the developer-docs repository:

1. Clone/navigate to the developer-docs repo:

   ```bash
   cd /path/to/developer-docs
   ```

2. Replace the entire `static/python-api/html` directory:

   ```bash
   rm -rf static/python-api/html
   cp -r /path/to/sphinx-generator/build/html static/python-api/html
   ```

3. Commit and push:
   ```bash
   git add static/python-api/html
   git commit -m "Update Python API documentation"
   git push
   ```

### 3. Linking to Documentation

In Markdown files within developer-docs, link to the Python reference docs using:

```markdown
[API Reference](pathname:///python-api/html/index.html)
```

See the `docs/sdk/bt-api-ref.md` file for examples.

## Troubleshooting

### Common Build Errors

#### 1. Unexpected Indentation Errors

**Error:**

```
ERROR: Unexpected indentation.
WARNING: Block quote ends without a blank line; unexpected unindent.
```

**Cause:** Improper formatting in Google-style docstrings, typically:

- Missing blank lines before `Note:`, `Example:`, or `Warning:` sections
- Inconsistent indentation in example code blocks
- Text continuing on the next line without proper indentation

**Solution:**
Ensure proper formatting in docstrings:

```python
def my_function():
    """Function description.

    Parameters:
        param1: Description.

    Returns:
        Return value description.

    Note:
        Important note here with proper blank line above.

    Example:
        # Example code here
        result = my_function()
    """
```

For literal blocks (code examples), use `::` directive:

```python
    Example::

        {
            "key": "value"
        }
```

#### 2. KeyError for Missing Symbols

**Error:**

```
KeyError: 'bittensor.core.extrinsics.asyncex.commit_reveal.commit_reveal_v3_extrinsic'
```

**Cause:** Stale AutoAPI files referencing functions that no longer exist or have been moved.

**Solution:**
Clean the AutoAPI directory before rebuilding:

```bash
rm -rf source/autoapi build
make html
```

Set `autoapi_keep_files = False` in `conf.py` to prevent this issue.

#### 3. Definition List Formatting

**Error:**

```
WARNING: Definition list ends without a blank line; unexpected unindent.
```

**Cause:** Missing blank line after parameter descriptions or before section headers.

**Solution:**
Add blank lines between sections:

```python
    Parameters:
        param1: Description.
        param2: Description.

    Returns:
        Description of return value.
```

#### 4. Inline Literal Errors

**Error:**

```
WARNING: Inline literal start-string without end-string.
```

**Cause:** Mismatched backticks in docstrings.

**Solution:**
Check for:

- Unclosed backticks: \`\`text vs \`\`text\`\`
- Proper escaping of special characters in code

#### 5. Build Warnings About Unknown Types

**Warning:**

```
WARNING: Unknown type: placeholder
```

**Cause:** Type hints that Sphinx cannot resolve.

**Solution:**
This is usually harmless. To suppress, add to `conf.py`:

```python
suppress_warnings = ["autoapi", "autosectionlabel.*"]
nitpicky = False
```

### Docstring Formatting Best Practices

Follow Google-style docstrings with these requirements:

1. **Always add blank lines before section headers:**

   ```python
   """
   Description here.

   Parameters:
       param1: Description.

   Returns:
       Return description.

   Note:
       Note content here.
   """
   ```

2. **Use proper indentation for multi-line content:**

   ```python
   Note:
       First line of note.
       Second line must be indented consistently.
   ```

3. **For code blocks in examples, use proper formatting:**

   ```python
   Example:
       # Comment
       code_here = True
       more_code()
   ```

4. **For literal blocks (JSON, dicts), use `::`:**

   ```python
   Example::

       {
           "key": "value"
       }
   ```

5. **Avoid inline `Note:` - always make it a section:**

   ```python
   # ❌ Bad
   Note: This is important.

   # ✅ Good
   Note:
       This is important.
   ```

### Rebuilding from Scratch

If you encounter persistent issues:

```bash
# Clean everything
rm -rf build source/autoapi

# Rebuild
make html
```

### Python Environment Issues

If imports fail during build:

1. Ensure all Bittensor dependencies are installed in your virtual environment
2. Check that the `autoapi_dirs` path is correct
3. Verify Python can import bittensor:
   ```bash
   python -c "import bittensor; print(bittensor.__version__)"
   ```

## Documentation Standards

### Docstring Style Guide

Follow the [Bittensor Writing Style Guide](https://github.com/opentensor/developer-docs/blob/main/WRITING-STYLE-GUIDE.md#python-docstrings).

Key points:

- Use Google-style docstrings
- Include type hints in function signatures when possible
- Provide examples for complex functions
- Document all parameters and return values
- Add notes for important behaviors or limitations

### Testing Changes

Before publishing:

1. Build locally and check for warnings/errors
2. Verify all pages render correctly
3. Test navigation and links
4. Check code examples for accuracy
5. Review styling and formatting

## Useful Resources

- [Sphinx Documentation](https://www.sphinx-doc.org/en/master/index.html)
- [Sphinx AutoAPI](https://sphinx-autoapi.readthedocs.io/en/latest/reference/config.html)
- [Sphinx Book Theme](https://sphinx-book-theme.readthedocs.io/en/stable/tutorials/get-started.html)
- [Google Style Python Docstrings](https://sphinxcontrib-napoleon.readthedocs.io/en/latest/example_google.html)
- [Bittensor Writing Style Guide](https://github.com/opentensor/developer-docs/blob/main/WRITING-STYLE-GUIDE.md)

## Quick Reference Commands

```bash
# Activate virtual environment
source sphinx_venv/bin/activate

# Clean build
rm -rf build && make html

# Clean everything including generated API files
rm -rf build source/autoapi && make html

# View docs
open build/html/index.html

# Deactivate virtual environment
deactivate
```

## Getting Help

If you encounter issues:

1. Check build output for specific error messages
2. Review the troubleshooting section above
3. Ensure docstrings follow Google style conventions
4. Verify all paths in `conf.py` are correct
5. Try a clean rebuild: `rm -rf build source/autoapi && make html`

For questions or issues, contact the Bittensor documentation team or open an issue in the developer-docs repository.
