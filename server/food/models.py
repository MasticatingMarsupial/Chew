from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User

class Setting(models.Model):
  distance = models.DecimalField(max_digits=5, decimal_places=4)

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
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  name = models.CharField(max_length=255)
  address = models.ForeignKey(Address)
  cuisine = models.ForeignKey(Cuisine)

class Food(models.Model):
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  name = models.CharField(max_length=255)
  cuisine = models.ForeignKey(Cuisine, null=True, blank=True) 
  restaurant = models.ForeignKey(Restaurant)
  price = models.IntegerField(null=True, blank=True)
  avgRating = models.DecimalField(max_digits=3, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
  numRating = models.IntegerField(default=0)
  tags = models.ManyToManyField(Tag)

class Review(models.Model):
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  text = models.CharField(max_length=2000, null=True)
  owner = models.ForeignKey(User)
  foodRating = models.DecimalField(max_digits=3, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
  reviewRating = models.IntegerField(null=True)
  food = models.ForeignKey(Food)

class Image(models.Model):
  created_at = models.DateTimeField(auto_now_add=True)
  food = models.ForeignKey(Food, null=True)
  owner = models.ForeignKey(User, null=True)
  image = models.CharField(max_length=255, unique=True)
  review = models.ForeignKey(Review, null=True)
  votes = models.IntegerField(default=0)

class Account(models.Model):
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  user = models.OneToOneField(User)
  food_favorites = models.ManyToManyField(Food, related_name='users_favorited')
  food_liked = models.ManyToManyField(Food, related_name='users_liked')
  food_disliked = models.ManyToManyField(Food, related_name='users_disliked')
  images_liked = models.ManyToManyField(Image, related_name='users_liked')
  search_preferences = models.OneToOneField(Setting, null=True)
  reviews_liked = models.ManyToManyField(Review, related_name='users_liked')
  reviews_disliked = models.ManyToManyField(Review, related_name='users_disliked')
