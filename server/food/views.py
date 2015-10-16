from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from food.models import Food
from food.serializers import FoodSerializer

class FoodList(APIView):
  def get(self, request, format=None):
    foods = Food.objects.all()
    serializer = FoodSerializer(foods, many=True)
    return Response(serializer.data)

  def post(self, request, format=None):
    serializer = FoodSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
