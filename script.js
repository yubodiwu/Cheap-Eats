console.log('checking console logs');
var map;

function initMap() {
    console.log('init map happens');
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    });
}

var service;
var infowindow;
var mapresults = [];

function initialize() {
    console.log('initialize happens');
    var pyrmont = new google.maps.LatLng(37.787652, -122.396782);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });

    var request = {
        location: pyrmont,
        radius: '500',
        types: ['store']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
    console.log(typeof service.nearbySearch(request, callback));
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            mapresults.push(results[i]);
        }
    }
}

console.log('map results is');
console.log(mapresults);
