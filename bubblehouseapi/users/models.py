from django.contrib.auth.models import AbstractUser
from django.db import models

from rol.models import Rol


# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True)
    rolls = models.ManyToManyField(Rol, blank=True)
    state = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []