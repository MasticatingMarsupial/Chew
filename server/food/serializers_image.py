from rest_framework import serializers
from food.models import Image

class ImageSerializer(serializers.ModelSerializer):
  class Meta:
    model = Image
    fields = ['image', 'votes']
