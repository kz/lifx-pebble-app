var UI = require('ui');
var Settings = require('settings');
var ajax = require('ajax');

var CONFIGURATION_URL = "http://kz.github.io/lifx-pebble-config/index.html";

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
    } else {
        setupCard.hide();
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
 * App Ready
 */

Pebble.addEventListener("ready", function () {
    mainMenu.show();
    loadingCard.hide();
    checkConfiguration();
});