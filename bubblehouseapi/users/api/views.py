from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from bubblehouseapi.Reponse.response_main import ResponseBase
from users.api.permissions import IsAdminOrReadOnly
from users.api.serializers import UserRegisterSerializer, UserSerializer, UserUpdateSerializer, UserSerializerApi
from users.models import User



class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response = ResponseBase(state=True, message='Registered successfully', data=serializer.data, status=status.HTTP_200_OK)
            return response.response()
        response = ResponseBase(state=False, message=serializer.errors, data=None, status = status.HTTP_400_BAD_REQUEST)
        return response.response()



class UserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        response = ResponseBase(state=True, message='', data=serializer.data, status=status.HTTP_200_OK)
        return response.response()

    def put(self, request):
        user = User.objects.get(id=request.user.id)
        serializer = UserUpdateSerializer(user, request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response = ResponseBase(state=True, message='Updated successfully', data=serializer.data, status=status.HTTP_200_OK)
            return response.response()
        response = ResponseBase(state=False, message=serializer.errors, data=None, status = status.HTTP_400_BAD_REQUEST)
        return response.response()

class UserApiViewSet(ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = UserSerializerApi
    queryset = User.objects.filter(state=True)
    lookup_field = 'id'
    filter_backends = [DjangoFilterBackend]
