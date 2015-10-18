from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

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
  avgRating = models.DecimalField(max_digits=3, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
  numRating = models.IntegerField(default=0)
  tags = models.ManyToManyField(Tag)

class Review(models.Model):
  text = models.CharField(max_length=2000, null=True)
  user = models.ForeignKey(User) 
  foodRating = models.DecimalField(max_digits=3, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
  reviewRating = models.IntegerField(null=True)
  food = models.ForeignKey(Food) 

class Image(models.Model):
  food = models.ForeignKey(Food) 
  image = models.CharField(max_length=255, unique=True)
  review = models.ForeignKey(Review, null=True)
  votes = models.IntegerField(default=0)

