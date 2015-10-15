import pytest
import foodController
from food.models import Food
from food.models import Restaurant
from food.models import Cuisine

@pytest.mark.django_db
def setup_function(function):
  Food.objects.all.delete()
  cuisine = Cuisine(name="vietnamese")
  cuisine.save()
  restaurant = Restaurant(name="tu lan", location="123 address", cuisine=cuisine)
  restaurant.save()
  food = Food(**{
      "name": "Pho bo",
      "cuisine": cuisine,
      "restaurant": restaurant,
      "price": 8.75,
      "avgRating": 4.5,
      "numRating": 10
    })
  food.save()
  function.parametrize(food)

class TestFood:
  def test_get_food(self):
    var result = foodController.getFood(self.id)
    assert result == self
