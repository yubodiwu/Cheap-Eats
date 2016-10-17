'use strict';

class GroupOnCard {
    constructor(groupOnDeal, address, modalSection) {
        this.address = address;
        this.datum = groupOnDeal;
        this.addressCoord = {
            lat: address.geometry.location.lat,
            lng: address.geometry.location.lng
        };
        this.dealCoord = {
            lat: this.datum.lat,
            lng: this.datum.lng
        };
        this.dist = Math.round(this._earthDistance(this.addressCoord, this.dealCoord) * 100) / 100;
        this.tags = this.datum.tags;

        this.dealCard = this.createCard(modalSection);
    }

    createCard(modalSection) {
        var deal = this.datum;

        var row = $('<div class="col s6" style="margin-top: 10px; margin-bottom: 10px">');
        var cardHorizontal = $('<div class="card">');
        var cardImg = $(`<div class="card-image">`).append($(`<img src=${deal.grid4ImageUrl} style="vertical-align: center;">`));
        var cardStacked = $('<div class="card-stacked">');
        var cardContent = $('<span class="card-content">');
        var cardText = $('<p style="margin: 10px">').text(deal.title);
        var cardAddressUpper = $('<p style="margin: 10px; margin-bottom: 0px">').text(`${deal.streetAddress}`);
        var cardAddressLower = $('<p style="margin: 10px; margin-top: 0px">').text(`${deal.city}, ${deal.state} ${deal.postalCode}`);
        var cardTitle = $('<h5 style="margin: 10px">').text(deal.announcementTitle);
        var cardAction = $('<div class="card-action">');
        var buyLink = $(`<a href=${deal.buyUrl}>`).text(`BUY \$${deal.priceAmount/100} (${deal.discountPercent}\% OFF)`);
        var cardDist = $(`<a class="modal-trigger" href="#${deal.uuid}">`).text(`MAP (${this.dist} MILES AWAY)`);

        this._addModalMap(this.dealCoord, cardDist, modalSection, this.addressCoord);

        cardAction.append(buyLink);
        cardAction.append(cardDist);
        cardContent.append(cardTitle);
        cardContent.append(cardText);
        cardContent.append(cardAddressUpper);
        cardContent.append(cardAddressLower);
        cardContent.append(cardAction);
        // cardContent.append(cardCopyright);
        cardStacked.append(cardContent);

        cardHorizontal.append(cardImg);
        cardHorizontal.append(cardStacked);
        row.append(cardHorizontal);

        var dealCard = {
            card: row,
            dist: this.dist,
            price: deal.priceAmount
        };

        return dealCard;
    }

    _addModalMap(coordDeal, cardDist, modalSection, address) {
        // var directionsRequest = {
        //     origin: new google.maps.LatLng(coordDeal.lat, coordDeal.lng),
        //     destination: new google.maps.LatLng(address.lat, address.lng),
        //     travelMode: 'DRIVING'
        // }
        var uuid = cardDist.attr('href');
        var modal = $(`<div id="${uuid.slice(1)}" class="modal">`);
        var modalContent = $(`<div class="modal-content">`);
        // var modalHeader = // need header
        var modalMap = $(`<div id="map\&${uuid.slice(1)}">`);

        modalContent.append(modalMap);
        modal.append(modalContent);

        modalSection.append(modal);
    }
    // find distance between two coordinates
    _earthDistance(coord1, coord2) {
        var RADIUS_OF_EARTH = 3961; // miles
        var lat1 = coord1.lat * Math.PI / 180;
        var lat2 = coord2.lat * Math.PI / 180;
        var lon1 = coord1.lng * Math.PI / 180;
        var lon2 = coord2.lng * Math.PI / 180;

        var dlon = lon2 - lon1;
        var dlat = lat2 - lat1;

        var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) *
            Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return RADIUS_OF_EARTH * c;
    }
}
