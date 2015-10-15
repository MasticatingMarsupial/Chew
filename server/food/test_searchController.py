import pytest
import searchController
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

class TestFoods:
  def test_search_existing_food(self):
    result = searchController.searchFoods(name="pho bo")[0]
    assert result.name.lower() == "pho bo"
    assert result.restaurant.lower() == "tu lan"
    assert result.price == 8.75
    assert result.avgRating == 4.5
    assert result.numRating == 10

  def test_search_nonexisting_food(self):
    results = searchController.searchFoods(name="gibberish")
    assert len(results) == 0




