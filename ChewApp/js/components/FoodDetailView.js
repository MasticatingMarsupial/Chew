'use strict';

var React = require('react-native');
var ReviewAction = require('../actions/ReviewActions');
var ReviewStore = require('../stores/ReviewStore');
var UserAction = require('../actions/UserActions');
var UserStore = require('../stores/UserStore');

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
} = React;

var SigninView = require('./SigninView');
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

function getUserState () {
  console.log('this got called');
  return {
    account: UserStore.getAccount()
  };
}

var FoodDetailView = React.createClass({
  getInitialState: function () {
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    console.log('RATING', this.props.food.avgRating);
    return {
      dataSource: dataSource,
      images: [],
      reviewsDataSource: dataSource.cloneWithRows([]),
      restName: '',
      restLongitude: '',
      restLatitude: '',
      isReviewModalOpen: false,
      imageLikeButtonState: [],
      averageFoodRating: parseFloat(this.props.food.avgRating),
    };
  },
  componentDidMount: function () {
    ReviewStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    this.fetchImages(this.props.food.id);
    this.fetchReviews(this.props.food.id);
    this.setLocation();
  },
  componentWillUnmount: function () {
    ReviewStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.fetchFood(this.props.food.id);
    this.fetchImages(this.props.food.id);
    this.fetchReviews(this.props.food.id);
    this.setState(getUserState());
  },
  setLocation: function(){
    this.setState({
      restName: this.props.food.restaurant.name,
      restLongitude: this.props.food.restaurant.address.longitude,
      restLatitude: this.props.food.restaurant.address.latitude,
    });
  },
  fetchFood: function (query) {
    console.log('API Query:', API_URL + '/foods/' + query);
    fetch(API_URL + 'foods/' + query)
      .then((res) => res.json())
      .catch((err) => console.error('Fetching query failed: ' + err))
      .then((responseData) => {
        console.log('Fetched food', responseData.avgRating);
        this.setState({
          averageFoodRating: parseFloat(responseData.avgRating),
        });
      })
      .done();
  },
  fetchImages: function (query) {
    console.log('API Query:', API_URL + 'images/foods/' + query);
    fetch(API_URL + 'images/foods/' + query)
      .then((res) => res.json())
      .catch((err) => console.error('Fetching query failed: ' + err))
      .then((responseData) => {
        var userLikes = UserStore.getAccount().images_liked;
        var imageLikeButtonState = [];
        if (userLikes === undefined) {
          for (var i = 0; i < responseData.length; i++) {
            imageLikeButtonState.push('white');
          }
        } else {
          for (var i = 0; i < responseData.length; i++) {
            for (var j = 0; j < userLikes.length; j++) {
              if (responseData[i].id === userLikes[j].id) {
                imageLikeButtonState[i] = 'red';
              }
            }
            if (imageLikeButtonState[i] === undefined) {
              imageLikeButtonState[i] = 'white';
            }
          }
        }
        this.setState({
          images: responseData,
          imageLikeButtonState: imageLikeButtonState,
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
        console.log('Fetched reviews', responseData);
        this.setState({
          reviewsDataSource: this.state.dataSource.cloneWithRows(responseData)
        });
      })
      .done();
  },
  authenticateToken: function () {
    var token = UserStore.getToken(); // token
    var user = UserStore.getAccount();
    var authenticated = false;

    fetch(API_URL + 'token-check/' + token)
      .then((res) => res.json())
      .catch((err) => console.error('Fetching query failed: ' + err))
      .then((responseData) => {
        if(responseData.id === user.id) {
          authenticated = true;
        }
      })
      .done();

    return authenticated;
  },
  goToSigninView: function () {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: 'Signin',
        component: SigninView,
      });
    } else {
      this.props.navigator.push({
        title: 'Signin',
        name: 'login',
      });
    }
  },
  pressFavoriteButton: function () {
    var user = UserStore.getAccount();
    var food = this.props.food;

    if (Object.keys(user).length > 0) {
      UserAction.updateAccountLikes(user.user.username, user, food);
    } else {
      if (Platform.OS === 'android') {
        this.goToSigninView();
      } else {
        AlertIOS.alert('Account Required', 'Please sign in or create an account to like this food', [
          {
            text: 'Sign In',
            onPress: this.goToSigninView
          },
          {
            text: 'No thanks',
            onPress: this.cancel
          }
        ]);
      }
    }
  },
  // Refrain from toggling this too quickly
  pressHeartButton: function (index) {
    var user = UserStore.getAccount();
    var image = this.state.images[index];

    if (Object.keys(user).length > 0) {
      UserAction.updateAccountLikes(user.user.username, user, image);
      this.toggleHeartButtonState(index);
    } else {
      if (Platform.OS === 'android') {
        this.goToSigninView();
      } else {
        AlertIOS.alert('Account Required', 'Please sign in or create an account to like this image', [
          {
            text: 'Sign in',
            onPress: this.goToSigninView
          },
          {
            text: 'No thanks',
            onPress: this.cancel
          }
        ]);
      }
    }
  },
  toggleHeartButtonState: function (index) {
    var imageLikeButtonState = this.state.imageLikeButtonState.slice();
    var images = this.state.images.slice();
    if (imageLikeButtonState[index] === 'white') {
      imageLikeButtonState[index] = 'red';
      images[index].votes++;
    } else {
      imageLikeButtonState[index] = 'white';
      images[index].votes--;
    }
    this.setState({
      images: images,
      imageLikeButtonState: imageLikeButtonState,
    });
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
          <Text style={styles.username}>{rowData.owner.username}</Text>
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
    console.log('Initial modal open state', this.state.isReviewModalOpen);
    this.setState({isReviewModalOpen: true});
    // this.setState({isOpen: true});
    console.log('Modal open state after press', this.state.isReviewModalOpen);
  },
  onCloseReviewButtonPress: function () {
    this.dismissReviewModal();
    // this.setState({isOpen: false});
  },
  dismissReviewModal: function () {
    this.setState({isReviewModalOpen: false});
    // this.setState({isOpen: false});
  },
  submitReview: function (rating, review) {
    console.log('Submitting rating:', rating);
    console.log('Submitting review:', review);
    this.dismissReviewModal();
    ReviewAction.create(rating, review, UserStore.getAccount().user.username, this.props.food.id);
  },
  render: function () {
    var TouchableElement = TouchableOpacity;
    var images = this.state.images.map(function (image, i) {
      return (
        <View key={i + 1} style={styles.slide}>
          <Image
            source={{uri: this.state.images[i].image}}
            style={styles.image}
          >
            <View style={styles.heartContainer}>
              <View style={styles.heartBox}>
                <Button
                  activeOpacity={0.20}
                  onPress={this.pressHeartButton.bind(this, i)}
                  style={styles.heartButton}
                >
                  <Icon
                    name="ion|android-favorite"
                    size={40}
                    color={this.state.imageLikeButtonState[i]}
                    ref={'heartIcon' + i}
                    style={styles.heart}
                  />
                </Button>
                <Text style={styles.heartCounts}>
                  {this.state.images[i].votes}
                </Text>
              </View>
            </View>
          </Image>
        </View>
      );
    }, this);
    var modalComponent = <MakeReviewModalView
      visible={this.state.isReviewModalOpen}
      isOpen={this.state.isReviewModalOpen}
      onSubmitReview={this.submitReview}
      onCloseReviewButtonPress={this.onCloseReviewButtonPress}
      food={this.props.food}
    />;
     var AndroidModal;
    var iosModal;
    var ReviewButton;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
      AndroidModal = modalComponent;
      ReviewButton = <TouchableElement
                        onPress={this.onMakeReviewButtonPress}
                      >
                        <View style={styles.reviewButton}>
                          <Text style={styles.reviewButtonText}> + </Text>
                        </View>
                      </TouchableElement>;
    } else {
      iosModal = modalComponent;
      ReviewButton = <TouchableElement
                        onPress={this.onMakeReviewButtonPress}
                        style={styles.reviewButton}
                      >
                          <Text style={styles.reviewButtonText}> + </Text>
                      </TouchableElement>;
    }

    var reviewLabel = 'Review';

    if (this.state.reviewsDataSource._cachedRowCount > 1) {
      reviewLabel += 's';
    }

    var address1 = 'N/A';
    var address2 = '';

    if (this.props.food.restaurant.address.street_address) {
      address1 = this.props.food.restaurant.address.street_address;
      address2 = this.props.food.restaurant.address.city + ', ' + this.props.food.restaurant.address.state;
    }

    return (
      <View
        automaticallyAdjustContentInsets={false}
        style={styles.container}
      >
        {iosModal}
        <ScrollView
          contentContainerStyle={styles.scrollView}
        >
          <View style={styles.carouselContainer}>
            <Carousel autoplay={false} style={styles.carousel}>
              {images}
            </Carousel>


            <View style={styles.titleContainer}>
              <Text style={styles.name}>
                {this.props.food.name}
              </Text>
              <Text style={styles.restaurant}>
                @{this.props.food.restaurant.name}
              </Text>
            </View>
          </View>


          <View style={styles.scoresContainer}>
            <View style={styles.scoresElement}>
              <Text style={styles.scoresElementText}>
                {this.props.food.numRating}
              </Text>
              <Text style={styles.scoresElementText}>
                Faves
              </Text>
            </View>
            <View style={styles.scoresElement}>
              <View style={styles.averageReviewStarContainer}>
                <StarRating maxStars={5}
                  rating={this.state.averageFoodRating}
                  disabled={true}
                  styles={styles.reviewStarRating}
                  starSize={15}/>
              </View>
              <Text style={styles.scoresElementText}>
                Stars
              </Text>
            </View>
            <View style={styles.scoresElement}>
              <Text style={styles.scoresElementText}>
                {this.state.reviewsDataSource._cachedRowCount}
              </Text>
              <Text style={styles.scoresElementText}>
                {reviewLabel}
              </Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.addressLeftContainer}>
              <View style={styles.leftRowContainer}>
                <Icon
                  name="fontawesome|map-marker"
                  size={13}
                  color={'#dcdcdc'}
                  style={styles.locationIcon}
                />
                <View style={styles.addressContainer}>
                  <Text style={styles.address}> {address1} </Text>
                  <Text style={styles.address}> {address2}</Text>
                </View>
              </View>
              <View style={styles.addressContainerSeparator} />
              <View style={styles.leftRowContainer}>
                <Icon
                  name="fontawesome|location-arrow"
                  size={13}
                  color={'#dcdcdc'}
                  style={styles.locationIcon}
                />
                <Text style={styles.distance}> {this.props.food.distance} miles away </Text>
              </View>
              <View style={styles.addressContainerSeparator} />
              <View style={styles.leftRowContainer}>
                <Icon
                  name="fontawesome|truck"
                  size={13}
                  color={'#dcdcdc'}
                  style={styles.locationIcon}
                />
                <Button
                  onPress={this.onPostmatesButtonPress}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}> Postmates </Text>
                </Button>
              </View>
              <View style={styles.addressContainerSeparator} />
              <View style={styles.leftRowContainer}>
                <Icon
                  name="fontawesome|car"
                  size={13}
                  color={'#dcdcdc'}
                  style={styles.locationIcon}
                />
                <Button
                  onPress={this.onUberButtonPress}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}> Uber </Text>
                </Button>
              </View>
            </View>


            <TouchableOpacity
              onPress={() => this.onMapButtonPress()}
            >
              <GoogleStaticMap
                style={styles.map}
                latitude={this.state.restLatitude}
                longitude={this.state.restLongitude}
                zoom={14}
                size={{ width: width - 180, height: 220 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.reviewListContainer}>
            <ListView
              dataSource={this.state.reviewsDataSource}
              renderRow={this.renderRow}
              style={styles.reviewList}
            />
          </View>
        </ScrollView>
        {ReviewButton}
        {AndroidModal}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    flexDirection: 'column',
    position: 'absolute',
    width: width,
    bottom: 0,
  },
  name: {
    fontSize: 25,
    textAlign: 'left',
    marginTop: 10,
    marginLeft: 15,
    color: 'white',
  },
  restaurant: {
    fontSize: 18,
    textAlign: 'left',
    marginTop: 5,
    marginLeft: 15,
    marginBottom: 15,
    color: 'white',
  },
  carouselContainer: {
    alignItems: 'flex-end',
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
  },
  heartBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 15,
    paddingRight: 10,
    paddingBottom: 7,
    paddingTop: 8,
    borderBottomLeftRadius: 28,
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
  reviewListContainer: {
    width: width,
  },
  reviewList: {
    marginTop: 10,
    marginBottom: 20,
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
  averageReviewStarContainer: {
    width: 120,
    flexDirection: 'row',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoresElement: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 15,
  },
  scoresElementText: {
    width: 120,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    // borderRadius: 16,
    // marginRight: 5,
    // paddingLeft: 5,
    // paddingRight: 5,
    // paddingTop: 2,
    // paddingBottom: 2,
    // backgroundColor: '#F44336',
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
    // fontWeight: 'bold',
  },
  reviewButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    bottom: 10,
    right: 10,
  },
  reviewButtonText: {
    fontSize: 18,
    color: 'white',
  },
  locationContainer: {
    flex: 1,
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 15,
  },
  map: {
    flex: 0.5,
    height: 220,
  },
  addressLeftContainer: {
    flex: 0.5,
    height: 220,
    flexDirection: 'column',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#dcdcdc',
  },
  address: {
    textAlign: 'left',
    fontSize: 14,
    // fontWeight: 'bold'
  },
  distance: {
    textAlign: 'left',
    fontSize: 14,
    // fontWeight: 'bold',
  },
  serviceButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressContainerSeparator: {
    backgroundColor: '#dcdcdc',
    borderRadius: 1,
    width: (width / 2) - 22,
    height: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  mainVerticalSeparator: {
    backgroundColor: '#dcdcdc',
    borderRadius: 1,
    width: 340,
    height: 2,
    marginTop: 15,
    marginBottom: 15,
  },
  locationIcon: {
    height: 13,
    width: 13,
    marginRight: 3,
  },
  leftRowContainer: {
    flexDirection: 'row',
  }
});

module.exports = FoodDetailView;
