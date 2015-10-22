from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from django.db.models import Q
from food.models import Food, Tag, Image
from food.serializers_food import FoodSerializer
import math
import requests
import urllib
import os

def get_distance_from_long_lat_in_miles(lat1, long1, lat2, long2):
  degrees_to_radians = math.pi/180.0
  phi1 = (90.0 - lat1)*degrees_to_radians
  phi2 = (90.0 - lat2)*degrees_to_radians
       
  theta1 = long1*degrees_to_radians
  theta2 = long2*degrees_to_radians

  cos_arc = (math.sin(phi1)*math.sin(phi2)*math.cos(theta1 - theta2) + 
         math.cos(phi1)*math.cos(phi2))
  return math.acos(cos_arc) * 3960

class Search(APIView):
  def get(self, request, search_term, format=None):
    coords = request.query_params.get('coords')
    location = request.query_params.get('location')
    if coords is not None:
      coords.split(',')
      location_lat, location_lng = coords[0], coords[1]
    if coords is None and location is not None:
      google_r = requests.get('https://maps.googleapis.com/maps/api/geocode/json?', params={'address': location, 'key': os.getenv('GOOGLE_MAPS_API_KEY')})
      if google_r.status_code is 200 and google_r.json():
        google_location = google_r.json()['results'][0]['geometry']['location']
        location_lat, location_lng = google_location['lat'], google_location['lng']
    terms = search_term.split(' ')
    q_objects = Q()
    for term in terms:
      tags = Tag.objects.filter(name__icontains=term)
      q_objects &= Q(name__icontains=term) | Q(tags__in=tags)
    foods = Food.objects.filter(q_objects).all().distinct()
    if not foods:
      data = []
    else:
      for food in foods:
        food.preview_image = Image.objects.filter(food=food).order_by('votes').first() or Image.objects.get(id=1)
        if location_lat is not None and location_lng is not None:
          food.distance = get_distance_from_long_lat_in_miles(float(food.restaurant.address.latitude), float(food.restaurant.address.longitude), float(location_lat), float(location_lng))
      if location_lat is not None and location_lng is not None:
        foods = sorted(foods, key=lambda food: food.distance)
      data = FoodSerializer(foods, many=True).data
    return Response(data)

