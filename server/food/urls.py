from django.conf.urls import url
from food import views

urlpatterns = [
  url(r'^api/foods/$', views.FoodList.as_view()),
]
