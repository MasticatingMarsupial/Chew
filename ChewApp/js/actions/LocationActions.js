var AppDispatcher = require('../dispatchers/AppDispatcher');
var LocationConstants = require('../constants/LocationConstants');

var LocationActions = {

  updateLocation: function (platform) {
    AppDispatcher.dispatch({
      actionType: LocationConstants.LOCATION_UPDATE,
      platform: platform
    });
  },

  deleteLocation: function () {
    AppDispatcher.dispatch({
      actionType: LocationConstants.LOCATION_DELETE
    });
  }
};

module.exports = LocationActions;
