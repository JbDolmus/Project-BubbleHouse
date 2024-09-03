from rest_framework import serializers

from rol.api.serializer import RolSerializer
from rol.models import Rol
from users.models import User

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name']


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name']

class UserSerializerApi(serializers.ModelSerializer):
    rolls = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.all(),
        many=True,
        write_only=True
    )
    rolls_details = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'rolls', 'rolls_details']

    def get_rolls_details(self, obj):
        # Obtener todos los roles asociados al usuario
        return RolSerializer(obj.rolls.all(), many=True).data
