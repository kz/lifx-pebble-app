var UI = require('ui');
var views = require('app-views');
var settings = require('app-settings');
var Settings = require('settings');
var lifx = require('app-lifx');

// Show initial screen
var main = new UI.Card({
  title: 'Pebble LIFX',
  subtitle: 'Loading...'
});
main.show();

// Set configurable
Settings.config(
  { url: 'http://www.example.com' },
  function(e) {
  },
  function(e) {
    console.log('closed configurable');
  }
);

// Listen for configuration
Pebble.addEventListener('showConfiguration', function(e) {
  // Show config page
  Pebble.openURL('https://my-website.com/config-page.html');
});

// Check whether the LIFX HTTP API key is set
Pebble.addEventListener("ready", function() {
  if (settings.optionExists('API_KEY') === false) {
    showSetup();
  } else {
    showHomeMenu();
  }
  
  main.hide();
});

function showSetup() {
  var setupCard = views.createSetupCard();
  setupCard.show();
}

function showHomeMenu() {

  // Determine whether lights have been cached or not
  if (settings.lightsCached() === false) {
    var fetchingCard = views.createFetchingCard();
    fetchingCard.show();
  } else {
    var locations = settings.getSerOption('locations');
    var groups = settings.getSerOption('groups');
    var lights = settings.setSerOption('lights');

    var homeMenu = views.createHomeMenu(locations, groups, lights);
    homeMenu.show();
  }
  
  // Fetch current list of lights
  lifx.fetchLights(function(data) {
    var locations = settings.getSerOption('locations');
    var groups = settings.getSerOption('groups');
    var lights = settings.setSerOption('lights');

    var homeMenu = views.createHomeMenu(locations, groups, lights);
    homeMenu.show();
  });
  
}

