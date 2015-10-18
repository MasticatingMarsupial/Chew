from django.conf.urls import url
from food import views_food, views_review, views_search, views_image

urlpatterns = [
  url(r'^api/foods/$', views_food.FoodList.as_view()),
  url(r'^api/foods/(?P<pk>[0-9]+)/$', views_food.FoodDetail.as_view()),
  url(r'^api/foods/restaurants/(?P<restaurant_pk>[0-9]+)/$', views_food.FoodGroups.as_view()),
  url(r'^api/reviews/$', views_review.ReviewList.as_view()),
  url(r'^api/reviews/(?P<pk>[0-9]+)/$', views_review.ReviewDetail.as_view()),
  url(r'^api/reviews/foods/(?P<food_pk>[0-9]+)/$', views_review.ReviewGroups.as_view()),
  url(r'^api/search/(?P<search_term>\w+)/$', views_search.Search.as_view()),
  url(r'^api/images/foods/(?P<food_pk>\w+)/$', views_image.ImageGroups.as_view()),
]
