import pytest
import imageController
from food.models import Food
from food.models import Cuisine
from food.models import Restaurant
from food.models import Image

@pytest.mark.django_db
def setup_function(function):
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
  image = Image(**{
    "food": food,
    "image": "/images/001.jpg",
    })
  image.save()
  function.parametrize(image);

class TestImage:
  def test_get_image(self):
    result = imageController.getImage(self.id)
    assert result.image == "/images/001.jpg"
