import pkgutil
import importlib
import os

# This dictionary will hold { "filename": <module_object> }
registry = {}

# Get the current folder path
pkg_path = os.path.dirname(__file__)

# Loop through all .py files in this folder
for loader, module_name, is_pkg in pkgutil.iter_modules([pkg_path]):
    # Import the module dynamically
    # Example: from factors import factor_temp
    module = importlib.import_module(f".{module_name}", package=__package__)
    
    # Add it to our registry
    registry[module_name] = module

# This allows you to do: from factors import registry
__all__ = ["registry"]
