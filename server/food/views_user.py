from rest_framework import generics, mixins, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from food.models import Account
from food.serializers_account import AccountSerializer, UserSerializer

class UserList(generics.ListAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class UserDetail(APIView):
  def get_object(self, pk):
    try:
      return Account.objects.get(pk=pk)
    except Account.DoesNotExist:
      raise Http404

  def get(self, request, pk, format=None):
    account = self.get_object(pk)
    serializer = AccountSerializer(account)
    return Response(serializer.data)

  def put(self, request, pk, format=None):
    account = self.get_object(pk)
    serializer = AccountSerializer(account, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def delete(self, request, pk, format=None):
    account = self.get_object(pk)
    account.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

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

class TokenCheck(APIView):
  def get(self, request, token, format=None):
    if Token.objects.filter(key=token).exists():
      userid = Token.objects.get(key=token).user_id
      account = AccountSerializer(Account.objects.get(user=userid)).data
      return Response(account)
    else:
      return Response('Invalid token', status.HTTP_400_BAD_REQUEST)

        
