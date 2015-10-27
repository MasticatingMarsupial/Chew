from rest_framework import status, generics, permissions, mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from food.models import *
from food.serializers_review import ReviewSerializer
from django.http import Http404
from food.permissions import IsOwnerOrReadOnly

class ReviewList(generics.ListCreateAPIView):
  queryset = Review.objects.all()
  serializer_class = ReviewSerializer
  permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

  def perform_create(self, serializer):
    serializer.save(owner=self.request.user)

class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
  queryset = Review.objects.all()
  serializer_class = ReviewSerializer
  permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly,)


class ReviewGroups(APIView):
  def get_object(self, food_pk):
    try:
      Review.objects.filter(food_pk=food_pk).all()
    except Review.DoesNotExist:
      raise Http404

  def get(self, request, food_pk, format=None):
    review = Review.objects.filter(food_id=food_pk)
    serializer = ReviewSerializer(review, many=True)
    return Response(serializer.data)