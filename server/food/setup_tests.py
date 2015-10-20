# Test cases to populate your database with.  Run from python3 manage.py shell
from food.models import Food, Restaurant, Cuisine, Tag, Review, User, Image

cuisine = Cuisine(name='American')
cuisine.save()
restaurant = Restaurant(name='Hot Dog City', location='123 Anywhere Street, San Francisco, CA 94103', cuisine=cuisine)
restaurant.save()
food = Food(**{
  'name': 'Amazing Hot Dog',
  'cuisine': cuisine,
  'restaurant': restaurant,
  'price': 5.75,
  'avgRating': 4.5,
  'numRating': 10
})
food.save()
tag1 = Tag(name='hot dog')
tag2 = Tag(name='sausage')
tag1.save();
tag2.save();
food.tags.add(tag1)
food.tags.add(tag2)

restaurant2 = Restaurant(name='Give Me Dogs', location='123 American Street, San Francisco, CA 94105', cuisine=cuisine)
restaurant2.save()
food2 = Food(**{
  'name': 'American Style Hot Dog',
  'cuisine': cuisine,
  'restaurant': restaurant2,
  'price': 5.25,
  'avgRating': 4,
  'numRating': 1000
})
food2.save()
food2.tags.add(tag1)
food2.tags.add(tag2)

restaurant3 = Restaurant(name='Dog Eat Dog World', location='944 Market Street, San Francisco, CA 94103', cuisine=cuisine)
restaurant3.save()
food3 = Food(**{
  'name': 'Loaded Hot Dog',
  'cuisine': cuisine,
  'restaurant': restaurant3,
  'price': 6.75,
  'avgRating': 4.65,
  'numRating': 10
})
food3.save()
food3.tags.add(tag1)

user = User(name='Masticating Marsupial')
user.save()
review = Review(**{
  'text': 'Wow this was amazing. My mouth can\'t stop salivating from the thought of this hot dog.  The texture of the bun was exquisite and very on point with the crispiness of the outside.  The toppings worked perfectly in sync to combine together for an amazing flavor.  And the sausage, OMG LOL ^^.\n\nOverall I give this hot dog 4.5 stars and I would definitely come back again.',
  'user': user,
  'foodRating': 4.5,
  'reviewRating': 0,
  'food': food
})
review.save()

image1 = Image(**{
  'food': food,
  'image': 'http://lorempixel.com/200/200/food/1.jpg',
  'review': review,
  'votes': 100
})
image1.save()

image2 = Image(**{
  'food': food,
  'image': 'http://lorempixel.com/200/200/food/2.jpg',
  'votes': 10
}) 
image2.save()

image3 = Image(**{
  'food': food,
  'image': 'http://lorempixel.com/200/200/food/3.jpg',
  'votes': 1
}) 
image3.save()

image4 = Image(**{
  'food': food2,
  'image': 'http://lorempixel.com/200/200/food/4.jpg',
  'votes': 1234
}) 
image4.save()

image5 = Image(**{
  'food': food3,
  'image': 'http://lorempixel.com/200/200/food/5.jpg',
  'votes': 500
}) 
image5.save()


# This is oops I messed up code to clean out all your tables. Uncomment to use
# from food.models import Food, Restaurant, Cuisine, Tag, Review, User, Image
# User.objects.all().delete()
# Tag.objects.all().delete()
# Cuisine.objects.all().delete()
# Restaurant.objects.all().delete()
# Food.objects.all().delete()
# Review.objects.all().delete()
# Image.objects.all().delete()
