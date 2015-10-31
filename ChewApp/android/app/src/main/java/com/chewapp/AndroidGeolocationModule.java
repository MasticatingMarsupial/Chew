package com.chewapp.androidgeo;

import android.location.Location;
import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationRequest;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

// private GoogleApiClient mGoogleApiClient;


// protected synchronized void buildApiClient() {
//   mGoogleApiClient = new GoogleApiClient.Build(this)
//     .addConnectionCallbacks(this)
//     .addOnConnectionFailedListener(this)
//     .addApi(LocationServices.API)
//     .build();
// }

public class AndroidGeolocationModule extends ReactContextBaseJavaModule 
  implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {
  protected static final String TAG = "GeoLocation";
  protected GoogleApiClient mGoogleApiClient;
  protected Location mLastLocation;
  protected LocationRequest mLocationRequest;
  protected String isConnected = "No";

  private final static int CONNECTION_FAILURE_RESOLUTION_REQUEST = 9000;

  @Override
    public String getName() {
      return "AndroidGeolocation";
  }

  public AndroidGeolocationModule(ReactApplicationContext reactContext) {
    super(reactContext);
    buildGoogleApiClient();
  }

  protected synchronized void buildGoogleApiClient() {
    mGoogleApiClient = new GoogleApiClient.Builder(getReactApplicationContext())
      .addConnectionCallbacks(this)
      .addOnConnectionFailedListener(this)
      .addApi(LocationServices.API)
      .build();
    mGoogleApiClient.connect();
  }

  @ReactMethod
  public void getCurrentLocation(Callback success) {
    WritableMap location = Arguments.createMap();
    WritableMap coords = Arguments.createMap();
    mLastLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient);
    coords.putDouble("latitude", mLastLocation.getLatitude());
    coords.putDouble("longitude", mLastLocation.getLongitude());
    location.putMap("coords", coords);
    success.invoke(location);
  }

  @Override
  public void onConnected(Bundle connectionHint) {
    // Provides a simple way of getting a device's location and is well suited for
    // applications that do not require a fine-grained location and that do not need location
    // updates. Gets the best and most recent location currently available, which may be null
    // in rare cases when a location is not available.
    mLastLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient);
    // if (mLastLocation == null) {
    //     LocationServices.FusedLocationApi.requestLocationUpdates(mGoogleApiClient, mLocationRequest, this);
    // }
    isConnected = "Yes";
  }


  @Override
  public void onConnectionFailed(ConnectionResult result) {
      // Refer to the javadoc for ConnectionResult to see what error codes might be returned in
      // onConnectionFailed.
      Log.i(TAG, "Connection failed: ConnectionResult.getErrorCode() = " + result.getErrorCode());
  }

  @Override
    public void onConnectionSuspended(int cause) {
      // The connection to Google Play services was lost for some reason. We call connect() to
      // attempt to re-establish the connection.
      Log.i(TAG, "Connection suspended");
      mGoogleApiClient.connect();
  }

  // @Override
  // public void onLocationChanged(Location location) {
  //   mLastLocation = location;
  // }
}
