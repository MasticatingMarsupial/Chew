from rest_framework import serializers
from food.models import Review, Food#, User
from food.serializers_food import FoodSerializer
from django.contrib.auth.models import User

class CreateableSlugRelatedField(serializers.SlugRelatedField):
  def to_internal_value(self, data):
    try:
      return self.get_queryset().get_or_create(**{self.slug_field: data})[0]
    except ObjectDoesNotExist:
      self.fail('does_not_exist', slug_name=self.slug_field, value=smart_text(data))
    except (TypeError, ValueError):
      self.fail('invalid')

class UserSerializer(serializers.ModelSerializer):
  reviews = serializers.PrimaryKeyRelatedField(many=True, queryset=Review.objects.all())
  class Meta:
    model = User
    fields = ['id', 'username', 'reviews']

class ReviewSerializer(serializers.ModelSerializer):
  owner = serializers.ReadOnlyField(source='owner.username')

  class Meta:
    model = Review
    fields = ['id', 'text', 'owner', 'foodRating', 'reviewRating', 'food']
