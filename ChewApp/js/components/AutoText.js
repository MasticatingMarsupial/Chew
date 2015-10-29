'use strict';

import React, { AppRegistry, StyleSheet, Text, View, Component, NativeModules } from 'react-native';

const UIManager = NativeModules.UIManager;

class AutoText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 0.5,
    }
  }

  tryNewSize() {
    requestAnimationFrame(() => {
      UIManager.measureLayoutRelativeToParent(
        React.findNodeHandle(this._text),
        () => { React.AlertIOS.alert('ERROR!') },
        (x, y, w, h) => { this.isSizeOk(w, h) },
      );
    });
  }

  isSizeOk(w, h) {
    if (h > this.props.height) {
      if (this.state.size == 0.5) {
        this.setState({complete: true});
      } else {
        this.setState({size: this.state.size -= 0.5, complete: true});
        requestAnimationFrame(() => {
          this.tryNewSize();
        });
      }
    } else {
      if (!this.state.complete) {
        this.setState({size: this.state.size += 0.5});
        requestAnimationFrame(() => {
          this.tryNewSize();
        });
      }
    }
  }

  _onLayout() {
    // console.log(arguments);
  }

  componentDidMount() {
    // Convert this to async/await function so I can process synchronously in loop
    this.tryNewSize();
  }

  render() {
    return (
      <Text ref={component => this._text = component}
            onLayout={this._onLayout}
            style={{backgroundColor: 'transparent', fontSize: this.state.size, color: this.state.complete ? 'black': 'transparent'}}>
        {this.props.children}
      </Text>
    )
  }

};

module.exports = AutoText;
