'use strict';

window.onload = function main() {
    document.getElementById('address').addEventListener('keyup', getZip);

    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(32.27, -125.88),
        new google.maps.LatLng(42.20, -113.93)
    );

    var autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('address')), {
            types: ['geocode']
        });

    autocomplete.addListener('place_changed', getZip);

    function getZip(event) {
        if (event.keyCode === 13) {
            console.log(`going to deals page...`);
            var address = autocomplete.getPlace();
            localStorage.setItem('inputAddress', JSON.stringify(address));

            for (let component of address.address_components) {
                if (component.types[0] === 'postal_code') {
                    var zipcode = component.long_name;
                }
            }

            var groupOn = new GrouponData(zipcode);
        }
    }
};

class GrouponData {
    constructor(zipcode) {
        this.zipcode = zipcode;
        this.dealData = undefined;
        this.deals = [];
        this.lat = undefined;
        this.lng = undefined;
        this.division = 'san-francisco';
        this.zipToGeo(zipcode);
    }

    // parse data from GroupOn partner api
    parsePartnerData(partnerObj, option) {
        var parsedObj = {
            // cannot declare lat, lng here b/c some deals have no redemption location
            uuid: partnerObj.uuid,
            announcementTitle: partnerObj.announcementTitle,
            buyUrl: partnerObj.options[option].buyUrl,
            grid4ImageUrl: partnerObj.grid4ImageUrl,
            priceAmount: partnerObj.options[option].price.amount,
            valueAmount: partnerObj.options[option].value.amount,
            savings: partnerObj.options[option].discount.amount,
            discountPercent: partnerObj.options[option].discountPercent,
            title: partnerObj.options[option].title,
            tags: partnerObj.tags,
            display: true
        };

        // only return parsed object if it has a redemption location, and also give it lat, lon, and address values
        if (partnerObj.options[option].redemptionLocations.length > 0) {
            parsedObj.lat = partnerObj.options[option].redemptionLocations[0].lat;
            parsedObj.lng = partnerObj.options[option].redemptionLocations[0].lng;
            parsedObj.streetAddress = partnerObj.options[option].redemptionLocations[0].streetAddress1;
            parsedObj.city = partnerObj.options[option].redemptionLocations[0].city;
            parsedObj.state = partnerObj.options[option].redemptionLocations[0].state;
            parsedObj.postalCode = partnerObj.options[option].redemptionLocations[0].postalCode;

            return parsedObj;
        }
    }

    // take zipcode and convert to {lat, lng} pairing using Google maps geocode api
    zipToGeo(zipcode) {
        $.ajax({
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}`,
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                var coord = {
                    lat: (data.results[0].geometry.bounds.northeast.lat + data.results[0].geometry.bounds.southwest.lat) / 2,
                    lng: (data.results[0].geometry.bounds.northeast.lng + data.results[0].geometry.bounds.southwest.lng) / 2
                };

                this.divisionAjax(this.division, coord, this.partnerAjax, this.parsePartnerData);
            }
        });
    }

    // given {lat,lng} pairing, find the closest GroupOn division
    divisionAjax(divisionPointer, coord, ptnAjax, parser) {
        $.ajax({
            url: `https://partner-api.groupon.com/division.json`,
            method: 'GET',
            dataType: 'jsonp',
            success: (divisions) => {
                // create an array of distances for each division for how far the distance is from the input address
                var distances = [];
                for (let division of divisions.divisions) {
                    let coordDiv = {
                        lat: division.lat,
                        lng: division.lng
                    };

                    distances.push(earthDistance(coord, coordDiv));
                }

                var minDistInd = distances.indexOf(Math.min.apply(null, distances));
                divisionPointer = divisions.divisions[minDistInd].id;

                ptnAjax(divisionPointer, parser);

                // finds distance between two {lat, lng} pairings
                function earthDistance(coord1, coord2) {
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
        });
    }

    // given GroupOn division and a parser function, put a stringified JSON into local storage with 250 deals for food-and-drink in that division
    partnerAjax(divisionId, parser) {
        var dealsArr = [];

        $.ajax({
            url: `https://partner-api.groupon.com/deals.json?tsToken=US_AFF_0_201236_212556_0&division_id=${divisionId}&offset=0&limit=250&filters=category:food-and-drink`,
            method: `GET`,
            dataType: `jsonp`,
            success: function(deals) {
                for (let deal of deals.deals) {
                    // create a deal for each option
                    for (var i = 0; i < deal.options.length; i++) {
                        var filtrdPartnerDeal = parser(deal, i);

                        if (filtrdPartnerDeal !== undefined) {
                            dealsArr.push(filtrdPartnerDeal);
                        }
                    }

                }

                // put GroupOn data in local storage to use with next page, then go to deals page
                localStorage.setItem('groupOnData', JSON.stringify(dealsArr));
                window.location.href = 'deals.html';
            }
        });
    }
}