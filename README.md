# Chew App

> A cross platform mobile application that helps you find, share, and review the best menu items around you

## Team

  - __Product Owner__: Alex Manusu
  - __Scrum Master__: Derrick Chie
  - __Development Team Members__: Gary Ye, Michael Junio, Alex Manusu, Derrick Chie

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Running Locally iOS](#running-locally-ios)
    1. [Running Locally Android](#running-locally-android)
    1. [Roadmap](#roadmap)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Are you craving for a certain dish? Search for that dish on Chew and you'll get a list of dishes matching your cravings by rating! After the meal, leave a rating and review to let others know what you thought!

## Requirements

- Django
- PostgreSQL
- Xcode

## Development

### Installing Dependencies

From within the ChewApp directory:

```sh
sudo npm install -g bower
npm install
```

From within the server directory:

```sh
pip3 install -r requirements.txt
```

### Running Locally iOS

1. Download Xcode from the Mac App Store
1. Navigate to the `ChewApp.xcodeproj` file in the `Chew/ChewApp/ios` folder
1. Open it in Xcode and run the project

### Running in Development Mode on an Android Device
1. Follow the setup details listed [in the react native documentation](https://facebook.github.io/react-native/docs/android-setup.html)
1. Connect the device that you want to run the app on. Ensure that the device has USB debugging enabled
1. Navigate to the `Chew/ChewApp` folder
1. Run the following command `react-native run-android`
1. If the device is reporting that it cannot connect to the server, type this command `adb reverse tcp:8081 tcp:8081` and reload JS in the application

### Roadmap

View the project roadmap [here](https://github.com/MasticatingMarsupial/Chew/issues)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
