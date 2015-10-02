var settings = require('app-settings');
var ajax = require('ajax');

var API_BASE_URL = "https://api.lifx.com/v1";
var API_KEY = settings.getOption('API_KEY');

var lifx = {
  
  fetchLights: ajax({
      url: API_BASE_URL + '/lights/all', 
      type: 'json',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + API_KEY }
    },
      function(data) {
        // Populate the list of lights
        var locations = {};
        var groups = {};
        var lights = {};
        
        data.forEach(function (light) {
          if (!(light.location.id in locations)) {
            locations[light.location.id] = light.location.name;
          }  
          if (!(light.group.id in groups)) {
            groups[light.group.id] = light.group.name;
          }
          if (!(light.name in lights)) {
            light[light.id] = light.label;
          }
        });
        
        // Save the list of lights in options
        settings.setSerOption('locations', locations);
        settings.setSerOption('groups', groups);
        settings.setSerOption('lights', lights);
        
        return true;
      },
      function(error, status) {
        
      }
  ),
  
};

this.exports = lifx;