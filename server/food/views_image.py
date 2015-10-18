from rest_framework.views import APIView
from rest_framework.response import Response
from food.models import Image, Food
from food.serializers_image import ImageSerializer

class ImageGroups(APIView):
  def get(self, request, food_pk, format=None):
    food = Food.objects.get(pk=food_pk)
    images = Image.objects.filter(food=food)
    if not images:
      data = []
    else:
      data = ImageSerializer(images, many=True).data
    return Response(data)
