from django.contrib import admin

from rol.models import Rol


# Register your models here.

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'state')
