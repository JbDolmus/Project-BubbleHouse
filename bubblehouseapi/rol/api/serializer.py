from django.contrib.auth.models import Permission
from rest_framework import serializers

from rol.models import Rol

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ('id', 'name', 'created_at', 'state')
