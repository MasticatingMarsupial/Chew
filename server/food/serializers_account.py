from rest_framework import serializers
from food.models import Account
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
  username = serializers.CharField()
  first_name = serializers.CharField()
  last_name = serializers.CharField()
  email = serializers.CharField()

  class Meta:
    model = User
    fields = ['username', 'first_name', 'last_name', 'email']


class AccountSerializer(serializers.ModelSerializer):
  id = serializers.IntegerField()
  user = UserSerializer()
  
  class Meta:
    model = Account
    fields = ['id', 'user', 'food_favorites', 'food_liked', 'food_disliked', 'images_liked', 'search_preferences', 'reviews_liked', 'reviews_disliked' ]
