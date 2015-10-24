# Test cases to populate your database with.  Run from python3 manage.py shell
from food.models import Food, Restaurant, Cuisine, Tag, Review, Account, Image, Address
from django.contrib.auth.models import User

address1 = Address.objects.create(street_address='405 Mason St', city='San Francisco', state='CA', zipcode=94102, latitude=37.7873663, longitude=-122.4096625)
address2 = Address.objects.create(street_address='103 Irving St', city='San Francisco', state='CA', zipcode=9412, latitude=37.7637365, longitude=-122.4778788)
address3 = Address.objects.create(street_address='4416 18th St', city='San Francisco', state='CA', zipcode=94114, latitude=37.7608255, longitude=-122.4408786)

cuisine = Cuisine(name='American')
cuisine.save()
restaurant = Restaurant(name='Hot Dog City', address=address1, cuisine=cuisine)
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

restaurant2 = Restaurant(name='Give Me Dogs', address=address2, cuisine=cuisine)
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

restaurant3 = Restaurant(name='Dog Eat Dog World', address=address3, cuisine=cuisine)
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

user = User.objects.create_user(**{
  'username': 'mm',
  'password': 'mm',
  'email': 'koala@bamboo.com',
  'first_name': 'Masticating',
  'last_name': 'Marsupial'
});
account = Account.objects.create(user=user);
account.food_favorites.add(food);
account.food_favorites.add(food2);
account.food_favorites.add(food3);
account.food_liked.add(food);
account.food_liked.add(food2);
account.food_disliked.add(food3);


review1 = Review(**{
  'text': 'Wow this was amazing. My mouth can\'t stop salivating from the thought of this hot dog.  The texture of the bun was exquisite and very on point with the crispiness of the outside.  The toppings worked perfectly in sync to combine together for an amazing flavor.  And the sausage, OMG LOL ^^.\n\nOverall I give this hot dog 4.5 stars and I would definitely come back again.',
  'owner': user,
  'foodRating': 4.5,
  'reviewRating': 0,
  'food': food
})
review1.save()
review2 = Review(**{
  'text': 'The hot dog at first sight seemed on the skinnier side, but thats only because they make their own sausages and its all homemade goodness. The proof was in the taste! Tasted great and the surrounding batter wasn\'t too thick so the sausage wasn\'t lost at all. Would order a regular sausage or the fried chicken sandwich next time though.',
  'owner': user,
  'foodRating': 5.0,
  'reviewRating': 0,
  'food': food
})
review2.save()
review3 = Review(**{
  'text': 'red wine poached cherries, house Dijon. I\'ve had wild boar meat elsewhere and recall it tasting like richer pork meat. The ground meat was mixed with the cherries for a sweet element. Overall, it was okay. I\'m not sure if I\'d order it again, I\'m interested in other things to try. Recommended.',
  'owner': user,
  'foodRating': 4.5,
  'reviewRating': 0,
  'food': food
})
review3.save()
review4 = Review(**{
  'text': 'Visited here on a Sunday afternoon around 1:30 and there was still a line.  Good sign.  I ordered the Maple Pork dog and my wife ordered the Basil Chicken dog with the parmesan french fries.  Both dogs were really good.  Very flavorful franks with some nice accompanying condiments and enjoyable buns.  Okay fries, but I am not a big fry person.  The blueberry-cilantro drink was a little weird, but my wife enjoyed it.',
  'owner': user,
  'foodRating': 4.1,
  'reviewRating': 0,
  'food': food
})
review4.save()
review5 = Review(**{
  'text': 'I ordered the smoked kielbasa - slightly overpriced in my opinion but it was definitely a filling meal. The sausage was very salty but was great with the piperade and dijon mustard. My sister ordered the fried chicken sandwich, which is supposed to be really good here. She liked it but started thinking the ginger flavor was too overwhelming after she was about halfway done with the sandwich.',
  'owner': user,
  'foodRating': 4.3,
  'reviewRating': 0,
  'food': food2
})
review5.save()
review6 = Review(**{
  'text': 'Stopped by this place to grab some late breakfast and got excited to see a maple pork sausage. Overall it was okay. Came with a bit of arugula and some brown mustard. The coffee on the other hand was not pleasant. It had an odd flavor and was weak. Like when a novice uses a French press. Also the sausage didn\'t come with anything, you can add fries or onion rings for an extra 2-4 bucks.',
  'owner': user,
  'foodRating': 5.0,
  'reviewRating': 0,
  'food': food3
})
review6.save()

image0 = Image.objects.create(**{
  'id': 1, 
  'image': 'http://theworldsbestever.s3.amazonaws.com/blog/wp-content/uploads/2014/08/polar-bear-grizzly.jpg',
  'votes': 0
})

image1 = Image(**{
  'food': food,
  'image': 'http://lorempixel.com/200/200/food/1/jpg',
  'review': review,
  'votes': 100
})
image1.save()

image2 = Image(**{
  'food': food,
  'image': 'http://lorempixel.com/200/200/food/2/jpg',
  'votes': 10
}) 
image2.save()

image3 = Image(**{
  'food': food,
  'image': 'http://lorempixel.com/200/200/food/3/jpg',
  'votes': 1
}) 
image3.save()

image4 = Image(**{
  'food': food2,
  'image': 'http://lorempixel.com/200/200/food/4/jpg',
  'votes': 1234
}) 
image4.save()

image5 = Image(**{
  'food': food3,
  'image': 'http://lorempixel.com/200/200/food/5/jpg',
  'votes': 500
}) 
image5.save()

account.images_liked.add(image1)
account.images_liked.add(image3)
account.images_liked.add(image5)
account.reviews_liked.add(review)
account.reviews_liked.add(review3)
account.reviews_liked.add(review6)

# This is oops I messed up code to clean out all your tables. Uncomment to use
# from food.models import Food, Restaurant, Cuisine, Tag, Review, Account, Image, Address
# User.objects.all().delete()
# Tag.objects.all().delete()
# Cuisine.objects.all().delete()
# Restaurant.objects.all().delete()
# Food.objects.all().delete()
# Review.objects.all().delete()
# Image.objects.all().delete()
# Address.objects.all().delete()
# Account.objects.all().delete()
