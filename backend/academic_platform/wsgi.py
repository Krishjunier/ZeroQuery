# backend/academic_platform/wsgi.py
import os
from django.core.wsgi import get_wsgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'academic_platform.settings')
application = get_wsgi_application()
