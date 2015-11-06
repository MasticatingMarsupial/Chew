from django.conf.urls import url
from food import views_food, views_review, views_search, views_image, views_user

urlpatterns = [
  url(r'^api/foods/$', views_food.FoodList.as_view()),
  url(r'^api/foods/(?P<pk>[0-9]+)/$', views_food.FoodDetail.as_view()),
  url(r'^api/foods/restaurants/(?P<restaurant_pk>[0-9]+)/$', views_food.FoodGroups.as_view()),
  url(r'^api/foods/favorites/(?P<account_pk>[0-9]+)/$', views_food.FoodFavorites.as_view()),
  url(r'^api/images/(?P<pk>[0-9]+)/$', views_image.ImageDetail.as_view()),
  url(r'^api/images/foods/(?P<food_pk>\w+)/$', views_image.ImageGroups.as_view()),
  url(r'^api/foods/recommendations/$', views_food.FoodRecs.as_view()),
  url(r'^api/reviews/$', views_review.ReviewList.as_view()),
  url(r'^api/reviews/(?P<pk>[0-9]+)/$', views_review.ReviewDetail.as_view()),
  url(r'^api/reviews/foods/(?P<food_pk>[0-9]+)/$', views_review.ReviewGroups.as_view()),
  url(r'^api/search/(?P<search_term>.+)/$', views_search.Search.as_view()),
  url(r'^api/signup/$', views_user.Signup.as_view()),
  url(r'^api/signin/$', views_user.Signin.as_view()),
  url(r'^api/users/$', views_user.UserList.as_view()),
  url(r'^api/users/(?P<pk>[0-9]+)/$', views_user.UserDetail.as_view(), {'param':'param', 'param2':'param2'}),
  url(r'^api/users/(?P<pk>[0-9]+)/likes/foods/$', views_user.UserDetail.as_view(), {'param':'food_liked', 'param2':'upvote'}),
  url(r'^api/users/(?P<pk>[0-9]+)/likes/images/$', views_user.UserDetail.as_view(), {'param':'images_liked', 'param2': 'upvote'}),
  url(r'^api/users/(?P<pk>[0-9]+)/unlikes/images/$', views_user.UserDetail.as_view(), {'param':'images_liked', 'param2':'downvote'}),
  url(r'^api/token-check/(?P<token>.+)/$', views_user.TokenCheck.as_view()),
]
