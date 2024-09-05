from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Definir los campos que serán visibles en el listado de usuarios
    list_display = ('id','username', 'email', 'state', 'created_at')

    # Añadir filtros por estado y fecha de creación
    list_filter = ('state', 'created_at')

    # Definir los campos que serán visibles en la página de detalles de un usuario
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        (_('Personal info'), {'fields': ('state', 'rolls')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )

    # Definir los campos que aparecerán en el formulario de creación de usuarios
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'state', 'rolls'),
        }),
    )

    # Definir el campo por el cual se va a ordenar la lista de usuarios
    ordering = ('email',)

    # Definir los campos de búsqueda
    search_fields = ('email',)

    # Añadir la relación ManyToMany en el widget de selección horizontal para los roles
    filter_horizontal = ('rolls',)
