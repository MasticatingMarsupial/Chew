'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TouchableHighlight,
} = React;

var Dimensions = require('Dimensions');
var {Icon,} = require('react-native-icons');
var Carousel = require('react-native-looped-carousel');
var Button = require('react-native-button');

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
  pressLikeButton: function () {
    console.log('Like button pressed');
  },
  pressHeartButton: function () {
    console.log('Heart button pressed');
  },
  render: function () {
    var images = [];
    for (var i = 0; i < this.props.food.image.length; i++) {
      images.push(
        <View style={styles.slide}>
          <Image
            source={{uri: this.props.food.image[i]}}
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
                123
              </Text>
            </View>
          </Image>
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
});

module.exports = FoodDetailView;