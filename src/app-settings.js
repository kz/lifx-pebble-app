var Settings = require('settings');

var settings = {
  
  optionExists: function(option) {
    if (typeof Settings.option(option) === 'undefined') {
      return false;
    } else {
      return true;
    }
  },
  
  getOption: function(key) {
    return Settings.option(key);
  },
  
  setOption: function(key, value) {
    return Settings.option(key, value);
  },
  
  setSerOption: function(key, value) {
    return Settings.option(key, JSON.stringify(value));
  },
  
  getSerOption: function(key) {
    return JSON.parse(Settings.option(key));
  },
  
  lightsCached: function() {
    if (settings.optionExists('locations') === false || 
        settings.optionExists('groups') === false || 
        settings.optionExists('lights') === false) {
      return false;
    } else {
      return true;
    }
  },
  
};

this.exports = settings;