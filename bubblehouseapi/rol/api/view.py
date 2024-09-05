from rest_framework import viewsets

from rol.api.serializer import RolSerializer
from rol.models import Rol
class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer