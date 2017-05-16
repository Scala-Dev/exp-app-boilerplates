(function() {
  function WeatherFeed(Exp) {
    this.Exp = Exp;
  }

  WeatherFeed.prototype.getFeed = function() {
    var uuid = _.get(this.Exp, 'app.config.feedConfiguration.uuid');
    
    if (!uuid) return Promise.reject(new Error('No Feed Provided'));

    return this.Exp.getFeed(uuid);
  };

  WeatherFeed.prototype.getLocation = function() {
    var that = this;

    function getExpLocation() {
      return that.Exp.getCurrentLocation().then((result) => {
        if (result === null) {
          throw new Error('No Location Provided');
        } else {
          return { type: 'exp', location: result };
        }
      });
    }

    function getNavigatorLocation() {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(function(result) {
          resolve({ type: 'navigator', location: result });
        }, reject);
      });
    }

    // try promise 1, then promise 2 if promise 1 fails. if promise 2 fails as well,
    // make sure to throw the err from promise 1 as that's the primary one we were trying to fulfill
    function tryPromisesInSequence(getPromise1, getPromise2) {
      return getPromise1().catch((err) => {
        return getPromise2().catch(() => {
          throw err
        });
      });
    }

    if (this.Exp.app.config.locationSource === 'geolocation') {
      return tryPromisesInSequence(
        getNavigatorLocation,
        getExpLocation
      );
    } else {
      return tryPromisesInSequence(
        getExpLocation,
        getNavigatorLocation
      );
    }
  };

  WeatherFeed.prototype.getSearchParams = function(location) {
    var searchValue;
    var type = location.type;
    location = location.location;

    if (type === 'navigator') {
      var latitude = _.get(location, 'coords.latitude');
      var longitude = _.get(location, 'coords.longitude');
      searchValue = latitude + ', ' + longitude;
    } else if (type === 'exp') {
      var latitude = _.get(location, 'document.metadata.geo.latitude');
      var longitude = _.get(location, 'document.metadata.geo.longitude');
      var city = _.get(location, 'document.metadata.address.city');
      var country = _.get(location, 'document.metadata.address.country');
      var state = _.get(location, 'document.metadata.address.state');
      var zip = _.get(location, 'document.metadata.address.zip');

      if (typeof latitude === 'number' && typeof longitude === 'number') {
        searchValue = latitude + ', ' + longitude;
      } else if (city && (state || country)) {
        searchValue = city + ', ' + state + ' ' + country;
      } else if (zip) {
        searchValue = zip;
      } else {
        throw new Error('Location Address Not Recognized');
      }
    } else {
      throw new Error('Unknown Location Type: ', type);
    }

    return { searchValue: searchValue };
  };

  WeatherFeed.prototype.getData = function(feed, location) {
    var params = this.getSearchParams(location);

    return feed.getData(params);
  };


  angular.module('weather-app')
    .service('WeatherFeed', WeatherFeed);
})();

