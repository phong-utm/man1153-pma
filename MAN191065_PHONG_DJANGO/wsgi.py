"""
WSGI config for MAN191065_PHONG_DJANGO project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MAN191065_PHONG_DJANGO.settings')

application = get_wsgi_application()
