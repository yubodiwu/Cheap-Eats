'use strict';

// class of cards for the GroupOn deals for the deals page
class GroupOnCards {
    constructor(groupOnData, address) {
        this.address = address;
        this.data = groupOnData;
        // this.coord = {
        //     lat: address.geometry.location.lat,
        //     lng: address.geometry.location.lng
        // };

        // TODO consider moving tags to GroupOnCard
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

    createHorizontalCards(dealsContainer, modalSection) {
        var dealCards = [];

        for (let deal of this.data) {
            if (deal.display === true) {
                var card = new GroupOnCard(deal, this.address, modalSection);

                dealCards.push(card.dealCard);
            }
        }

        this._appendOrderedCards(dealsContainer, dealCards);
    }

    allDeals(button) {
        button.on('click', (event) => {
            for (let deal of this.data) {
                deal.display = true;
            }

            localStorage.setItem('groupOnData', JSON.stringify(this.data));
            window.location.href = 'deals.html';
        });
    }

    _appendOrderedCards(dealsContainer, dealCards) {
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
    _addModalMap(coordDeal, cardDist, modalSection) {
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
                window.location.href = 'deals.html';
            });

            li.append(anchor);
            dropdown.append(li);
        }
    }
}
