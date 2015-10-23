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
