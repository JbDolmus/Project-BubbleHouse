# urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from rol.api.view import RolViewSet

# Crear un enrutador y registrar el ViewSet
router_rol = DefaultRouter()
router_rol.register(
    prefix='rol',
    basename='rol',
    viewset=RolViewSet
)