'use strict';

var AppDispatcher = require('../dispatchers/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ReviewConstants = require('../constants/ReviewConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _reviews = {};

function create(rating, reviewText) {
  console.log('got here!');
}

var ReviewStore = assign({}, EventEmitter.prototype, {
  // When given this object, you should only be reading from it, not making writes to it
  getReviews: function () {
    return _reviews;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var rating;
  var reviewText;
  
  switch (action.actionType) {
    // case ReviewConstants.REVIEW_CREATE:
    //   rating = action.rating;
    //   reviewText = action.reviewText.trim();
    //   create(rating, reviewText);
    //   ReviewStore.emitChange();
    //   break;
  }
});

module.exports = ReviewStore;