(function() {
  angular.module('weather-app', [
    'ngAnimate',
    'ngMaterial',
    'ngAria'
  ])
  .config(function($mdThemingProvider, $mdIconProvider, $animateProvider) {
    // setup icons
    $mdIconProvider
      .icon('humidity', 'assets/icons/conditions/humidity.svg')
      .icon('windDirection', 'assets/icons/conditions/windDirection.svg')
      .icon('windSpeed', 'assets/icons/conditions/windSpeed.svg');
  })
  .run(function(Exp) {
    document.getElementsByTagName('body')[0].style.backgroundColor = Exp.app.config.primaryColor;
    document.getElementsByTagName('body')[0].style.color = Exp.app.config.textColor;

    // fills svgs with text color
    var iconStyle = document.createElement('style');
    iconStyle.type = 'text/css';
    iconStyle.innerHTML = 'md-icon * { fill: ' + Exp.app.config.textColor + ' }';
    document.getElementsByTagName('head')[0].appendChild(iconStyle);

    // sets background of certain divs with text color
    var backgroundDivStyle = document.createElement('style');
    backgroundDivStyle.type = 'text/css';
    backgroundDivStyle.innerHTML = '.config-text-color { background-color: ' + Exp.app.config.textColor + ' }';
    document.getElementsByTagName('head')[0].appendChild(backgroundDivStyle);
  });

})();
