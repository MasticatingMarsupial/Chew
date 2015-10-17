from django.test import TestCase
from food.models import *
# Create your tests here.

class FoodTestCase(TestCase):
  def setUp(self):
    f1 = Food.objects.create(
      name='Amazing Dog',
      price=2,
      avgRating=3,
      numRating=1,
      cuisine_id=1,
      restaurant_id=1
      )
    f2 = Food.objects.create(
      name='Amazing Dog #2',
      price=3,
      avgRating=3,
      numRating=2,
      cuisine_id=1,
      restaurant_id=1
      )
    r1 = Restaurant.objects.create(
      name='Jim\'s Dogs',
      location='Los Angeles, CA',
      cuisine_id=1
      )
    c1 = Cuisine.objects.create(
      name='American'
      )
    t1 = Tag.objects.create(
      name='hot dog'
      )
    t2 = Tag.objects.create(
      name='delicious'
      )
    ft1 = FoodTag(food=f1, tag=t1)
    ft2 = FoodTag.objects.create(food=f1, tag=t2)
    ft3 = FoodTag(food=f2, tag=t1)
    ft1.save()
    ft3.save()


  def test_foodHasRightProperties(self):
    hot_dog = Food.objects.get(name='Amazing Dog')
    self.assertEqual(hot_dog.restaurant.name, 'Jim\'s Dogs')
    self.assertEqual(hot_dog.cuisine.name, 'American')
    self.assertEqual(hot_dog.price, 2)
    self.assertEqual(hot_dog.numRating, 1)

  def test_foodsHaveTags(self):
    self.assertEqual(len(FoodTag.objects.all()),3)
    self.assertEqual(Food.objects.filter(
      tag__name='delicious')[0], Food.objects.get(name='Amazing Dog'))

  def test_tagsHaveFoods(self):
    self.assertEqual(len(FoodTag.objects.filter(tag__name='hot dog')), 2)
    self.assertEqual(Tag.objects.filter(
      food__name='Amazing Dog')[0], Tag.objects.get(name='delicious'))
    self.assertEqual(Tag.objects.filter(
      food__name='Amazing Dog')[1], Tag.objects.get(name='hot dog'))

  # def test_databaseIsQueried(self):
  #   with self.assertNumQueries(2):
  #     Tag.objects.create(name='Yummy')
  #     Tag.objects.create(name='Spicy')

