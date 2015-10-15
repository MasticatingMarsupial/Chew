import pytest
import searchController
from models import Food

class Food(models.Model):
  name = models.CharField(max_length=255)
  cuisine = models.ForeignKey(Cuisine) # id only
  restaurant = models.ForeignKey(Restaurant)
  price = models.IntegerField()
  avgRating = models.IntegerField()
  numRating = models.IntegerField()

def setup_function(function):
  Food.objects.all.delete()

class searchFoods:
  def search_existing_food(self):
    food = Food({
        "name": "Pho bo",
        "cuisine": "vietnamese",
        "restaurant": "Tu Lan",
        "price": 8.75,
        avgRating: 4.5,
        numRating: 10
      })



