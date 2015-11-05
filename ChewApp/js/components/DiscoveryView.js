'use strict';

var React = require('react-native');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity
} = React;

var API_URL = 'http://chewmast.herokuapp.com/api/';
var DiscoveryTabBar = require('./DiscoveryTabBar');
var FoodDetailView = require('./FoodDetailView');
var StarRating = require('./StarRating');
var mockImage = {
  image: 'http://40.media.tumblr.com/155e0538162f818cf12cd876683c3136/tumblr_inline_nmuyiqTnC51sxzdh5_500.jpg'
};
var mockData = [];
for (var i = 0; i < 10; i++) {
  mockData.push(mockImage);
}

var AndroidGeolocation = require('./AndroidGeolocation');
var Loading = require('./Loading');

var DiscoveryView = React.createClass({
  getInitialState: function () {
    return {
      recs: {},
      position: {}
    };
  },

  componentWillMount: function () {
    if (Platform.OS === 'ios'){
      this.fetchRecs();
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({position: position}, this.fetchRecs);
        },
        (error) => console.error(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    } else {
      AndroidGeolocation.getCurrentLocation((position) => this.setState({position: position}, this.fetchRecs));
    }
  },
  fetchRecs: function () {
    var uri = API_URL + 'foods/recommendations/';
    if (this.state.position.coords) {
      uri += '?coords=' + encodeURIComponent(this.state.position.coords.latitude) + ',' + encodeURIComponent(this.state.position.coords.longitude);
    }
    fetch(uri)
      .then((res) => res.json())
      .catch((err) => console.error('Discovery GET failed: ' + err))
      .then((data) => {
        this.setState({
          recs: data
        });
      })
      .done();
  },

  onFoodPress: function (food) {
    if (Platform.OS === 'ios'){
      this.props.navigator.push({
        title: food.name,
        component: FoodDetailView,
        passProps: {food},
      });
    } else {
      this.props.navigator.push({
        title: food.name,
        name: 'food',
        food: food,
      });
    }
  },

  render: function () {
    var pages = [];
    var page;
    for (var key in this.state.recs) {
      page = <DiscoveryPage
                onFoodPress={this.onFoodPress}
                tabLabel={key.toUpperCase().replace('_', ' ')}
                foods={this.state.recs[key]}
              />;
      if (key === 'trending') {
        pages.unshift(page);
      } else {
        pages.push(page);
      }
    }
    if (this.state.recs.trending === undefined) {
      return (<Loading/>);
    } else {
      return (<ScrollableTabView
        locked={false}
        renderTabBar={() => <DiscoveryTabBar />}
        edgeHitWidth={100}
        style={styles.container}
      >
        {pages}
      </ScrollableTabView>);
    }
  }
});

var DiscoveryPage = React.createClass({
  getInitialState: function () {
    return {
      foods: []
    };
  },

  render: function () {
    var thumbs = this.props.foods.map((food, ind) => {
        return (
          <ThumbView food={food} onFoodPress={this.props.onFoodPress} />
        );
      });
    return (
      <ScrollView
        style={styles.scrollGroup}
        horizontal={false}
        centerContent={true}
        keyboardDismissMode={'on-drag'}
        contentOffset={{x:0,y:0}}
        contentInset={{top:0,left:0,bottom:0,right:0}}
      >
        <View style={styles.container}>
          {thumbs}
        </View>
      </ScrollView>
    );
  }
});

var ThumbView = React.createClass({
  render: function () {
    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity activeOpacity={0.6} onPress={this._handlePress}>
          <Image
            source={{uri: this.props.food.preview_image.image}}
            style={styles.thumbImage}
          />
          <View
            style={[styles.textContainer, Platform.OS === 'ios' && styles.textContainerOS]}
            marginBottom={-80}
          >
            <Text style={styles.title}>{this.props.food.name}</Text>
            <View style={styles.reviewStarContainer}>
              <StarRating maxStars={5}
                rating={parseFloat(this.props.food.avgRating)}
                disabled={true}
                starColor={'white'}
                styles={styles.reviewStarRating}
                starSize={11}/>
            </View>
            <Text style={styles.text}>{this.props.food.distance} Miles</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  },

  _handlePress: function (evt) {
    this.props.onFoodPress(this.props.food);
  }
});

var styles = StyleSheet.create({
  scrollGroup: {
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: windowSize.width / 2,
    height: windowSize.width / 2,
    backgroundColor: 'black',
  },
  thumbImage: {
    width: windowSize.width / 2,
    height: windowSize.width / 2,
    backgroundColor: 'black',
    opacity: 0.65
  },
  textContainer: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    opacity: 1,
    top: -150,
  },
  textContainerOS: {
    marginBottom: -80
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'center',
    color: 'white',
    opacity: 1,
    alignSelf: 'center',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center',
  },
  reviewStarContainer: {
    marginTop: 5,
    marginLeft: 10,
    alignSelf: 'center',
  },
  reviewStarRating: {
  },
});

module.exports = DiscoveryView;
