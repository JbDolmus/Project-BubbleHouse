from rest_framework import serializers

from rol.api.serializer import RolSerializer
from rol.models import Rol
from users.models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    rolls = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.all(),
        many=True,
        write_only=True
    )
    rolls_details = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'rolls', 'rolls_details', ]

    def get_rolls_details(self, obj):
        # Obtener todos los roles asociados al usuario
        return RolSerializer(obj.rolls.all(), many=True).data

    def create(self, validated_data):
        # Extraer los roles del validated_data
        rolls_data = validated_data.pop('rolls', [])
        password = validated_data.pop('password', None)

        # Crear la instancia del usuario sin asignar los roles todavía
        instance = self.Meta.model(**validated_data)

        if password is not None:
            instance.set_password(password)

        # Guardar la instancia del usuario primero
        instance.save()

        # Asignar los roles utilizando el método .set()
        if rolls_data:
            instance.rolls.set(rolls_data)

        # Devolver la instancia del usuario
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
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, required=False)
    rolls = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.all(),
        many=True,
        write_only=True
    )
    rolls_details = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'rolls', 'rolls_details', 'current_password', 'new_password']
        extra_kwargs = {
            'current_password': {'write_only': True},
            'new_password': {'write_only': True, 'required': False}
        }

    def get_rolls_details(self, obj):
        # Obtener todos los roles asociados al usuario
        return RolSerializer(obj.rolls.all(), many=True).data

    def update(self, instance, validated_data):
        # Extraer la contraseña actual y la nueva contraseña si están presentes
        current_password = validated_data.pop('current_password', None)
        new_password = validated_data.pop('new_password', None)

        print(f"Current Password Received: {current_password}")
        print(f"Password Stored in DB: {instance.password}")

        # Verificar la contraseña actual
        if current_password and not instance.check_password(current_password):
            raise serializers.ValidationError({'current_password': 'La contraseña actual es incorrecta'})

        # Si se proporciona una nueva contraseña, actualizarla
        if new_password:
            instance.set_password(new_password)

        # Actualizar otros campos del usuario
        instance = super().update(instance, validated_data)

        # Guardar los cambios en el modelo
        instance.save()

        return instance
