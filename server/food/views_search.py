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
    if request.query_params.get('results_per_page') is not None:
      results_per_page = int(request.query_params.get('results_per_page'))
    else:
      results_per_page = 12
    if request.query_params.get('page_number') is not None:
      page_number = int(request.query_params.get('page_number'))
    else:
      page_number = 1
    terms = search_term.split(' ')
    q_objects = Q()
    for term in terms:
      tags = Tag.objects.filter(name__icontains=term)
      q_objects &= Q(name__icontains=term) | Q(tags__in=tags)
    foods = Food.objects.filter(q_objects).all().distinct()
    total_pages = len(foods) // results_per_page
    if not foods:
      data = []
    else:
      foods = prepare_food(request, foods[(page_number - 1) * 12:(page_number) * 12])
      data = FoodSerializer(foods, many=True).data
    return Response({'data': data, 'pagination': {'results_per_page': results_per_page, 'page_number': page_number, 'total_pages': total_pages}})

