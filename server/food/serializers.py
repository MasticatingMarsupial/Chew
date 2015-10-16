from rest_framework import serializers
from food.models import User, Cuisine, Restaurant, Food, Review, Image, Tag, FoodTag

class RestaurantSerializer(serializers.ModelSerializer):
  cuisine = serializers.SlugRelatedField(read_only=True, slug_field='name')

  class Meta:
    model = Restaurant
    fields = {'name', 'location', 'cuisine'}

class FoodSerializer(serializers.ModelSerializer):
  cuisine = serializers.SlugRelatedField(read_only=True, slug_field='name')
  restaurant = RestaurantSerializer(read_only=false)

  class Meta:
    model = Food
    fields = {'name', 'cuisine', 'restaurant', 'price', 'avgRating', 'numRating'}

  def create(self, validated_data):
    restaurant_data = validated_data.pop('restaurant')
    restaurant_cuisine_data = restaurant_data.pop('cuisine')
    restaurant_cuisine = Cuisine.create(name=restaurant_cuisine_data)
    cuisine_data = validated_data.pop('cuisine')
    cuisine = Cuisine.create(name=cuisine_data)
    restaurant = Restaurant.objects.create(cuisine=restaurant_cuisine, **restaurant_data)
    food = Food.objects.create(cuisine=cuisine, restaurant=restaurant, **validated_data)
    return food
