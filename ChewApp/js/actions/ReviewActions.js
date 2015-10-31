'use strict';

var AppDispatcher = require('../dispatchers/AppDispatcher');
var ReviewConstants = require('../constants/ReviewConstants');

var ReviewActions = {

  create: function(rating, reviewText) {
    AppDispatcher.dispatch({
      actionType: ReviewConstants.REVIEW_CREATE,
      rating: rating,
      reviewText: reviewText
    });
  }

};

module.exports = ReviewActions;
