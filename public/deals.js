'use strict';

// TODO separate into different files

window.onload = function() {
    var groupOnData = JSON.parse(localStorage.getItem('groupOnData'));
    var address = JSON.parse(localStorage.getItem('inputAddress'));
    var dealsContainer = $('#deals-container');
    var dropdown = $('#dropdown1');
    var modalSection = $('#modals-section');
    var allDealsButton = $('#all-deals');

    var cards = new GroupOnCards(groupOnData, address);

    cards.createDropdown(dropdown);
    cards.createHorizontalCards(dealsContainer, modalSection);
    cards.allDeals(allDealsButton);

    $(`.modal-trigger`).leanModal();

    // TODO find OOP place for this
    $(document).on('click', '.modal-trigger', function() {
        var uuid = this.getAttribute('href').slice(1);
        var modalMap = document.getElementById(`map\&${uuid}`);
        var curCoord;
        $(modalMap).css('height', '400px');
        $(modalMap).css('width', '100%');
        // var test = document.createElement('p');
        console.log(modalMap);

        for (let card of cards.data) {
            if (card.uuid === uuid) {
                curCoord = {
                    lat: card.lat,
                    lng: card.lng
                };
            }
        }

        initMap(curCoord, address, modalMap);
    });
};

// TODO find OOP place for this
function initMap(coordDeal, address, modalElement) {
    var directionsRequest = {
        origin: new google.maps.LatLng(coordDeal.lat, coordDeal.lng),
        destination: new google.maps.LatLng(address.geometry.location.lat, address.geometry.location.lng),
        travelMode: 'DRIVING'
    };
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var mapCenter = new google.maps.LatLng((coordDeal.lat + address.geometry.location.lat) / 2, (coordDeal.lng + address.geometry.location.lng) / 2);

    var map = new google.maps.Map(modalElement, {
        zoom: 12,
        center: mapCenter
    });

    directionsDisplay.setMap(map);
    calcAndDisplayRoute(directionsService, directionsDisplay, directionsRequest);
}

// TODO find OOP place for this
function calcAndDisplayRoute(directionsService, directionsDisplay, directionsRequest) {
    directionsService.route(directionsRequest, function(result, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(result);
        }
    });
}
