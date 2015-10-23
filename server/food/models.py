from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User

class Tag(models.Model):
  name = models.CharField(max_length=255, unique=True)

class Cuisine(models.Model):
  name = models.CharField(max_length=255, unique=True)

class Address(models.Model):
  street_address = models.CharField(max_length=100)
  city = models.CharField(max_length=50)
  state = models.CharField(max_length=50)
  zipcode = models.CharField(max_length=20)
  latitude = models.DecimalField(max_digits=9, decimal_places=7, validators=[MinValueValidator(-90), MaxValueValidator(90)])
  longitude = models.DecimalField(max_digits=10, decimal_places=7, validators=[MinValueValidator(-180), MaxValueValidator(180)])

class Restaurant(models.Model):
  name = models.CharField(max_length=255)
  address = models.ForeignKey(Address)
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
  owner = models.ForeignKey('auth.User', related_name='reviews')
  foodRating = models.DecimalField(max_digits=3, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
  reviewRating = models.IntegerField(null=True)
  food = models.ForeignKey(Food) 

class Image(models.Model):
  food = models.ForeignKey(Food, null=True) 
  image = models.CharField(max_length=255, unique=True)
  review = models.ForeignKey(Review, null=True)
  votes = models.IntegerField(default=0)
