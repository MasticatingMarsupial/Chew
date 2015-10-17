'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
} = React;

var Dimensions = require('Dimensions');
var {Icon,} = require('react-native-icons');
var Carousel = require('react-native-looped-carousel');

var {width, height} = Dimensions.get('window');

var FoodDetailView = React.createClass({
  getInitialState: function () {
    console.log("WOOH, this is where we are", this)
    return {

    };
  },
  componentDidMount: function () {
    // Get home page stuff from DB
  },
  searchString: function (string) {
    // Executes query to DB for possible foods by string
    // Refreshes the list of foods by changing the list of foods
  },
  render: function () {
    var images = [];
    for (var i = 0; i < this.props.food.image.length; i++) {
      images.push(
        <View style={styles.slide}>
          <Image
            source={{uri: this.props.food.image[i]}}
            style={styles.image} />
        </View>
      );
    }
    return (
      <View
        automaticallyAdjustContentInsets={false} 
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
        >
          <View style={styles.topRowContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.name}>
                {this.props.food.name}
              </Text>
              <Text style={styles.restaurant}>
                @{this.props.food.restaurant}
              </Text>
            </View>
            <View style={styles.likeContainer}>
              <Icon
                name='foundation|heart'
                size={40}
                color='red'
                style={styles.heart}
              />
              <Text style={styles.likeCounts}>
                254
              </Text>
            </View>
          </View>
          <Carousel autoplay={false} style={styles.carousel}>
            {images}
          </Carousel>
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
  heart: {
    height:40,
    width:40,
  },
  likeCounts: {
    fontSize: 35,
    textAlign: 'right'
  },
  carousel: {
    flex: 1,
    marginTop: 10,
    width:width,
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
});

module.exports = FoodDetailView;