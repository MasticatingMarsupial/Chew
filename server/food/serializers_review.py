from rest_framework import serializers
from food.models import Review, Food

class ReviewSerializer(serializers.ModelSerializer):

  class Meta:
    model = Review
    # fields = ['text', 'user', 'foodRating', 'reviewRating', 'food']


