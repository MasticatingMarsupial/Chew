from django.db import models

class User(models.Model):
  name = models.CharField(max_length=30, unique=True)

class Tag(models.Model):
  name = models.CharField(max_length=255, unique=True)

class Cuisine(models.Model):
  name = models.CharField(max_length=255, unique=True)

class Restaurant(models.Model):
  name = models.CharField(max_length=255)
  location = models.CharField(max_length=255)
  cuisine = models.ForeignKey(Cuisine) 

class Food(models.Model):
  name = models.CharField(max_length=255)
  cuisine = models.ForeignKey(Cuisine) 
  restaurant = models.ForeignKey(Restaurant)
  price = models.IntegerField()
  avgRating = models.IntegerField(default=0)
  numRating = models.IntegerField(default=0)
  tags = models.ManyToManyField(Tag)
    
class Review(models.Model):
  text = models.CharField(max_length=255, null=True)
  user = models.ForeignKey(User) 
  foodRating = models.IntegerField()
  reviewRating = models.IntegerField(null=True)
  food = models.ForeignKey(Food) 

class Image(models.Model):
  food = models.ForeignKey(Food) 
  image = models.CharField(max_length=255, unique=True)
  review = models.ForeignKey(Review, null=True)

