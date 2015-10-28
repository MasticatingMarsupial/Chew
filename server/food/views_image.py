from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from food.models import Image, Food, Account
from food.serializers_image import ImageSerializer
from food.serializers_account import UserSerializer, AccountSerializer

class ImageGroups(APIView):
  def get(self, request, food_pk, format=None):
    food = Food.objects.get(pk=food_pk)
    images = Image.objects.filter(food=food)
    if not images:
      data = []
    else:
      data = ImageSerializer(images, many=True).data
    return Response(data)

class ImageDetail(APIView):
  def get_object(self, pk):
    try:
      return Image.objects.get(pk=pk)
    except Image.DoesNotExist:
      raise Http404

  def get(self, request, pk, format=None):
    image = self.get_object(pk)
    serializer = ImageSerializer(image)
    return Response(serializer.data)

  def put(self, request, pk, format=None):
    image = self.get_object(pk)
    serializer = ImageSerializer(image, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def delete(self, request, pk, format=None):
    image = self.get_object(pk)
    image.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
