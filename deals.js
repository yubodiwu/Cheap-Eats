'use strict';

window.onload = function() {
    var groupOnData = JSON.parse(localStorage.getItem('groupOnData'));
    var address = JSON.parse(localStorage.getItem('inputAddress'));
    var dealsContainer = $('#deals-container');
    var dropdown = $('#dropdown1');
    var modalSection = $('#modals-section');

    var cards = new GroupOnCards(groupOnData, address);
    // filterTabs.append(cards.createFilterTabs());
    cards.createDropdown(dropdown);
    cards.createHorizontalCards(dealsContainer, modalSection);
}

// class of cards for the GroupOn deals for the deals page
class GroupOnCards {
    constructor(groupOnData, address) {
        this.data = groupOnData;
        this.coord = {
            lat: address.geometry.location.lat,
            lng: address.geometry.location.lng
        };
        this.tags = [];
        for (let deal of this.data) {
            for (let tag of deal.tags) {
                if (this.tags.indexOf(tag.name) === -1) {
                    this.tags.push(tag.name);
                }
            }
        }
        this.tags.sort();
    }

    createHorizontalCards(dealsContainer,modalSection) {
        var dealCards = [];

        for (let deal of this.data) {
            if (deal.display === true) {
                var coordDeal = {
                    lat: deal.lat,
                    lng: deal.lng
                };
                var dist = Math.round(this._earthDistance(this.coord, coordDeal) * 100) / 100;

                var row = $('<div class="col s6" style="margin-top: 10px; margin-bottom: 10px">');
                var cardHorizontal = $('<div class="card">');
                var cardImg = $(`<div class="card-image">`).append($(`<img src=${deal.grid4ImageUrl} style="vertical-align: center;">`));
                var cardStacked = $('<div class="card-stacked">');
                var cardContent = $('<span class="card-content">');
                var cardText = $('<p style="margin: 10px">').text(deal.title);
                var cardAddressUpper = $('<p style="margin: 10px;">').text(`${deal.streetAddress}`);
                var cardAddressLower = $('<p style="margin: 10px">').text(`${deal.city}, ${deal.state} ${deal.postalCode}`);
                var cardDist = $(`<a href="${deal.uuid}" class="modal-trigger">`).text(`MAP (${dist} MILES AWAY)`);
                var cardTitle = $('<h5 style="margin: 10px">').text(deal.announcementTitle);
                var cardAction = $('<div class="card-action">');
                // var cardCopyright = $('<p style="float: right;">').text('powered by GroupOn');
                var buyLink = $(`<a href=${deal.buyUrl}>`).text(`BUY \$${deal.priceAmount/100} (${deal.discountPercent}\% OFF)`);

                this._addModalMap(cardDist,modalSection);
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

                // create array of objects with the card, distance from the original address, and the price, then poplate an array with them
                var dealCard = {
                    card: row,
                    dist: dist,
                    price: deal.priceAmount
                };
                dealCards.push(dealCard);
            }
        }

        this._appendOrderedCards(dealsContainer,dealCards);
    }

    _appendOrderedCards(dealsContainer,dealCards) {
        // sort the array of cards by distance
        dealCards.sort(_compareDist);

        // attach the cards to the page with the closest entries by distance coming first
        for (let card of dealCards) {
            dealsContainer.append(card.card);
        }

        function _compareDist(deal1, deal2) {
            return deal1.dist - deal2.dist;
        }
    }

    // add modal map to card's distance anchor
    _addModalMap(cardDist, modalSection) {
        var uuid = cardDist.attr('href');
        console.log(typeof uuid);
    }

    // create dropdown menu of restaurant types/offerings that can be clicked to filter for that kind of restaurant/offering
    createDropdown(dropdown) {
        for (let tag of this.tags) {
            let li = $('<li>');
            let anchor = $('<a href="#!">').text(tag);

            // sets display value for filtered elements to false and re-renders page
            anchor.on('click', (event) => {
                var choice = event.target.textContent;
                console.log(this.data.length);
                console.log(choice);
                for (let deal of this.data) {
                    var tagsArr = [];

                    for (let tag of deal.tags) {
                        tagsArr.push(tag.name);
                    }

                    if (tagsArr.indexOf(choice) === -1) {
                        deal.display = false;
                    } else {
                        deal.display = true;
                    }
                }

                localStorage.setItem('groupOnData', JSON.stringify(this.data));
                window.location.href = 'file:///Users/yubodiwu/workspace/Galvanize/Projects/q1/deals.html';
            });

            li.append(anchor);
            dropdown.append(li);
        }
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
