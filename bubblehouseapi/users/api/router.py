from django.urls import path
from rest_framework.routers import DefaultRouter

from users.api.views import RegisterView, UserView, UserApiViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('auth/register', RegisterView.as_view()),
    path('auth/login', TokenObtainPairView.as_view()),
    path('auth/token/refresh', TokenRefreshView.as_view()),
    path('auth/me', UserView.as_view())
]

router_user = DefaultRouter()
router_user.register(
    prefix='user',
    basename='user',
    viewset=UserApiViewSet
)