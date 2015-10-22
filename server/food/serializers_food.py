from rest_framework import serializers
from food.models import User, Cuisine, Restaurant, Food, Review, Image, Tag, Address
from food.serializers_image import ImageSerializer

class CreateableSlugRelatedField(serializers.SlugRelatedField):
  def to_internal_value(self, data):
    try:
      return self.get_queryset().get_or_create(**{self.slug_field: data})[0]
    except ObjectDoesNotExist:
      self.fail('does_not_exist', slug_name=self.slug_field, value=smart_text(data))
    except (TypeError, ValueError):
      self.fail('invalid')

class AddressSerializer(serializers.ModelSerializer):

  class Meta:
    fields = ['street_address', 'city', 'state', 'zipcode']

class RestaurantSerializer(serializers.ModelSerializer):
  cuisine = CreateableSlugRelatedField(slug_field='name', queryset=Cuisine.objects.all())

  class Meta:
    model = Restaurant
    fields = ['name', 'address', 'cuisine']

class FoodSerializer(serializers.ModelSerializer):
  cuisine = CreateableSlugRelatedField(slug_field='name', queryset=Cuisine.objects.all())
  restaurant = RestaurantSerializer(read_only=False)
  tags = CreateableSlugRelatedField(many=True, slug_field='name', queryset=Tag.objects.all())
  preview_image = ImageSerializer(read_only=True)
  distance = serializers.DecimalField(read_only=True, max_digits=6, decimal_places=2)

  class Meta:
    model = Food
    fields = ['id', 'name', 'cuisine', 'restaurant', 'price', 'avgRating', 'numRating', 'tags', 'preview_image', 'distance']

  def create(self, validated_data):
    restaurant_data = validated_data.pop('restaurant')
    restaurant, created = Restaurant.objects.get_or_create(**restaurant_data)
    tags_data = validated_data.pop('tags')
    food = Food.objects.create(restaurant=restaurant, **validated_data)
    for tag in tags_data:
      food.tags.add(tag)
    return food

  def update(self, validated_data):
    restaurant_data = validated_data.pop('restaurant')
    restaurant = Restaurant.objects.get_or_create(**restaurant_data)
    tags_data = validated_data.pop('tags')
    food = Food.objects.update_or_create(restaurant=restaurant, **validated_data)
    for tag in tags_data:
      food.tags.add(tag)
    return food
