# backend/app/routing.py
from django.urls import re_path
from .consumers import ThreadConsumer
websocket_urlpatterns = [
    re_path(r'ws/thread/$', ThreadConsumer.as_asgi()),
]
