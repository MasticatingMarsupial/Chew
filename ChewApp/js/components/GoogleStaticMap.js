var React = require('react-native');
var {
  Image,
  PixelRatio
  } = React;

var defaultMapScale = ()=> {
  var isRetina = PixelRatio.get() >= 2;
  return isRetina ? 2 : 1;
}

var values = (obj)=> {
  return Object.keys(obj).map(key => obj[key]);
}

var IMAGE_FORMATS = {
  //png8 or png (default) specifies the 8-bit PNG format.
  PNG: 'png',

  //png32 specifies the 32-bit PNG format.
  PNG32: 'png32',

  //gif specifies the GIF format.
  GIF: 'gif',

  //jpg specifies the JPEG compression format.
  JPG: 'jpg',

  //jpg-baseline specifies a non-progressive JPEG compression format.
  JPG_BASELINE: 'jpg-baseline'
};

var MAP_TYPES = {
  //roadmap (default) specifies a standard roadmap image, as is normally shown on the Google Maps website.
  ROADMAP: 'roadmap',

  //satellite specifies a satellite image.
  SATELLITE: 'satellite',

  //terrain specifies a physical relief map image, showing terrain and vegetation.
  TERRAIN: 'terrain',

  //hybrid specifies a hybrid of the satellite and roadmap image,
  // showing a transparent layer of major streets and place names on the satellite image.
  HYBRID: 'hybrid'
}

var IMAGE_FORMATS_VALUES = values(IMAGE_FORMATS);
var MAP_TYPES_VALUES = values(MAP_TYPES);

// the Image's source should be ignored
var {source, ...imagePropTypes} = Image.propTypes;


/**
 * A wrapper for Google's Static Maps
 *
 * @see https://developers.google.com/maps/documentation/staticmaps/intro#Overview
 *
 * @example: http://staticmapmaker.com/google/
 */
var GoogleStaticMap = React.createClass({
  /**
   * https://developers.google.com/maps/documentation/staticmaps/intro#api_key
   */
  apiKey: null,

  rootUrl: 'http://maps.googleapis.com/maps/api/staticmap',

  imageFormats: IMAGE_FORMATS,

  mapTypes: MAP_TYPES,

  propTypes: {
    ...imagePropTypes,

    latitude: React.PropTypes.string.isRequired,

    longitude: React.PropTypes.string.isRequired,

    size: React.PropTypes.shape({
      width: React.PropTypes.number.isRequired,
      height: React.PropTypes.number.isRequired
    }),

    /**
     * zoom (required if markers not present) defines the zoom level of the map,
     * which determines the magnification level of the map.
     *
     * @see https://developers.google.com/maps/documentation/staticmaps/intro#Zoomlevels
     */
    zoom: React.PropTypes.number.isRequired,

    /**
     * scale affects the number of pixels that are returned.
     * scale=2 returns twice as many pixels as scale=1 while retaining the same coverage area and level of detail
     * The default value is calculated from the screen PixelRatio.
     */
    scale: React.PropTypes.number,

    /**
     * @see https://developers.google.com/maps/documentation/staticmaps/intro#ImageFormats
     */
    format: React.PropTypes.oneOf(IMAGE_FORMATS_VALUES),

    /**
     * @see https://developers.google.com/maps/documentation/staticmaps/intro#MapTypes
     */
    mapType: React.PropTypes.oneOf(MAP_TYPES_VALUES),

    /**
     * Add a marker on the center
     */
    hasCenterMarker: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      scale: defaultMapScale(),
      format: IMAGE_FORMATS.PNG,
      mapType: MAP_TYPES.ROADMAP,
      hasCenterMarker: true
    };
  },
  staticMapUrl: function () {
    var {
      latitude,
      longitude,
      zoom,
      size,
      scale,
      format,
      mapType
      } = this.props;

    var {width, height} = size;
    var rootUrl = this.constructor.RootUrl;

    return `${this.rootUrl}?center=${latitude},${longitude}&zoom=${zoom}&scale=${scale}&size=${width}x${height}&maptype=${mapType}&format=${format}&${this.markerParams()}&${this.apiKeyParam()}`;
  },
  markerParams: function () {
    var {
      latitude,
      longitude,
      hasCenterMarker
      } = this.props;

    var markerParams = `markers=icon:dot%7Cshadow:true%7C${latitude},${longitude}`;
    return hasCenterMarker ? markerParams : '';
  }, 
  apiKeyParam: function () {
    var apiKey = this.constructor.ApiKey;
    return apiKey ? `key=${apiKey}` : '';
  },
  render: function () {
    console.log(this.staticMapUrl());
    return (
      <Image
        style={[this.props.style, this.props.size]}
        source={{uri: this.staticMapUrl()}}
      />
    );
  },
});

module.exports = GoogleStaticMap;
