'use strict';

var React = require('react-native');
var UserStore = require('../stores/UserStore');
var ReviewAction = require('../actions/ReviewActions');
var ReviewStore = require('../stores/ReviewStore');

var {
  StyleSheet,
  Platform,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  ListView,
  LinkingIOS,
  AlertIOS,
  Modal,
} = React;

var Dimensions = require('Dimensions');
var {Icon,} = require('react-native-icons');
var Carousel = require('react-native-looped-carousel');
var Button = require('react-native-button');
var GoogleStaticMap = require('./GoogleStaticMap');
var MakeReviewModalView = require('./MakeReviewModalView');
var StarRating = require('./StarRating');
if (Platform.OS === 'android'){
  var WebIntent = require('react-native-webintent');
}

var {width, height} = Dimensions.get('window');

var API_URL = 'http://chewmast.herokuapp.com/api/';
// var API_URL = 'http://localhost:8000/api/';

var FoodDetailView = React.createClass({
  getInitialState: function () {
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: dataSource,
      images: [],
      reviewsDataSource: dataSource.cloneWithRows([]),
      restName: '',
      restLongitude: '',
      restLatitude: '',
      isReviewModalOpen: false,
    };
  },
  componentDidMount: function () {
    ReviewStore.addChangeListener(this._onChange);
    this.fetchImages(this.props.food.id);
    this.fetchReviews(this.props.food.id);
    this.setLocation();
  },
  componentWillUnmount: function () {
    ReviewStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    // Method to setState based upon Store changes
  },
  setLocation: function(){
    this.setState({
      restName: this.props.food.restaurant.name,
      restLongitude: this.props.food.restaurant.address.longitude,
      restLatitude: this.props.food.restaurant.address.latitude,
    });
  },
  fetchImages: function (query) {
    console.log('API Query:', API_URL + 'images/foods/' + query);
    fetch(API_URL + 'images/foods/' + query)
      .then((res) => res.json())
      .catch((err) => console.error('Fetching query failed: ' + err))
      .then((responseData) => {
        // console.log('Fetched images', responseData);
        this.setState({
          images: responseData
        });
      })
      .done();
  },
  fetchReviews: function (query) {
    console.log('API Query:', API_URL + 'reviews/foods/' + query);
    fetch(API_URL + 'reviews/foods/' + query)
      .then((res) => res.json())
      .catch((err) => console.error('Fetching query failed: ' + err))
      .then((responseData) => {
        // console.log('Fetched reviews', responseData);
        this.setState({
          reviewsDataSource: this.state.dataSource.cloneWithRows(responseData)
        });
      })
      .done();
  },
  pressLikeButton: function () {
    console.log('Like button pressed');
  },
  pressHeartButton: function (index) {
    var user = UserStore.getAccount();
    if (user.images_liked.find((image) => image.id === this.state.images[index].id ) === undefined) {
      this.state.images[index].votes++;
      this.setState({
        images: this.state.images,
      }, () => {
        console.log('I hope this works');
        user.images_liked.push(this.state.images[index]);
        this.addImageToUserLikes(index, this.state.images[index].id, user);
      });
    } else {
      console.log('Image was already liked');
    }
  },
  addImageToUserLikes: function (index, imageId, user) {
    console.log('API Query:', API_URL + 'users/' + user.id);
    fetch(API_URL + 'users/' + user.id, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: user.id,
        user: user.user,
        food_favorites: user.food_favorites,
        food_liked: user.food_liked,
        food_disliked: user.food_disliked,
        images_liked: user.images_liked,
        search_preferences: user.search_preferences,
        reviews_liked: user.reviews_liked,
        reviews_disliked: [user.reviews_liked[0]],
      })
    })
      .catch((err) => console.error('Unsuccessfully requested to like an image: ', err))
      .then((responseData) => {
        console.log('Successfully requested to like an image: ', responseData);
        // this.addVotesToImage(index, imageId);
      })
      .done();
  },
  addVotesToImage: function (index, imageId) {
    console.log('API Query:', API_URL + 'images/' + imageId);
    fetch(API_URL + 'images/' + imageId, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: this.state.images[index].id,
        image: this.state.images[index].image,
        votes: this.state.images[index].votes,
      })
    })
      .catch((err) => console.error('Unsuccessfully requested to upvote: ', err))
      .then((responseData) => console.log('Successfully requested to upvote: ', responseData))
      .done();
  },
  selectedStar: function (rating) {
    console.log('Rated ' + rating + ' stars!');
  },
  onMapButtonPress: function() {
    var latLongStr = this.state.restLatitude + ',' + this.state.restLongitude;
    if (Platform.OS === 'android') {
      WebIntent.open('geo:0,0?q=' + latLongStr + '(' + this.state.restName + ')');
    } else {
      LinkingIOS.openURL('http://maps.apple.com/?z=12&q=' + this.state.restName + '&ll=' + latLongStr);
    }
  },
  onPostmatesButtonPress: function() {
      var url = 'postmates://';
    if (Platform.OS === 'android') {
      //TODO: Needs error handling for not downloaded.
      WebIntent.open(url);
    } else {
      LinkingIOS.canOpenURL(url, (supported) => {
        if (!supported) {
          AlertIOS.alert('Postmates App Required', 'In order to request a delivery, please download the Postmates app from the App Store', [
            {
              text: 'Go to App Store',
              onPress: this.downloadPostmates
            },
            {
              text: 'Cancel',
              onPress: this.cancel
            }
          ]);
        } else {
          LinkingIOS.openURL(url);
        }
      });
    }
  },
  downloadPostmates: function () {
    LinkingIOS.openURL('https://itunes.apple.com/us/app/postmates/id512393983?mt=8');
  },
  onUberButtonPress: function () {
    var uberClientKey = '';
    var url = 'uber://?client_id=' + uberClientKey + '&action=setPickup&pickup[=my_location]&dropoff[latitude]=' + this.state.restLatitude + '&dropoff[longitude]=' + this.state.restLongitude + '&dropoff[nickname]=' + this.state.restName;
// This would be what we would use if we were going to provide deeper uber intergration
    if (uberClientKey === '') {
      console.log('NEED TO INPUT CLIENT KEY. DO NOT PUSH THIS UP.');
    }

    if (Platform.OS === 'android') {
      //TODO: we need to handle the case of the app not being downloaded
      WebIntent.open(url);
    } else {
      LinkingIOS.canOpenURL(url, (supported) => {
        if (!supported) {
          AlertIOS.alert('Uber App Required', 'In order to request a ride, please download the Uber app from the App Store', [
            {
              text: 'Go to App Store',
              onPress: this.downloadUber
            },
            {
              text: 'Cancel',
              onPress: this.cancel
            }
          ]);
        } else {
          LinkingIOS.openURL(url);
        }
      });
    }
  },
  downloadUber: function () {
    LinkingIOS.openURL('https://itunes.apple.com/us/app/uber/id368677368');
  },
  renderRow: function (rowData) {
    return (
      <View style={styles.reviewContainer}>
        <View style={styles.reviewTopContainer}>
          <Text style={styles.username}>{rowData.owner}</Text>
          <View style={styles.reviewStarContainer}>
            <StarRating maxStars={5}
              rating={parseFloat(rowData.foodRating)}
              disabled={true}
              styles={styles.reviewStarRating}
              starSize={15}/>
          </View>
        </View>
        <View style={styles.reviewTextContainer}>
          <Text style={styles.reviewText}>{rowData.text}</Text>
        </View>
      </View>
    );
  },
  onMakeReviewButtonPress: function () {
    console.log('Make review button pressed');
    this.setState({isReviewModalOpen: true});
  },
  onCloseReviewButtonPress: function () {
    this.dismissReviewModal();
  },
  dismissReviewModal: function () {
    this.setState({isReviewModalOpen: false});
  },
  submitReview: function (rating, review) {
    console.log('Submitting rating:', rating);
    console.log('Submitting review:', review);
    this.dismissReviewModal();
    ReviewAction.create(rating, review);
  },
  render: function () {
    var TouchableElement = TouchableOpacity;
      if (Platform.OS === 'android') {
        TouchableElement = TouchableNativeFeedback;
      }
    var images = this.state.images.map(function (image, i) {
      return (
        <View key={i + 1} style={styles.slide}>
          <Image
            source={{uri: this.state.images[i].image}}
            style={styles.image}
          >
            <View style={styles.heartContainer}>
              <Button
                activeOpacity={0.20}
                onPress={this.pressHeartButton.bind(this, i)}
                style={styles.heartButton}
              >
                <Icon
                  name="fontawesome|heart-o"
                  size={40}
                  color="red"
                  style={styles.heart}
                />
              </Button>
              <Text style={styles.heartCounts}>
                {this.state.images[i].votes}
              </Text>
            </View>
          </Image>
        </View>
      );
    }, this);

    return (
      <View
        automaticallyAdjustContentInsets={false}
        style={styles.container}
      >
        <MakeReviewModalView visible={this.state.isReviewModalOpen} onSubmitReview={this.submitReview} onCloseReviewButtonPress={this.onCloseReviewButtonPress} food={this.props.food} />
        <ScrollView
          style={styles.scrollView}
        >
          <Carousel autoplay={false} style={styles.carousel}>
            {images}
          </Carousel>

          <View style={styles.titleContainer}>
            <Text style={styles.name}>
              {this.props.food.name}
            </Text>
            <Text style={styles.restaurant}>
              {this.props.food.restaurant.name}
            </Text>
          </View>

          <View style={styles.scoresContainer}>
            <View style={styles.scoresElement}>
              <Text style={styles.scoresElementText}>
                {this.props.food.numRating}
              </Text>
              <Text style={styles.scoresElementText}>
                Votes
              </Text>
            </View>
            <View style={styles.scoresElement}>
              <Text style={styles.scoresElementText}>
                {this.props.food.avgRating.toString()}
              </Text>
              <Text style={styles.scoresElementText}>
                Stars
              </Text>
            </View>
            <View style={styles.scoresElement}>
              <Text style={styles.scoresElementText}>
                {this.state.reviewsDataSource._cachedRowCount}
              </Text>
              <Text style={styles.scoresElementText}>
                Reviews
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableElement
              onPress={() => this.onMapButtonPress()}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}> Take Me There </Text>
              </View>
            </TouchableElement>
            <TouchableElement
              onPress={this.pressLikeButton}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}> I Like This </Text>
              </View>
            </TouchableElement>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableElement
              onPress={this.onPostmatesButtonPress}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}> Order on Postmates </Text>
              </View>
            </TouchableElement>
            <TouchableElement
              onPress={this.onUberButtonPress}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}> Ride with Uber </Text>
              </View>
            </TouchableElement>
          </View>
          <GoogleStaticMap
            style={{width: width, height: 200}}
            latitude={this.state.restLatitude}
            longitude={this.state.restLongitude}
            zoom={15}
            size={{ width: width, height: 200 }}
          />
          <View style={styles.buttonContainer}>
            <TouchableElement
              onPress={this.onMakeReviewButtonPress}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}> Make a Review </Text>
              </View>
            </TouchableElement>
          </View>
          <ListView
            dataSource={this.state.reviewsDataSource}
            renderRow={this.renderRow}
            style={styles.reviewList}
          />
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  ScrollView: {
    height: 300,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 10,
    marginLeft: 15,
  },
  restaurant: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 5,
    marginLeft: 15,
  },
  carousel: {
    flex: 1,
    width: width,
    height: width,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    flex: 1,
  },
  heartContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 300,
    marginRight: 15,
  },
  heartButton: {
    height:40,
    width:40,
  },
  heart: {
    height:40,
    width:40,
  },
  heartCounts: {
    fontSize: 35,
    textAlign: 'right',
    marginLeft: 5,
    color: 'white',
  },
  reviewList: {
    marginTop: 10,
  },
  reviewContainer: {
    flexDirection: 'column',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
  },
  reviewTopContainer: {
    flexDirection: 'row',
  },
  username: {
    fontSize: 20,
  },
  reviewStarContainer: {
    marginTop: 5,
    marginLeft: 10,
  },
  reviewStarRating: {

  },
  reviewTextContainer: {

  },
  reviewText: {
    fontSize: 15,
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scoresElement: {
    flexDirection: 'column',
    paddingTop: 15,
  },
  scoresElementText: {
    width: 120,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
    borderStyle: 'solid',
    borderColor: '#808080',
  },
  buttonText: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
  },
});

module.exports = FoodDetailView;
