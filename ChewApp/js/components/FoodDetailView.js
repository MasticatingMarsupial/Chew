'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Platform,
  View,
  ScrollView,
  Image,
  Text,
  TouchableHighlight,
  ListView,
} = React;

var Dimensions = require('Dimensions');
var {Icon,} = require('react-native-icons');
var Carousel = require('react-native-looped-carousel');
var Button = require('react-native-button');
var StarRating = require('./StarRating');

var {width, height} = Dimensions.get('window');

var API_URL = 'http://chewmast.herokuapp.com/api/';

var FoodDetailView = React.createClass({
  getInitialState: function () {
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: dataSource,
      images: [],
      reviewsDataSource: dataSource.cloneWithRows([])
    };
  },
  componentDidMount: function () {
    // this.fetchImages(this.props.food.id);
    this.fetchImages(this.props.food.id);
    this.fetchReviews(this.props.food.id);
  },
  fetchImages: function (query) {
    console.log('API Query:', API_URL + 'images/foods/'+ query);
    fetch(API_URL + 'images/foods/'+ query)
      .then((res) => res.json())
      .catch((err) => console.error("Fetching query failed: " + err))
      .then((responseData) => {
        console.log('Fetched images', responseData);
        this.setState({
          images: responseData
        });
      })
      .done();
  },
  fetchReviews: function (query) {
    console.log('API Query:', API_URL + 'reviews/foods/'+ query);
    fetch(API_URL + 'reviews/foods/'+ query)
      .then((res) => res.json())
      .catch((err) => console.error("Fetching query failed: " + err))
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
  pressHeartButton: function () {
    console.log('Heart button pressed');
  },
  selectedStar: function (rating) {
    console.log('Rated ' + rating + ' stars!');
  },
  renderRow: function (rowData) {
    return (
      <View style={styles.reviewContainer}>
        <View style={styles.reviewTopContainer}>
          <Text style={styles.username}>Name</Text>
          <View style={styles.reviewStarContainer}>
            <StarRating maxStars={5} rating={parseFloat(rowData.foodRating)} disabled={true} styles={styles.reviewStarRating} starSize={15}/>
          </View>
        </View>
        <View style={styles.reviewTextContainer}>
          <Text style={styles.reviewText}>{rowData.text}</Text>
        </View>
      </View>
    );
  },
  render: function () {
    var images = [];
    for (var i = 0; i < this.state.images.length; i++) {
      images.push(
        <View key={i + 1} style={styles.slide}>
          <Image
            source={{uri: this.state.images[i].image}}
            resizeMode={Image.resizeMode.cover}
            style={styles.image}
          >
            <View style={styles.heartContainer}>
              <Button
                activeOpacity={0.20}
                onPress={this.pressHeartButton}
                style={styles.heartButton}
              >
                <Icon
                  name='fontawesome|heart-o'
                  size={40}
                  color='red'
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
    }

    var title = Platform.OS === 'ios' ?
     <View style={styles.titleContainer}>
       <Text style={styles.name}>
         {this.props.food.name}
       </Text>
       <Text style={styles.restaurant}>
         @{this.props.food.restaurant.name}
       </Text>
     </View>
     :
     <View style={styles.titleContainer}>
       <Text style={styles.restaurant}>
         @{this.props.food.restaurant.name}
       </Text>
     </View>


    return (
      <View
        automaticallyAdjustContentInsets={false} 
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
        >
          <View style={styles.topRowContainer}>
            {title}
            <View style={styles.likeContainer}>
              <Button
                activeOpacity={0.20}
                onPress={this.pressLikeButton}
                style={styles.likeButton}
              >
                <Icon
                  name='fontawesome|thumbs-o-up'
                  size={40}
                  color='black'
                  style={styles.like}
                />
              </Button>
              <Text style={styles.likeCounts}>
                254
              </Text>
            </View>
          </View>
          <Carousel autoplay={false} style={styles.carousel}>
            {images}
          </Carousel>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              <StarRating maxStars={5} rating={parseFloat(this.props.food.avgRating)} disabled={true} styles={styles.starRating} starSize={35}/>
            </View>
            <View>
              <Text style={styles.ratingCount}>
                {this.props.food.numRating} ratings
              </Text>
            </View>
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
  scrollView: {
    backgroundColor: 'gray',
    height: 300,
  },
  topRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleContainer: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 30,
    textAlign: 'left',
    marginTop: 10,
    marginLeft: 15,
  },
  restaurant: {
    fontSize: 20,
    textAlign: 'left',
    color: '#333333',
    marginTop: 5,
    marginLeft: 15,
  },
  likeContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginRight: 15,
  },
  likeButton: {
    height:40,
    width:40,
  },
  like: {
    height:40,
    width:40,
  },
  likeCounts: {
    fontSize: 35,
    textAlign: 'right',
    marginLeft: 5,
  },
  carousel: {
    flex: 1,
    marginTop: 10,
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
    marginTop: 15,
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
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  starsContainer: {
    marginLeft: 15,
  },
  starRating: {

  },
  ratingCount: {
    fontSize: 30,
    textAlign: 'right',
    marginRight: 15,
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

});

module.exports = FoodDetailView;