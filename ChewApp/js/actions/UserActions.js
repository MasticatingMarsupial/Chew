var AppDispatcher = require('../dispatchers/AppDispatcher');
var FoodConstants = require('../constants/FoodConstants');

var UserActions = {

  populate: function (account) {
    AppDispatcher.dispatch({
      actionType: FoodConstants.USER_SIGNIN,
      account: account
    });
  },

  updateAccount: function(username, updates) {
    AppDispatcher.dispatch({
      actionType: FoodConstants.USER_UPDATE,
      username: username,
      updates: updates
    })
  },

  signout: function() {
    AppDispatcher.dispatch({
      actionType: FoodConstants.USER_SIGNOUT,
    });
  }
};

module.exports = UserActions;
