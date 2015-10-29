from rest_framework import serializers
from food.models import Account
from django.contrib.auth.models import User
from food.serializers_food import FoodSerializer
from food.serializers_image import ImageSerializer
from food.serializers_review import ReviewSerializer

class UserSerializer(serializers.ModelSerializer):
  username = serializers.CharField()
  first_name = serializers.CharField()
  last_name = serializers.CharField()
  email = serializers.CharField()

  class Meta:
    model = User
    fields = ['username', 'first_name', 'last_name', 'email']

class AccountSerializer(serializers.ModelSerializer):
  # id = serializers.IntegerField()
  user = UserSerializer()
  food_favorites = FoodSerializer(many=True)
  food_liked = FoodSerializer(many=True)
  food_disliked = FoodSerializer(many=True)
  images_liked = ImageSerializer(many=True)
  reviews_liked = ReviewSerializer(many=True)
  reviews_disliked = ReviewSerializer(many=True)
  
  class Meta:
    model = Account
    fields = ['id', 'user', 'food_favorites', 'food_liked', 'food_disliked', 'images_liked', 'reviews_liked', 'reviews_disliked' ]

  # def update(self, instance, validated_data):
  #   images_liked_data = validated_data.pop('images_liked')
  #   account = Account.objects.get_or_create(id=instance.pk, defaults=validated_data)[0]
  #   for image in images_liked_data:
  #     account.images_liked.add(image)
  #   return account
