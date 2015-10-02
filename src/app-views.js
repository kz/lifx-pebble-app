var UI = require('ui');

var views = {
  
  createSetupCard: function() {
    return new UI.Card({
      title: 'Setup Required',
      body: 'Visit the Pebble app to configure this app and enter your LIFX access token.',
    });
  },
  
  createFetchingCard: function() {
    return new UI.Card({
      title: 'Please Wait',
      body: 'Fetching lights...'
    }); 
  },
  
  createHomeMenu: function(locations, groups, lights) {    
    return new UI.Menu({
      sections: [
        {
          title: 'Locations',
          items: locations
        },
        {
          title: 'Groups',
          items: groups
        },
        {
          title: 'Lights',
          items: lights
        }
      ]
    });
  },
  
};

this.exports = views;