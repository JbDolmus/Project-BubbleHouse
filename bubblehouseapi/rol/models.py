from django.db import models

# Create your models here.

class Rol(models.Model):
    name = models.CharField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    state = models.BooleanField(default=True)

