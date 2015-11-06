from rest_framework import serializers
from food.models import Account, Image, Food, Review
from django.contrib.auth.models import User
from django.db.models import F
from food.serializers_food import FoodSerializer
from food.serializers_image import ImageSerializer
from food.serializers_review import ReviewSerializer

class UserSerializer(serializers.ModelSerializer):
  username = serializers.CharField()
  first_name = serializers.CharField(allow_blank = True)
  last_name = serializers.CharField(allow_blank = True)
  email = serializers.CharField(allow_blank = True)

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
    user_data = validated_data.pop('user')
    user = User.objects.get(username=user_data['username'])
    user.first_name = user_data['first_name']
    user.last_name = user_data['last_name']
    user.email = user_data['email']
    user.save()
    account = Account.objects.get(id=instance.pk)
    
    if self.context[0] == 'param':
      return account
    elif self.context[0] == 'images_liked':
      updated_data = validated_data.pop(self.context[0])
      if self.context[1] == 'upvote':
        for data in updated_data:
          img = data['image']
          query = Image.objects.get(image=img)
          if not account.images_liked.filter(pk=query.id).exists():
            account.images_liked.add(query)
            Image.objects.filter(image=img).update(votes=F('votes') +1)
      elif self.context[1] == 'downvote':
        for data in updated_data:
          img = data['image']
          query = Image.objects.get(image=img)
          if account.images_liked.filter(pk=query.id).exists():
            account.images_liked.remove(query)
            Image.objects.filter(image=img).update(votes=F('votes') -1)
    else:
      updated_data = validated_data.pop(self.context[0])
      for data in updated_data:
        food = data['name']
        query = Food.objects.get(name=food)
        if not account.food_liked.filter(pk=query.id).exists():
          account.food_liked.add(query)
    return account
