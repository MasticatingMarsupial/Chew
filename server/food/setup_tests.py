# Test cases to populate your database with.  Run from python3 manage.py shell
from food.models import Food, Restaurant, Cuisine, Tag, Review, Account, Image, Address
from django.contrib.auth.models import User

address1 = Address.objects.get_or_create(street_address='405 Mason St', city='San Francisco', state='CA', zipcode=94102, latitude=37.7873663, longitude=-122.4096625)[0]
address2 = Address.objects.get_or_create(street_address='103 Irving St', city='San Francisco', state='CA', zipcode=9412, latitude=37.7637365, longitude=-122.4778788)[0]
address3 = Address.objects.get_or_create(street_address='4416 18th St', city='San Francisco', state='CA', zipcode=94114, latitude=37.7608255, longitude=-122.4408786)[0]
address4 = Address.objects.get_or_create(street_address='24 Willie Mays Plaza', city='San Francisco', state='CA', zipcode=94107, latitude=37.7746655, longitude=-122.4008025)[0]

cuisine = Cuisine.objects.get_or_create(name='American')[0]
restaurant = Restaurant.objects.get_or_create(name='Hot Dog City', address=address1, cuisine=cuisine)[0]
food = Food.objects.get_or_create(**{
  'name': 'Amazing Hot Dog',
  'cuisine': cuisine,
  'restaurant': restaurant,
  'price': 5.75,
  'avgRating': 4.5,
  'numRating': 10
})[0]
tag1 = Tag.objects.get_or_create(name='hot dog')[0]
tag2 = Tag.objects.get_or_create(name='sausage')[0]
tag3 = Tag.objects.get_or_create(name='chinese')[0]
tag4 = Tag.objects.get_or_create(name='noodles')[0]
food.tags.add(tag1)
food.tags.add(tag2)

restaurant2 = Restaurant.objects.get_or_create(name='Give Me Dogs', address=address2, cuisine=cuisine)[0]
food2 = Food.objects.get_or_create(**{
  'name': 'American Style Hot Dog',
  'cuisine': cuisine,
  'restaurant': restaurant2,
  'price': 5.25,
  'avgRating': 4,
  'numRating': 1000
})[0]
food2.tags.add(tag1)
food2.tags.add(tag2)

restaurant3 = Restaurant.objects.get_or_create(name='Dog Eat Dog World', address=address3, cuisine=cuisine)[0]
food3 = Food.objects.get_or_create(**{
  'name': 'Loaded Hot Dog',
  'cuisine': cuisine,
  'restaurant': restaurant3,
  'price': 6.75,
  'avgRating': 4.65,
  'numRating': 10
})[0]
food3.tags.add(tag1)

restaurant4 = Restaurant.objects.get_or_create(name='Gary\'s Amazing Restaurant', address=address4, cuisine=cuisine)[0]
food4 = Food.objects.get_or_create(**{
  'name': 'Lots of Stuff',
  'cuisine': cuisine,
  'restaurant': restaurant4,
  'price': 14.99,
  'avgRating': 2,
  'numRating': 50
})[0]
food4.tags.add(tag3)
food5 = Food.objects.get_or_create(**{
  'name': 'Super Pot Stickers',
  'cuisine': cuisine,
  'restaurant': restaurant4,
  'price': 5.99,
  'avgRating': 4,
  'numRating': 78
})[0]
food5.tags.add(tag3)
food6 = Food.objects.get_or_create(**{
  'name': 'Beef Noodle Soup',
  'cuisine': cuisine,
  'restaurant': restaurant4,
  'price': 12.99,
  'avgRating': 4.5,
  'numRating': 121
})[0]
food6.tags.add(tag3)
food7 = Food.objects.get_or_create(**{
  'name': 'Szechuan Boiled Fish With Chili Peppers',
  'cuisine': cuisine,
  'restaurant': restaurant4,
  'price': 18.99,
  'avgRating': 4,
  'numRating': 682
})[0]
food7.tags.add(tag3)
food8 = Food.objects.get_or_create(**{
  'name': 'Green Tea',
  'cuisine': cuisine,
  'restaurant': restaurant4,
  'price': 2.99,
  'avgRating': 3.5,
  'numRating': 55
})[0]
food8.tags.add(tag3)

user = User.objects.create_user(**{
  'username': 'mm',
  'password': 'mm',
  'email': 'koala@bamboo.com',
  'first_name': 'Masticating',
  'last_name': 'Marsupial'
});
account = Account.objects.get_or_create(user=user)[0];
account.food_favorites.add(food);
account.food_favorites.add(food2);
account.food_favorites.add(food3);
account.food_liked.add(food);
account.food_liked.add(food2);
account.food_disliked.add(food3);


review1 = Review.objects.get_or_create(**{
  'text': 'Wow this was amazing. My mouth can\'t stop salivating from the thought of this hot dog.  The texture of the bun was exquisite and very on point with the crispiness of the outside.  The toppings worked perfectly in sync to combine together for an amazing flavor.  And the sausage, OMG LOL ^^.\n\nOverall I give this hot dog 4.5 stars and I would definitely come back again.',
  'owner': user,
  'foodRating': 4.5,
  'reviewRating': 0,
  'food': food
})[0]
review2 = Review.objects.get_or_create(**{
  'text': 'The hot dog at first sight seemed on the skinnier side, but thats only because they make their own sausages and its all homemade goodness. The proof was in the taste! Tasted great and the surrounding batter wasn\'t too thick so the sausage wasn\'t lost at all. Would order a regular sausage or the fried chicken sandwich next time though.',
  'owner': user,
  'foodRating': 5.0,
  'reviewRating': 0,
  'food': food
})[0]
review3 = Review.objects.get_or_create(**{
  'text': 'red wine poached cherries, house Dijon. I\'ve had wild boar meat elsewhere and recall it tasting like richer pork meat. The ground meat was mixed with the cherries for a sweet element. Overall, it was okay. I\'m not sure if I\'d order it again, I\'m interested in other things to try. Recommended.',
  'owner': user,
  'foodRating': 4.5,
  'reviewRating': 0,
  'food': food
})[0]
review4 = Review.objects.get_or_create(**{
  'text': 'Visited here on a Sunday afternoon around 1:30 and there was still a line.  Good sign.  I ordered the Maple Pork dog and my wife ordered the Basil Chicken dog with the parmesan french fries.  Both dogs were really good.  Very flavorful franks with some nice accompanying condiments and enjoyable buns.  Okay fries, but I am not a big fry person.  The blueberry-cilantro drink was a little weird, but my wife enjoyed it.',
  'owner': user,
  'foodRating': 4.1,
  'reviewRating': 0,
  'food': food
})[0]
review5 = Review.objects.get_or_create(**{
  'text': 'I ordered the smoked kielbasa - slightly overpriced in my opinion but it was definitely a filling meal. The sausage was very salty but was great with the piperade and dijon mustard. My sister ordered the fried chicken sandwich, which is supposed to be really good here. She liked it but started thinking the ginger flavor was too overwhelming after she was about halfway done with the sandwich.',
  'owner': user,
  'foodRating': 4.3,
  'reviewRating': 0,
  'food': food2
})[0]
review6 = Review.objects.get_or_create(**{
  'text': 'Stopped by this place to grab some late breakfast and got excited to see a maple pork sausage. Overall it was okay. Came with a bit of arugula and some brown mustard. The coffee on the other hand was not pleasant. It had an odd flavor and was weak. Like when a novice uses a French press. Also the sausage didn\'t come with anything, you can add fries or onion rings for an extra 2-4 bucks.',
  'owner': user,
  'foodRating': 5.0,
  'reviewRating': 0,
  'food': food3
})[0]

image0 = Image.objects.get_or_create(**{
  'id': 1, 
  'image': 'http://theworldsbestever.s3.amazonaws.com/blog/wp-content/uploads/2014/08/polar-bear-grizzly.jpg',
  'votes': 0
})[0]

image1 = Image.objects.get_or_create(**{
  'food': food,
  'image': 'http://img1.sunset.timeinc.net/sites/default/files/styles/500xvariable/public/image/2009/02/NE-sonoran-hotdog-0209/new-essentials-sonoran-hotdog-m.jpg?itok=lNmWyTh2',
  'review': review1,
  'votes': 100,
  'owner': user
})[0]

image2 = Image.objects.get_or_create(**{
  'food': food,
  'image': 'http://media.tumblr.com/tumblr_lv1jf80s9o1qh2i8s.jpg',
  'votes': 10,
  'owner': user
})[0]

image3 = Image.objects.get_or_create(**{
  'food': food,
  'image': 'https://c2.staticflickr.com/4/3830/11585006946_695ed5b59b.jpg',
  'votes': 1,
  'owner': user
})[0]

image4 = Image.objects.get_or_create(**{
  'food': food2,
  'image': 'https://36.media.tumblr.com/68c0c6b9d7ff328fa3ce6c32874b58cc/tumblr_ns39fnspRN1s60h3ho1_500.jpg',
  'votes': 1234,
  'owner': user
})[0]

image5 = Image.objects.get_or_create(**{
  'food': food3,
  'image': 'https://c1.staticflickr.com/9/8058/8171309727_580a89d355.jpg',
  'votes': 500,
  'owner': user
})[0]

image6 = Image.objects.get_or_create(**{
  'food': food4,
  'image': 'https://c2.staticflickr.com/8/7331/11497620976_519beec53d.jpg',
  'votes': 201
})[0]
image7 = Image.objects.get_or_create(**{
  'food': food5,
  'image': 'https://c1.staticflickr.com/1/314/19121765781_a87e549ede.jpg',
  'votes': 105
})[0]
image8 = Image.objects.get_or_create(**{
  'food': food6,
  'image': 'https://c2.staticflickr.com/8/7359/8722358432_7540e07351_z.jpg',
  'votes': 432
})[0]
image9 = Image.objects.get_or_create(**{
  'food': food7,
  'image': 'http://www.glutenfreecanteen.com/wp-content/uploads/2012/03/Tiramisu_sliced_sq1k-500x500.jpg',
  'votes': 15
})[0]
image10 = Image.objects.get_or_create(**{
  'food': food8,
  'image': 'http://cloud.graphicleftovers.com/41286/1775745/tea-cup.jpg',
  'votes': 8
})[0]

account.images_liked.add(image1)
account.images_liked.add(image3)
account.images_liked.add(image5)
account.reviews_liked.add(review1)
account.reviews_liked.add(review3)
account.reviews_liked.add(review6)

# This is oops I messed up code to clean out all your tables. Uncomment to use
# from food.models import Food, Restaurant, Cuisine, Tag, Review, Account, Image, Address
# from django.contrib.auth.models import User
# User.objects.all().delete()
# Tag.objects.all().delete()
# Cuisine.objects.all().delete()
# Restaurant.objects.all().delete()
# Food.objects.all().delete()
# Review.objects.all().delete()
# Image.objects.all().delete()
# Address.objects.all().delete()
# Account.objects.all().delete()
