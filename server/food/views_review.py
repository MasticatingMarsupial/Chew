from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from food.models import *
from food.serializers_review import ReviewSerializer
from django.http import Http404

class ReviewList(generics.ListCreateAPIView):
  serializer_class = ReviewSerializer
  permission_classes = (permissions.IsAuthenticated,)

  def get_queryset(self):
    user = self.request.user
    return Review.objects.filter(owner=user)

  def perform_create(self, serializer):
    serializer.save(owner=self.request.user)

class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = ReviewSerializer
  permissions_classes = (permissions.IsAuthenticated,)

  def get_queryset(self):
    user = self.request.user
    return Review.objects.filter(owner=user)

# class ReviewList(APIView):
#   def get(self, request, format=None):
#     reviews = Review.objects.all()
#     serializer = ReviewSerializer(reviews, many=True)
#     return Response(serializer.data)

#   def post(self, request, format=None):
#     serializer = ReviewSerializer(data=request.data)
#     if serializer.is_valid():
#       serializer.save()
#       return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class ReviewDetail(APIView):

#   def get_object(self, pk):
#     try:
#       return Review.objects.get(pk=pk)
#     except Review.DoesNotExist:
#       raise Http404

#   def get(self, request, pk, format=None):
#     review = self.get_object(pk)
#     serializer = ReviewSerializer(review)
#     print(serializer.data)
#     return Response(serializer.data)

#   def put(self, request, pk, format=None):
#     review = self.get_object(pk)
#     serializer = ReviewSerializer(review, data=request.data)
#     if serializer.is_valid():
#       serializer.save()
#       return Response(serializer.data)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#   def delete(self, request, pk, format=None):
#     review = self.get_object(pk)
#     review.delete()
#     return Response(status=status.HTTP_204_NO_CONTENT)

# class ReviewGroups(APIView):
#   def get_object(self, food_pk):
#     try:
#       Review.objects.filter(food_pk=food_pk).all()
#     except Review.DoesNotExist:
#       raise Http404

#   def get(self, request, food_pk, format=None):
#     review = Review.objects.filter(food_id=food_pk)
#     serializer = ReviewSerializer(review, many=True)
#     return Response(serializer.data)











