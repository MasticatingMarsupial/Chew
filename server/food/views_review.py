from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from food.models import *
from food.serializers_review import ReviewSerializer
from django.http import Http404

class ReviewList(APIView):
  def get(self, request, format=None):
    reviews = Review.objects.all()
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

  def post(self, request, format=None):
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewDetail(APIView):

  def get_object(self, pk):
    try:
      return Review.objects.get(pk=pk)
    except Review.DoesNotExist:
      raise Http404

  def get(self, request, pk, format=None):
    review = self.get_object(pk)
    serializer = ReviewSerializer(review)
    return Response(serializer.data)

  def put(self, request, pk, format=None):
    review = self.get_object(pk)
    serializer = ReviewSerializer(review, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def delete(self, request, pk, format=None):
    review = self.get_object(pk)
    review.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)





####################### Generic class based views
# from food.models import Food, Review, Image
# from food.serializers import FoodSerializer, ReviewSerializer, ImageSerializer
# from rest_framework import generics

# class FoodList(generics.ListCreateAPIView):
#   queryset = Food.objects.all()
#   serializer_class = FoodSerializer

# class FoodDetail(generics.RetrieveUpdateDestroyAPIView):
#   queryset = Food.objects.all()
#   serializer_class = FoodSerializer

# class ReviewList(generics.ListCreateAPIView):
#   queryset = Review.objects.all()
#   serializer_class = ReviewSerializer

# class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
#   queryset = Review.objects.all()
#   serializer_class = ReviewSerializer

# class ImageList(generics.ListCreateAPIView):
#   queryset = Image.objects.all()
#   serializer_class = ImageSerializer

# class ImageDetail(generics.RetrieveUpdateDestroyAPIView):
#   queryset = Image.objects.all()
#   serializer_class = ImageSerializer









