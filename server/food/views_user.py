from rest_framework import generics, mixins, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from food.serializers_review import UserSerializer
from food.serializers_account import AccountSerializer
from django.contrib.auth import login
from django.views.decorators.csrf import csrf_exempt
from food.models import Account

class UserList(generics.ListAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class Signup(APIView):
  def post(self, request, format=None):
    try:
      data = request.data
    except ParseError as error:
      return Response('Invalid JSON - {0}'.format(error.detail), status=status.HTTP_400_BAD_REQUEST)
    if "username" not in data or "password" not in data:
      return Response('Username or password not provided', status.HTTP_400_BAD_REQUEST)
    username = data['username']
    password = data['password']
    if User.objects.filter(username=username).exists():
      return Response('Username already taken', status.HTTP_400_BAD_REQUEST)
    else:
      user = User.objects.create_user(username=username, password=password)
      token = Token.objects.create(user=user)
      account = AccountSerializer(Account.objects.create(user=user)).data
      return Response({'token': token.key, 'account': account})

class Signin(APIView):
  def post(self, request, format=None):
    try:
      data = request.data
    except ParseError as error:
      return Response('Invalid JSON - {0}'.format(error.detail), status=status.HTTP_400_BAD_REQUEST)
    if "username" not in data or "password" not in data:
      return Response('Username or password not provided', status.HTTP_400_BAD_REQUEST)
    username = data['username']
    password = data['password']

    user = authenticate(username=username, password=password)
    if user is not None:
      token = Token.objects.get_or_create(user=user)[0]
      account = AccountSerializer(Account.objects.get(user=user)).data
      return Response({'token': token.key, 'account': account})
    else:
      return Response('Username or password is invalid', status.HTTP_400_BAD_REQUEST)

        
