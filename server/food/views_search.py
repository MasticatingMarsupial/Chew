from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from django.db.models import Q
from food.models import Food, Tag, Image
from food.serializers_food import FoodSerializer

class Search(APIView):
  def get(self, request, search_term, format=None):
    tags = Tag.objects.filter(name__icontains=search_term)
    foods = Food.objects.filter(Q(name__icontains=search_term) or Q(tags__in=tags)).all()
    if not foods:
      data = []
    else:
      for food in foods:
        food.preview_image = Image.objects.filter(food=food).order_by('votes').first()
      data = FoodSerializer(foods, many=True).data
    return Response(data)

