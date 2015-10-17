from rest_framework import serializers
from food.models import User, Cuisine, Restaurant, Food, Review, Image, Tag

class ReviewSerializer(serializers.ModelSerializer):

  class Meta:
    model = Review
    fields = ['text', 'user', 'foodRating', 'reviewRating', 'food']


