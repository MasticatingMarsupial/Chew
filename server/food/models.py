from django.db import models

class User(models.Model):
  name = models.CharField(max_length=30)

class Review(models.Model):
  text = models.CharField(max_length=255)
  user = model.ForeignKey(User_id) # id only
  foodRating = models.IntegerField()
  reviewRating = models.IntegerField()
  food = model.ForeignKey(Food_id) # id only 

class Image(model.Model):
  food = model.ForeignKey(Food_id) # id only
  image = model.CharField(max_length=255)
  review = model.ForeignKey(Review)

class Food(models.Model):
  name = model.CharField(max_length=255)
  cuisine = model.ForeignKey(Cuisine_id) # id only
  restaurant = model.ForeignKey(Restaurant)
  price = model.IntegerField()
  avgRating = model.IntegerField()
  numRating = model.IntegerField()

class Restaurant(model.Model):
  name = model.CharField(max_length=255)
  location = model.CharField(max_length=255)
  cuisine = model.ForeignKey(Cuisine_id) # id only

class Cuisine(model.Model):
  name = model.CharField(max_length=255)

class FoodTag(model.Model):
  food = model.ForeignKey(Food_id) # id only
  tag = model.ForeignKey(Tag_id) # id only

class Tag(model.Model):
  name = model.CharField(max_length=255)
