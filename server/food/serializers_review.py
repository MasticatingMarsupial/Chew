from rest_framework import serializers
from food.models import Review, Food
from food.serializers_food import FoodSerializer
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['username', 'first_name', 'last_name']

class ReviewSerializer(serializers.ModelSerializer):
  owner = UserSerializer(read_only=True)

  class Meta:
    model = Review
    fields = ['id', 'text', 'owner', 'foodRating', 'reviewRating', 'food']

  def create(self, validated_data):
    return Review.objects.create(**validated_data);
