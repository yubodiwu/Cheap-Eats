'use strict';
var test2 = 2;
var test;
var zipcode;

window.onload = function main() {
    document.getElementById('zipcode').addEventListener('keyup', getZip);

    function getZip(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            zipcode = event.target.value;

            if (Number(zipcode) > 10000 && Number(zipcode) < 100000) {
                event.target.value = '';

                test = new GrouponData(Number(zipcode));
                // localStorage.setItem('groupondata', test.toString());

                test2 = new PlacesData(Number(zipcode));
            }
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

    // make Ajax call to Groupon API
    doAjax(zipcode) {
        var dealData = this.dealData;
        var deals = this.deals;
        var parseGrouponData = this.parseGrouponData;

        $.ajax({
            url: `http://api.groupon.com/v2/deals/?client_id=e4452424d8c2dcd047b191712adc6ba0167342f2&postal_code=${zipcode}`,
            method: 'GET',
            dataType: 'jsonp',
            success: function(data) {
                dealData = data.deals;
                for (let deal of dealData) {
                    for (let i = 0; i < deal.options.length; i++) {
                        var filtrdGroupon = parseGrouponData(deal, i);

                        if (filtrdGroupon !== undefined) {
                            console.log('this happens?');
                            deals.push(filtrdGroupon);
                        }
                    }
                }

                var dealsJSON = {};

                for (let i = 0; i < deals.length; i++) {
                    dealsJSON[i] = deals[i];
                }

                console.log('dealsJSON is ');
                console.log(dealsJSON);

                localStorage.setItem('groupOnData', JSON.stringify(dealsJSON));
                // window.location.href = 'file:///Users/yubodiwu/workspace/Galvanize/Projects/q1/deals.html';
            }
        });
    }

    // get url, image, price, value, discount, latitude, and longitude from a GroupOn data point
    parseGrouponData(grouponObj, option) {
        var parsedObj = {
            // cannot declare lat, lng here b/c some deals have no redemption location
            announcementTitle: grouponObj.announcementTitle,
            buyUrl: grouponObj.options[option].buyUrl,
            grid4ImageUrl: grouponObj.grid4ImageUrl,
            priceAmount: grouponObj.options[option].price.amount,
            valueAmount: grouponObj.options[option].value.amount,
            savings: grouponObj.options[option].discount.amount,
            discountPercent: grouponObj.options[option].discountPercent,
            title: grouponObj.options[option].title,
            tags: grouponObj.tags
        };

        for (let tag of parsedObj.tags) {
            if (tag.name === 'Restaurants') console.log('is a restaurant');
            if (tag.name === 'Restaurants') {
                // TODO: figure out how to get multiple [lat,lng] pairs if there's more than one
                parsedObj.lat = grouponObj.options[option].redemptionLocations[0].lat;
                parsedObj.lng = grouponObj.options[option].redemptionLocations[0].lng;
                return JSON.stringify(parsedObj);
            }
        }
    }

    // parse GroupOn partner data
    parsePartnerData(partnerObj, option) {
        console.log(partnerObj.options);
        var parsedObj = {
            // cannot declare lat, lng here b/c some deals have no redemption location
            announcementTitle: partnerObj.announcementTitle,
            buyUrl: partnerObj.options[option].buyUrl,
            grid4ImageUrl: partnerObj.grid4ImageUrl,
            priceAmount: partnerObj.options[option].price.amount,
            valueAmount: partnerObj.options[option].value.amount,
            savings: partnerObj.options[option].discount.amount,
            discountPercent: partnerObj.options[option].discountPercent,
            title: partnerObj.options[option].title,
            tags: partnerObj.tags
        };

        if (partnerObj.options[option].redemptionLocations.length > 0) {
            parsedObj.lat = partnerObj.options[option].redemptionLocations[0].lat;
            parsedObj.lng = partnerObj.options[option].redemptionLocations[0].lng;

            return JSON.stringify(parsedObj);
        }
    }

    // take zipcode and convert to {lat, lng} pairing using Google maps geocode api
    zipToGeo(zipcode) {
        var divAjax = this.divisionAjax;
        var divisionPointer = this.division;
        var ptnAjax = this.partnerAjax;
        var parser = this.parsePartnerData;

        $.ajax({
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                this.lat = (data.results[0].geometry.bounds.northeast.lat + data.results[0].geometry.bounds.southwest.lat) / 2;
                this.lng = (data.results[0].geometry.bounds.northeast.lng + data.results[0].geometry.bounds.southwest.lng) / 2;
                var coord = {
                    lat: this.lat,
                    lng: this.lng
                }
                console.log(`what's undefined?`);
                console.log(this.divisionAjax);
                divAjax(divisionPointer, coord, ptnAjax, parser);
            }
        });
    }

    // given {lat,lng} pairing, find the closest GroupOn division
    divisionAjax(divisionPointer, coord, ptnAjax, parser) {
        $.ajax({
            url: `https://partner-api.groupon.com/division.json`,
            method: 'GET',
            dataType: 'jsonp',
            success: function(divisions) {
                console.log('inside divisionAjax success');
                console.log(divisions.divisions);
                console.log(divisionPointer);
                console.log(coord);

                var distances = [];
                for (let division of divisions.divisions) {
                    var coordDiv = {
                        lat: division.lat,
                        lng: division.lng
                    }

                    distances.push(earthDistance(coord, coordDiv));
                }

                var minDistInd = distances.indexOf(Math.min.apply(null, distances));
                divisionPointer = divisions.divisions[minDistInd].id;

                ptnAjax(divisionPointer, parser);

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
                console.log('deals are?');
                console.log(deals);
                for (let deal of deals.deals) {
                    // create a deal for each option
                    for (var i = 0; i < deal.options.length; i++) {
                        var filtrdPartnerDeal = parser(deal, i);

                        if (filtrdPartnerDeal !== undefined) {
                            dealsArr.push(filtrdPartnerDeal);
                        }
                    }

                    // make deals array into obj so it can be stringified
                    localStorage.setItem('groupOnData', JSON.stringify(dealsArr));
                    window.location.href = 'file:///Users/yubodiwu/workspace/Galvanize/Projects/q1/deals.html';
                }
            }
        });
    }
}

class PlacesData {
    constructor(zipcode) {
        this.zipcode = zipcode;
        this.dealData = undefined;
        this.deals = [];
        this.lat = undefined;
        this.lng = undefined;
        this.zipToGeo(zipcode);
    }

    zipToGeo(zipcode) {
        var ajaxPlcs = this.ajaxPlaces;

        $.ajax({
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}`,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                this.lat = (data.results[0].geometry.bounds.northeast.lat + data.results[0].geometry.bounds.southwest.lat) / 2;
                this.lng = (data.results[0].geometry.bounds.northeast.lng + data.results[0].geometry.bounds.southwest.lng) / 2;
            }
        });
    }
}
