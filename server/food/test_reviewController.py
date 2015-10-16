import pytest
import reviewController
from food.models import Food
from food.models import Cuisine
from food.models import Restaurant
from food.models import Review
from food.models import User

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
  userChew = User(user="Chewbot")
  userChew.save()
  userHungry = User(user="Hungrybot")
  userHungry.save()
  review = Review(**{
    "food": food,
    "text": "Wow this was delicious!",
    "user": userChew,
    "foodRating": 4,
    "reviewRating": 0,
    })
  review.save()
  reviewTwo = Review(**{
    "food": food,
    "text": "Wow this was delicious!",
    "user": userHungry,
    "foodRating": 4,
    "reviewRating": 0,
    })
  reviewTwo.save()
  function.parametrize(review);

class TestImage:
  def test_get_one_review(self):
    result = reviewController.getSingleReview(self.id)
    assert result.image == "/images/001.jpg"

  def test_get_all_reviews(self):
    results = reviewController.getAllReviews()
    assert results.length == 2
    assert results[0].user.name == "Chewbot" || results[0].user.name == "Hungrybot"
    assert results[1].user.name == "Chewbot" || results[1].user.name == "Hungrybot"

