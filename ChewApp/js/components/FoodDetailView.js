'use strict';

var React = require('react-native');
var UserStore = require('../stores/UserStore');

var {
  StyleSheet,
  Platform,
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableNativeFeedback,
  ListView,
} = React;

var Dimensions = require('Dimensions');
var {Icon,} = require('react-native-icons');
var Carousel = require('react-native-looped-carousel');
var Button = require('react-native-button');
var GoogleStaticMap = require('./GoogleStaticMap');
var StarRating = require('./StarRating');

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
    };
  },
  componentDidMount: function () {
    // this.fetchImages(this.props.food.id);
    this.fetchImages(this.props.food.id);
    this.fetchReviews(this.props.food.id);
  },
  fetchImages: function (query) {
    console.log('API Query:', API_URL + 'images/foods/' + query);
    fetch(API_URL + 'images/foods/' + query)
      .then((res) => res.json())
      .catch((err) => console.error('Fetching query failed: ' + err))
      .then((responseData) => {
        console.log('Fetched images', responseData);
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
        console.log('Fetched reviews', responseData);
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
    this.state.images[index].votes++;
    this.setState({
      images: this.state.images,
    }, function () {
      console.log('I hope this works');
    });
    // this.addImageToUserLikes(index, this.state.images[index].id, user.id);
    this.addVotesToImage(index, this.state.images[index].id);
  },
  addImageToUserLikes: function (index, imageId, userId) {
    console.log('API Query:', API_URL + 'users/' + userId);
    fetch(API_URL + 'users/', + userId, JSON.stringify({
      method: 'PUT',
      // headers: { token: 'token-goes-here'},
      body: {
        images_liked: this.state.images[index].id
      }
    }))
      .catch((err) => console.error('Unsuccessfully requested to like an image: ', err))
      .then((responseData) => {
        console.log('Successfully requested to like an image: ', responseData);
        // this.addVotesToImage(index, imageId);
      })
      .done()
  },
  addVotesToImage: function (index, imageId) {
    console.log('API Query:', API_URL + 'images/' + imageId);
    fetch(API_URL + 'images/' + imageId, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        votes: this.state.images[index].votes
      })
    })
      .catch((err) => console.error('Unsuccessfully requested to upvote: ', err))
      .then((responseData) => console.log('Successfully requested to upvote: ', responseData))
      .done()
  },
  selectedStar: function (rating) {
    console.log('Rated ' + rating + ' stars!');
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
  render: function () {
    var TouchableElement = TouchableHighlight;
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
        )}, this);

    return (
      <View
        automaticallyAdjustContentInsets={false}
        style={styles.container}
      >
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
              onPress={this.pressLikeButton}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}> I Like This </Text>
              </View>
            </TouchableElement>
          </View>
          <GoogleStaticMap 
            style={{width: width, height: 200}}
            latitude={'32.064171'}
            longitude={'34.7748068'}
            zoom={15}
            size={{ width: width, height: 200 }}
          />
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
