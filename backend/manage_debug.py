#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

import debugpy

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LumaLab.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    if not debugpy.is_client_connected():
        debugpy.listen(("0.0.0.0", 5678))  # Bind to all IPs inside the container on port 5678

    print("Waiting for debugger to attach...")
    debugpy.wait_for_client()  # Wait for the debugger to attach before continuing
        
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
