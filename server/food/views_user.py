from rest_framework import generics, mixins
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from food.serializers_review import UserSerializer
from django.shortcuts import redirect
from django.contrib.auth import login
from django.views.decorators.csrf import csrf_exempt
import json

class UserList(generics.ListAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

@csrf_exempt
def signup(request):
  request = json.loads((request.body.decode('utf-8')))
  username = request['username']
  password = request['password']
  if User.objects.filter(username=username).exists():
    print('user already exists. go somewhere else')
    return redirect('/api/')
  else:
    print('User created')
    User.objects.create_user(username=username, password=password)
    return redirect('/api/foods/')


@csrf_exempt
def login(request):
  request = json.loads((request.body.decode('utf-8')))
  username = request['username']
  password = request['password']
  authenticated_user = authenticate(username=username, password=password)
  if authenticated_user is not None:
    if authenticated_user.is_active:
      # login(request, user)
      print('correct login')
      return redirect('/api/reviews/')
    else:
      print('disabled account')
      return redirect('/api/reviews')
  else:
    print('invalid login. go somewhere else.')
    return redirect('/api/users')

      