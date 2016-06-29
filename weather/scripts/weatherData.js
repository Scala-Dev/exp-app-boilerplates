/* globals exp, _, console */
'use strict';

var zeroPad = function (num) {
  var returnValue = '';

  if (num.toString().length === 1) {
    returnValue = '0' + num.toString();
  } else {
    returnValue = num.toString();
  }

  return returnValue;
};

var setSVGColor = function (id, color) {

  var svgObject = document.getElementById(id);
  //it's important to add an load event listener to the object, as it will load the svg doc asynchronously
  svgObject.addEventListener('load', function () {
    var document = svgObject.contentDocument;

    var pathList = document.getElementsByTagName('path');
    var circleList = document.getElementsByTagName('circle');
    var rectList = document.getElementsByTagName('rect');
    var polygonList = document.getElementsByTagName('polygon');

    _.forEach(pathList, function (path) {
      path.style.fill = color;
    });

    _.forEach(circleList, function (circle) {
      circle.style.fill = color;
    });

    _.forEach(rectList, function (rect) {
      rect.style.fill = color;
    });

    _.forEach(polygonList, function (polygon) {
      polygon.style.fill = color;
    });

  }, false);

};


var getData = function (feedUuid, tempUnit, measurementUnit, dateFormat, textColor) {

  var weekday = new Array(7);
  weekday[0]=  "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  return exp.getFeed(feedUuid).then(function (feed) {

    if (feed) {

      return feed.getData().then(function (data) {
          // set the location name
          document.getElementById('locationText').textContent = _.get(data, 'details.location', '').toUpperCase();

          if (data.items) {
            // set the current temperature
            if (tempUnit === 'c') {
              document.getElementById('currentTempText').textContent = _.get(data, 'items[0].metadata.current.c', '') + '°C';
            } else if (tempUnit === 'f') {
              document.getElementById('currentTempText').textContent = _.get(data, 'items[0].metadata.current.f', '') + '°F';
            }

            // set the current icon and color
            document.getElementById('currentWeatherIcon').setAttribute('data', 'assets/icons/' + _.get(data, 'items[0].raw.icon', '') + '.svg');
            setSVGColor('currentWeatherIcon', textColor);

            // set the current humidity
            document.getElementById('humidityText').textContent = _.get(data, 'items[0].raw.relative_humidity', '');
            // set the current wind speed
            if (measurementUnit === 'metric') {
              document.getElementById('windSpeedText').textContent = _.get(data, 'items[0].raw.wind_kph', '') + 'km/h';
            } else if (measurementUnit === 'imperial') {
              document.getElementById('windSpeedText').textContent = _.get(data, 'items[0].raw.wind_mph', '') + 'mph';
            }
            // set current wind direction
            document.getElementById('windDirectionText').textContent = _.get(data, 'items[0].raw.wind_dir', '');

            // set forecast icons
            var tempDate;
            if (dateFormat === 'dd-MM-yyyy') {
              tempDate = new Date(_.get(data, 'items[1].date', ''));
              document.getElementById('date1').textContent = zeroPad(tempDate.getDate()) + '-' + zeroPad(tempDate.getMonth() + 1) + '-' + tempDate.getFullYear();
              tempDate = new Date(_.get(data, 'items[2].date', ''));
              document.getElementById('date2').textContent = zeroPad(tempDate.getDate()) + '-' + zeroPad(tempDate.getMonth() + 1) + '-' + tempDate.getFullYear();
              tempDate = new Date(_.get(data, 'items[3].date', ''));
              document.getElementById('date3').textContent = zeroPad(tempDate.getDate()) + '-' + zeroPad(tempDate.getMonth() + 1) + '-' + tempDate.getFullYear();
              tempDate = new Date(_.get(data, 'items[4].date', ''));
              document.getElementById('date4').textContent = zeroPad(tempDate.getDate()) + '-' + zeroPad(tempDate.getMonth() + 1) + '-' + tempDate.getFullYear();
            } else if (dateFormat === 'MM/dd/yyyy') {
              tempDate = new Date(_.get(data, 'items[1].date', ''));
              document.getElementById('date1').textContent = zeroPad(tempDate.getMonth() + 1) + '/' + zeroPad(tempDate.getDate()) + '/' + tempDate.getFullYear();
              tempDate = new Date(_.get(data, 'items[2].date', ''));
              document.getElementById('date2').textContent = zeroPad(tempDate.getMonth() + 1) + '/' + zeroPad(tempDate.getDate()) + '/' + tempDate.getFullYear();
              tempDate = new Date(_.get(data, 'items[3].date', ''));
              document.getElementById('date3').textContent = zeroPad(tempDate.getMonth() + 1) + '/' + zeroPad(tempDate.getDate()) + '/' + tempDate.getFullYear();
              tempDate = new Date(_.get(data, 'items[4].date', ''));
              document.getElementById('date4').textContent = zeroPad(tempDate.getMonth() + 1) + '/' + zeroPad(tempDate.getDate()) + '/' + tempDate.getFullYear();
            } else if (dateFormat === 'EEEE') {
              tempDate = new Date(_.get(data, 'items[1].date', ''));
              document.getElementById('date1').textContent = weekday[tempDate.getDay()];
              tempDate = new Date(_.get(data, 'items[2].date', ''));
              document.getElementById('date2').textContent = weekday[tempDate.getDay()];
              tempDate = new Date(_.get(data, 'items[3].date', ''));
              document.getElementById('date3').textContent = weekday[tempDate.getDay()];
              tempDate = new Date(_.get(data, 'items[4].date', ''));
              document.getElementById('date4').textContent = weekday[tempDate.getDay()];
            }

            // set forecast images
            document.getElementById('iconForecastDay1').setAttribute('data', 'assets/icons/' + _.get(data, 'items[1].raw.icon', '') + '.svg');
            document.getElementById('iconForecastDay2').setAttribute('data', 'assets/icons/' + _.get(data, 'items[2].raw.icon', '') + '.svg');
            document.getElementById('iconForecastDay3').setAttribute('data', 'assets/icons/' + _.get(data, 'items[3].raw.icon', '') + '.svg');
            document.getElementById('iconForecastDay4').setAttribute('data', 'assets/icons/' + _.get(data, 'items[4].raw.icon', '') + '.svg');
            setSVGColor('iconForecastDay1', textColor);
            setSVGColor('iconForecastDay2', textColor);
            setSVGColor('iconForecastDay3', textColor);
            setSVGColor('iconForecastDay4', textColor);

            // set forecast temp
            if (measurementUnit === 'metric') {
              document.getElementById('temp1').textContent = _.get(data, 'items[1].metadata.low.c', '') + '°C/' + _.get(data, 'items[1].metadata.high.c', '') + '°C';
              document.getElementById('temp2').textContent = _.get(data, 'items[2].metadata.low.c', '') + '°C/' + _.get(data, 'items[2].metadata.high.c', '') + '°C';
              document.getElementById('temp3').textContent = _.get(data, 'items[3].metadata.low.c', '') + '°C/' + _.get(data, 'items[3].metadata.high.c', '') + '°C';
              document.getElementById('temp4').textContent = _.get(data, 'items[4].metadata.low.c', '') + '°C/' + _.get(data, 'items[4].metadata.high.c', '') + '°C';
            } else if (measurementUnit === 'imperial') {
              document.getElementById('temp1').textContent = _.get(data, 'items[1].metadata.low.f', '') + '°F/' + _.get(data, 'items[1].metadata.high.f', '') + '°F';
              document.getElementById('temp2').textContent = _.get(data, 'items[2].metadata.low.f', '') + '°F/' + _.get(data, 'items[2].metadata.high.f', '') + '°F';
              document.getElementById('temp3').textContent = _.get(data, 'items[3].metadata.low.f', '') + '°F/' + _.get(data, 'items[3].metadata.high.f', '') + '°F';
              document.getElementById('temp4').textContent = _.get(data, 'items[4].metadata.low.f', '') + '°F/' + _.get(data, 'items[4].metadata.high.f', '') + '°F';
            }
          }

        // make page content appear
        document.getElementById('weatherWrapper').style.display = 'block';
      });
    }
  });
};

function load() {
  var config = exp.app.config;

  document.getElementById('weatherWrapper').style.display = 'none';

  // get feed UUID
  var feedUuid = _.get(config, 'feedConfiguration.uuid', '');

  // get background Color
  var backgroundColor = _.get(config, 'primaryColor', '');

  // get text Color
  var textColor = _.get(config, 'textColor', '');

  // temperature Unit
  var tempUnit = _.get(config, 'temperature', '');

  // measurement Unit
  var measurementUnit = _.get(config, 'measurements', '');

  // date formats
  var dateFormat = _.get(config, 'dateFormat', '');

  // interval Value
  var refreshRateSeconds = parseInt(_.get(config, 'refreshRateSeconds', '600'), 10);

  // get title text
  var titleText = _.get(config, 'titleText', '');
  document.getElementById('titleText').textContent = titleText;

  // get logo
  var logoUuid = _.get(config, 'logo.uuid');
  if (logoUuid) {
    exp.getContent(logoUuid).then(function(content) {
      document.getElementById('logoContainer').src = content.getUrl();
    });
  }

  document.getElementById('weatherWrapper').style['background-color'] = backgroundColor;
  // set text color
  var body = document.getElementsByTagName('body');
  body[0].style.color = textColor;

  // set icon color
  setSVGColor('humidityIcon', textColor);
  setSVGColor('windSpeedIcon', textColor);
  setSVGColor('windDirectionIcon', textColor);

  // call it the first time
  getData(feedUuid, tempUnit, measurementUnit, dateFormat, textColor);

  // refresh data using interval
  setInterval(function () {
    getData(feedUuid, tempUnit, measurementUnit, dateFormat, textColor);
  }, refreshRateSeconds * 1000);

}
