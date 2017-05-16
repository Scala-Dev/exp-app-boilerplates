'use strict';

function initMap (coords) {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: exp.app.config.mapZoom || 13,
      center: coords,
      disableDefaultUI: exp.app.config.hideControls,
      mapTypeId: exp.app.config.mapStyle || 'roadmap', // 'hybrid' = satellite, 'roadmap' = default
    });

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    if ( exp.app.config.mapTitle !== undefined && exp.app.config.mapTitle !== '' ) {
      var defaultTextColor = ( exp.app.config.mapStyle === 'hybrid' ) ? '#ccbce8' : '#7e57c2';
      var color = exp.app.config.titleColor || defaultTextColor;
      var textBg = ( exp.app.config.mapStyle === 'hybrid' ) ? 'rgba( 0, 0, 0, 0.5 )' : 'rgba( 255, 255, 255, 0.5 )';
      document.getElementById('title').innerHTML = exp.app.config.mapTitle;
      document.getElementById('title').style.color = color;
      document.getElementById('title').style.background = textBg;
    }
}

function getHTML5Geocoords () {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  })
  .then( function (res) {
    return { lat: res.coords.latitude, lng: res.coords.longitude };
  });
}

function getLatLngCoords () {
  if ( exp.app.config.deviceLocation === 'geolocation' ) {
    return getHTML5Geocoords();
  } else if ( exp.app.config.deviceLocation === 'exp' ) {
    return exp.getCurrentLocation()
    .then( function (loc) {
      // if we have both longitude and latitude metadata on the Location, we load from those
      if ( _.isNumber( _.get( loc, 'document.metadata.geo.longitude' ) ) && _.isNumber( _.get( loc, 'document.metadata.geo.latitude' ) ) ) {
        return Promise.resolve({ lat: loc.document.metadata.geo.latitude, lng: loc.document.metadata.geo.longitude });
      // fall back to using Google Geocoder service to infer location from limited subset of data
      } else if ( !_.isEmpty( _.get( loc, 'document.metadata.address' ) ) ) {
        var street = _.get( loc, 'document.metadata.address.street' );
        var city = _.get( loc, 'document.metadata.address.city' );
        var state = _.get( loc, 'document.metadata.address.state' );
        var zip = _.get( loc, 'document.metadata.address.zip' );
        var country = _.get( loc, 'document.metadata.address.country' );
        var address = street + ', ' + city + ', ' + state + ' ' + zip + ' ' +  country;
        var geocoder = new google.maps.Geocoder();
        return new Promise( function (resolve, reject) {
          geocoder.geocode({ 'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              resolve( results[0].geometry.location );
            } else {
              resolve( getHTML5Geocoords );
            }
          });
        });
      }
    });
  }
}

function load () {

  if ( _.isEmpty(exp.app.config.googleMapsApiKey) ) {
    return exp.app.abort('Google Maps API Key in app configuration is missing and required');
  }

  // dynamically inject the Google Maps script, which needs to be loaded with an auth key
  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + exp.app.config.googleMapsApiKey;
  document.head.appendChild(script);

  // since `window.load` has already fired and we're dynamically pushing a new script
  // we listen to `document.load` events for the availability of the google maps external script
  document.addEventListener( 'load', function(e) {
    const src = _.get( e, 'target.src');
    const gMapScriptUrl = 'https://maps.googleapis.com/maps/api/js?key=' + exp.app.config.googleMapsApiKey;

    // we only fire this event once, for the load of the one script that places
    // `google` method on the window, since we need this for app functionality
    if ( typeof src === 'string' && src === gMapScriptUrl ) {

      // kick off the configurable polling interval
      setInterval( function () {
        getLatLngCoords().then( function (coords) {
          initMap(coords);
        });
      }, exp.app.config.pollInterval * 1000);

      // get the map for the first iteration.
      getLatLngCoords().then( function (coords) {
        initMap(coords);
      });

    }
  }, true);

}

function play () {
  // hook app startup
}


function unload () {
  // clean up any mess we made
}
