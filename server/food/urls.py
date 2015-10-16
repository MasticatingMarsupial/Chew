from django.conf.urls import url
from food import views_food, views_search

urlpatterns = [
  url(r'^api/foods/$', views_food.FoodList.as_view()),
  url(r'^api/foods/(?P<pk>[0-9]+)/$', views_food.FoodDetail.as_view()),
  url(r'^api/foods/restaurants/(?P<restaurant_pk>[0-9]+)/$', views_food.FoodGroups.as_view()),
  url(r'^api/search/(?P<search_term>[0-9]+)/$', views_search.Search.as_view()),
]
