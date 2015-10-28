from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from django.db.models import Q
from food.models import Food, Tag
from food.serializers_food import FoodSerializer
from food.utils import prepare_food

class Search(APIView):
  def get(self, request, search_term, format=None):
    terms = search_term.split(' ')
    q_objects = Q()
    for term in terms:
      tags = Tag.objects.filter(name__icontains=term)
      q_objects &= Q(name__icontains=term) | Q(tags__in=tags)
    foods = Food.objects.filter(q_objects).all().distinct()
    if not foods:
      data = []
    else:
      foods = prepare_food(request, foods)
      data = FoodSerializer(foods, many=True).data
    return Response(data)

