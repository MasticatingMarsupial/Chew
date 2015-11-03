from rest_framework import status, generics, permissions, mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from food.models import Review, User, Food
from food.permissions import IsOwnerOrReadOnly
from food.serializers_review import ReviewSerializer

class ReviewList(APIView):
  def get_object(self, pk):
    try:
      return Review.objects.get(pk=pk)
    except Review.DoesNotExist:
      raise Http404

  def get(self, request, format=None):
    reviews = Review.objects.all()
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

  def post(self, request, format=None):    
    user = User.objects.get(pk=self.request.data['owner'])
    food = Food.objects.get(pk=self.request.data['food'])
    serializer = ReviewSerializer(data=request.data)
    if Review.objects.filter(food=food, owner=user).exists():
      return Response('Food already reviewed', status.HTTP_400_BAD_REQUEST)
    else:
      if serializer.is_valid():
        serializer.save(owner=user)
        return Response('Successfully created review', status.HTTP_201_CREATED)

  def put(self, request, format=None):
    review = self.get_object(pk=request.data['id'])
    user = User.objects.get(pk=self.request.data['owner'])
    serializer = ReviewSerializer(review, data=request.data)
    if serializer.is_valid():
      serializer.save(owner=user)
      return Response('Food updated', status.HTTP_200_OK)
    return Response('Couldn\'t update the review', status.HTTP_400_BAD_REQUEST)

class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
  queryset = Review.objects.all()
  serializer_class = ReviewSerializer
  # permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly,)


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