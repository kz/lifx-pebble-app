var UI = require('ui');
var Settings = require('settings');
var ajax = require('ajax');

var CONFIGURATION_URL = "http://kz.github.io/lifx-pebble-config/index.html";
var API_BASE_URL = "https://api.lifx.com/v1";
var API_KEY;

var groups = [];
var scenes = [];
var lights = [];

/*
 * Initial Loading Screen
 */
var loadingCard = new UI.Card({
    title: 'Please Wait',
    subtitle: 'Loading... (Internet connection required.)'
});
loadingCard.show();

/*
 * Configuration
 */

// Listen for configuration start
Settings.config(
        {
            url: CONFIGURATION_URL,
            autoSave: true
        },
        function (e) {
        },
        function (e) {
            checkConfiguration();
        }
);

// Listen for configuration complete
Settings.config(
        {
            url: CONFIGURATION_URL,
            autoSave: true
        },
        function (e) {
            checkConfiguration();
        }
);

/*
 * Views
 */

var setupCard = new UI.Card({
    title: 'Setup Required',
    body: 'Open this app\'s settings page in the Pebble app and enter your LIFX cloud access token.'
});

var errorCard = new UI.Card({
    title: 'Error',
    body: 'An unknown error has occurred. Please try again.'
});

var mainMenu = new UI.Menu({
    sections: [
        {
            title: 'Quick Actions',
            items: [
                { title: 'Toggle all lights' }
            ]
        },
        {
            title: 'Scenes',
            items: []
        },
        {
            title: 'Groups',
            items: []
        },
        {
            title: 'Lights',
            items: []
        }
    ]
});

/*
 * App Functions
 */

function checkConfiguration() {
    if (typeof Settings.option('apiKey') === 'undefined') {
        setupCard.show();
        mainMenu.hide();
        return false;
    } else {
        API_KEY = Settings.option('apiKey');
        setupCard.hide();
        return true;
    }
}

function handleError(statusCode) {
    if (statusCode === 401) {
        Settings.option('apiKey', null);
        checkConfiguration();
    } else {
        errorCard.show();
    }
}

/*
 * Internet Enabled Functions
 */
function fetchScenes() {
    scenes = [];
    
    ajax(
        {
            url: API_BASE_URL + '/scenes',
            type: 'json',
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + API_KEY
            }
        },
        function(data) {
            data.forEach(function(scene) {
                if (!(scene.uuid in scenes)) {
                    scenes.push({uuid: scene.uuid, name: scene.name});
                    mainMenu.item(1, scenes.length - 1, {title: scene.name});
                }
            });
        },
        function(error, status) {
            handleError(status);
        }
    );
}

function fetchLights() {
    groups = [];
    lights = [];
    
    ajax(
        {
            url: API_BASE_URL + '/lights/all',
            type: 'json',
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + API_KEY
            }
        },
        function(data) {
            data.forEach(function(light) {
                if (!(light.group.id in groups)) {
                    groups.push({id: light.group.id, name: light.group.name});
                    mainMenu.item(2, groups.length - 1, {title: light.group.name});
                }
                if (!(light.id in lights)) {
                    lights.push({id: light.id, name: light.label});
                    mainMenu.item(3, lights.length - 1, {title: light.label});
                }
            });
        },
        function(error, status) {
            handleError(status);
        }
    );
}


/*
 * App Ready
 */

Pebble.addEventListener("ready", function () {
    mainMenu.show();
    loadingCard.hide();
    
    if (checkConfiguration()) {
        fetchScenes();
        fetchLights();
    }
});