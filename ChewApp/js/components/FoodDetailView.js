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
    return {
      dataSource: dataSource,
      images: [],
      reviewsDataSource: dataSource.cloneWithRows([]),
      restName: '',
      restLongitude: '',
      restLatitude: '',
      isReviewModalOpen: false,
      imageLikeButtonState: [],
    };
  },
  componentDidMount: function () {
    ReviewStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    this.fetchImages(this.props.food.id);
    this.fetchReviews(this.props.food.id);
    this.setLocation();
    // this.setUserLikes();
  },
  componentWillUnmount: function () {
    ReviewStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.fetchImages(this.props.food.id);
    this.setState(getUserState());
  },
  setLocation: function(){
    this.setState({
      restName: this.props.food.restaurant.name,
      restLongitude: this.props.food.restaurant.address.longitude,
      restLatitude: this.props.food.restaurant.address.latitude,
    });
  },
  // setUserLikes: function () {
  //   var user = UserStore.getAccount();
  //   var state = user.food_liked.find((food) => food.id === this.props.food.id);
  //   this.setState({
  //     foodLiked: state,
  //   });
  // },
  fetchImages: function (query) {
    console.log('API Query:', API_URL + 'images/foods/' + query);
    fetch(API_URL + 'images/foods/' + query)
      .then((res) => res.json())
      .catch((err) => console.error('Fetching query failed: ' + err))
      .then((responseData) => {
        var imageLikeButtonState = [];
        for (var i = 0; i < responseData.length; i++) {
          imageLikeButtonState.push('white');
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
  sendTokenAuth: function () {
    var token = UserStore.getToken(); // token

    fetch(API_URL + 'token-check/' + token.token)
      .then((response) => response)
      .catch((err) => console.error('Fetching query failed: ' + err))
      .then((response) => {
        if (response.status === 200) {
          this.addImageToUserAndUpvote(index);
        } else {
         console.log('invalid token');
       }
      })
      .done();
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
  pressHeartButton: function (index) {
    var user = UserStore.getAccount();
    var image = this.state.images[index];
    this.toggleHeartButtonState(index);
    // Object.keys(user).length > 0 ? UserAction.updateAccountLikes(user.user.username, user, image) : console.log('user not logged in');

    if (Object.keys(user).length > 0) {
      UserAction.updateAccountLikes(user.user.username, user, image);
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
    if (imageLikeButtonState[index] === 'white') {
      imageLikeButtonState[index] = 'red';
    } else {
      imageLikeButtonState[index] = 'white';
    }
    this.setState({
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
    ReviewAction.create(rating, review, UserStore.getAccount().id, this.props.food.id);
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
    if (Platform.OS === 'android') {
      AndroidModal = modalComponent;
    } else {
      iosModal = modalComponent;
    }
    console.log(this.props.food)
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
                  <Text style={styles.address}> {this.props.food.restaurant.address.street_address} </Text>
                  <Text style={styles.address}> {this.props.food.restaurant.address.city}, {this.props.food.restaurant.address.state} {this.props.food.restaurant.address.zipcode}</Text>
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
                <TouchableElement
                  onPress={this.onPostmatesButtonPress}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}> Postmates </Text>
                  </View>
                </TouchableElement>
              </View>
              <View style={styles.addressContainerSeparator} />
              <View style={styles.leftRowContainer}>
                <Icon
                  name="fontawesome|car"
                  size={13}
                  color={'#dcdcdc'}
                  style={styles.locationIcon}
                />
                <TouchableElement
                  onPress={this.onUberButtonPress}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}> Uber </Text>
                  </View>
                </TouchableElement>
              </View>
            </View>

            <TouchableElement
              onPress={() => this.onMapButtonPress()}
            >
              <GoogleStaticMap
                style={styles.map}
                latitude={this.state.restLatitude}
                longitude={this.state.restLongitude}
                zoom={14}
                size={{ width: width-180, height: 220 }}
              />
            </TouchableElement>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableElement
              onPress={this.onMakeReviewButtonPress}
            >
              <View style={styles.reviewButton}>
                <Text style={styles.reviewButtonText}> Review </Text>
              </View>
            </TouchableElement>
          </View>
          <ListView
            dataSource={this.state.reviewsDataSource}
            renderRow={this.renderRow}
            style={styles.reviewList}
          />
        </ScrollView>
          <TouchableElement
            onPress={this.onMakeReviewButtonPress}
          >
            <View style={styles.reviewButton}>
              <Text style={styles.reviewButtonText}> + </Text>
            </View>
          </TouchableElement>
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
    justifyContent: 'space-between',
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
  reviewButton: {
    borderRadius: 20,
    marginRight: 5,
    // borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
    // borderStyle: 'solid',
    backgroundColor: '#F44336',
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
    // fontWeight: 'bold',
  },
 reviewButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    paddingTop: 5,
    backgroundColor: '#E53935',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 50,
  },
  reviewButtonText: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 20,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
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
    width: width,
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
