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
  cuisine = models.ForeignKey(Cuisine) # id only

  class Meta:
    unique_together = ('name', 'location')

class Food(models.Model):
  name = models.CharField(max_length=255)
  cuisine = models.ForeignKey(Cuisine) # id only
  restaurant = models.ForeignKey(Restaurant)
  price = models.IntegerField()
  avgRating = models.IntegerField(default=0)
  numRating = models.IntegerField(default=0)
  tags = models.ManyToManyField(Tag)

  class Meta:
    unique_together = ('name', 'restaurant')
    
class Review(models.Model):
  text = models.CharField(max_length=255)
  user = models.ForeignKey(User) # id only
  foodRating = models.IntegerField()
  reviewRating = models.IntegerField(null=True)
  food = models.ForeignKey(Food) # id only 

class Image(models.Model):
  food = models.ForeignKey(Food) # id only
  image = models.CharField(max_length=255, unique=True)
  review = models.ForeignKey(Review, null=True)

