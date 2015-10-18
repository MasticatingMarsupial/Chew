'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  View
} = React

var {Icon,} = require('react-native-icons');
var Button = require('react-native-button');

var StarRating = React.createClass({
  propTypes: {
    maxStars: React.propTypes.number,
    rating: React.propTypes.number,
    style: View.propTypes.style,
  },
  getDefaultProps: function() {
    return {
      maxStars: 5
      rating: 0
    };
  },
  getInitialState: function () {
    // Round rating down to nearest .5 star
    return {
      maxStars = this.props.maxStars,
      rating = (Math.round(this.props.rating * 2) / 2);
    }
  },
  render: function () {
    starsLeft = this.state.rating;
    starButtons = [];
    for (var i = 0; i < this.state.maxStars; i++) {
      starButtons.push(
        <Button
          activeOpacity={0.20}
          onPress={this.pressStarButton}
          style={styles.starButton}
        >
          <Icon
            name='fontawesome|star-o'
            size={40}
            color='yellow'
            style={styles.star}
          />
        </Button>
      );
    }
    return (
      <View style={styles.starRatingContainer}>
        {starButtons}
      </View>
    );
  },
});

var styles = StyleSheet.create({
  starRatingContainer: {
    flexDirection: 'row'
  },
  starButton: {
    height:40,
    width:40,
  },
  star: {
    height:40,
    width:40,
  },
});

module.exports = StarRating;