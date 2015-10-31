from rest_framework import serializers
from food.models import Account, Image
from django.contrib.auth.models import User
from django.db.models import F
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

  def update(self, instance, validated_data):
    images_liked_data = validated_data.pop('images_liked')
    account = Account.objects.get(id=instance.pk)
    for image in images_liked_data:
      img = image['image']
      query = Image.objects.get(image=img)
      if account.images_liked.filter(pk=query.id).exists():
        continue
      else:
        Image.objects.filter(image=img).update(votes=F('votes') +1)
        account.images_liked.add(query)
    return account
