# psql:
# CREATE DATABASE chew; -- create database
# \c chew; -- choose database for querying
# python:
# python3 manage.py makemigrations -- stage changes 
# python3 manage.py migrate -- move changes
# python3 manage.py runserver -- run server
# python3 manage.py shell -- run python
# copy pasta the stuff below into shell:
from food.models import *

# Cuisine

c1 = Cuisine.objects.create(
  name='American')

# Restaurants

r1 = Restaurant.objects.create(
  name='Jim\'s Dogs',
  location='Los Angeles, CA',
  cuisine_id=1)

r2 = Restaurant.objects.create(
  name='Hotdog Stand',
  location='Los Angeles, CA',
  cuisine_id=1)

# Tags

t1 = Tag.objects.create(
  name='hot dog')
t2 = Tag.objects.create(
  name='hotdog')
t3 = Tag.objects.create(
  name='tasty')

# Foods

f1 = Food.objects.create(
  name='Hotdog',
  price=2,
  avgRating=3,
  numRating=1,
  cuisine_id=1,
  restaurant_id=1)
f1.tags.add(t1, t2, t3)

f2 = Food.objects.create(
  name='Dirty Dog',
  price=3,
  avgRating=3,
  numRating=2,
  cuisine_id=1,
  restaurant_id=2)
f2.tags.add(t3)

f3 = Food.objects.create(
  name='Breakfast Dog',
  price=3,
  avgRating=5,
  numRating=1,
  cuisine_id=1,
  restaurant_id=2)
f3.tags.add(t1, t2)

# User
u1 = User.objects.create(
  name='Alex')

# Reviews

r1 = Review.objects.create(
  user_id=1,
  text='Tastes just like mum used to make',
  foodRating=5,
  reviewRating=5,
  food_id=1)

r1 = Review.objects.create(
  user_id=1,
  text='Tastes just like mum used to make',
  foodRating=5,
  reviewRating=5,
  food_id=2)

r1 = Review.objects.create(
  user_id=1,
  text='Tastes just like mum used to make',
  foodRating=5,
  reviewRating=5,
  food_id=3)

# Images 

i1 = Image.objects.create(
  food_id=1,
  image='http://www.jamesaltucher.com/wp-content/uploads/2013/03/HOT-DOG.jpg',
  review_id=1)

i1 = Image.objects.create(
  food_id=2,
  image="http://www.seriouseats.com/images/20081209-hot-dog.jpg",
  review_id=2)

i1 = Image.objects.create(
  food_id=3,
  image='http://www.apinchofginger.com/uploads/6/0/3/9/6039210/2338231_orig.jpg',
  review_id=3)




