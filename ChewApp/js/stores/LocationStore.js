'use strict';

var AppDispatcher = require('../dispatchers/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var LocationConstants = require('../constants/LocationConstants');
var assign = require('object-assign');
var AndroidGeolocation = require('../components/AndroidGeolocation');

var CHANGE_EVENT = 'locationChange';

var _currentPosition = {};

function updatePosition (platform) {
  console.log('updateposition for' + platform);
  if (platform === 'ios'){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        _currentPosition = position;
        LocationStore.emitChange();
      },
      (error) => console.error(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }
  if( platform === 'android' ) {
    AndroidGeolocation.getCurrentLocation((position) => {
      _currentPosition = position;
      LocationStore.emitChange();
    });
  }
}

function destroy () {
  _currentPosition = {}; 
}

var LocationStore = assign({}, EventEmitter.prototype, {

  getPosition: function () {
    return _currentPosition;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this. removeListener(CHANGE_EVENT, callback);
  }

});

AppDispatcher.register(function (action) {

  switch (action.actionType) {
    case LocationConstants.LOCATION_UPDATE:
      updatePosition(action.platform);
      break;

    case LocationConstants.LOCATION_DELETE:
      destroy();
      LocationStore.emitChange();
      break;
  }
})

module.exports = LocationStore;
