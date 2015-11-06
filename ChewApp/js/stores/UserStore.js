'use strict';

var AppDispatcher = require('../dispatchers/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants');
var ReviewConstants = require('../constants/ReviewConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'userChange';
var API_URL = 'http://chewmast.herokuapp.com/api/';
// var API_URL = 'http://localhost:8000/api/';

var _currentAccount = {};
var _currentToken = {};

function populate (account, token) {
  _currentAccount  = account || _currentAccount;
  _currentToken = token || _currentToken;
}

function update (id, updates) {
  if (_currentAccount.id === id) {
    _currentAccount = assign({}, _currentAccount, updates);
    fetch(API_URL + 'users/' + _currentAccount.id + '/', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(_currentAccount)
    })
    .then((res) =>  res.json())
    .catch((err) => console.error('Update failed: ' + err))
    .done((resData) => populate(resData));
  }
}

function destroy () {
  _currentAccount = {};
  _currentToken = {};
}

var UserStore = assign({}, EventEmitter.prototype, {

  getAccount: function () {
    return _currentAccount;
  },

  getToken: function () {
    return _currentToken;
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

AppDispatcher.register(function(action) {
  var account, username, id;

  switch (action.actionType) {
    case UserConstants.USER_SIGNIN:
      account = action.account;
      if (account.id) {
        populate(account);
        UserStore.emitChange();
      }
      break;

    case UserConstants.USER_SIGNOUT:
      destroy();
      UserStore.emitChange();

      break;

    case UserConstants.USER_UPDATE:
      id = action.updates.id;
      username = action.username;
      if (username) {
        update(id, action.updates);
        UserStore.emitChange();
      }
      break;

    case UserConstants.PROFILE_UPDATE:
      id = action.account_id;
      if (id) {
        update(id, action.updates);
        UserStore.emitChange();
      }
      break;

    case ReviewConstants.REVIEW_CREATE:
      UserStore.emitChange();
      break;

    default:
  }
});

module.exports = UserStore;
