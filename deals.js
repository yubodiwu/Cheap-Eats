'use strict';

window.onload = function() {
    var groupOnDataString = JSON.parse(localStorage.getItem('groupOnData'));
    var groupOnData = [];
    var dealsContainer = $('#deals-container');

    // converting GroupOn data back into array of objects
    for (let key in groupOnDataString) {
        groupOnData.push(JSON.parse(groupOnDataString[key]));
    }

    var cards = new GroupOnCards(groupOnData);
    console.log('do I get to the line before createCards?');
    cards.createHorizontalCards(dealsContainer);

    console.log(groupOnData);
}

// class of cards for the GroupOn deals for the deals page
class GroupOnCards {
    constructor(groupOnData) {
        this.data = groupOnData
    }

    createCards(dealsContainer) {
        console.log(this.data);
        for (let deal of this.data) {
            var row = $('<div class="row">');
            var innerRow = $('<div class="col s12 m12">');
            var cardColors = $(`<div class="card blue-grey darken-1">`)
            var cardContent = $('<div class="card-content white-text">');
            var cardTitle = $('<span class="card-title">');
            var cardText = $('<p>');
            var cardAction = $('<div class="card-action">');
            var buyLink = $(`<a href=${deal.buyUrl}>`)

            cardTitle.text(deal.announcementTitle);
            cardText.text(deal.title);
            buyLink.text('buy blah');

            cardContent.append(cardTitle);
            cardContent.append(cardText);
            cardAction.append(buyLink);
            cardContent.append(cardAction);
            innerRow.append(cardContent);
            row.append(innerRow);
            innerRow.append(cardColors);
            cardColors.append(cardContent);

            dealsContainer.append(row);
        }
    }

    createHorizontalCards(dealsContainer) {
        console.log(this.data);
        for (let deal of this.data) {
            var row = $('<div class="col s12 m12">');
            var cardHorizontal = $('<div class="card horizontal" style="margin: 0px; border: .1px solid #d3d3d3">');
            var cardImg = $(`<div class="card-image">`)
            var cardStacked = $('<div class="card-stacked">');
            var cardContent = $('<span class="card-content">');
            var cardText = $('<p>');
            var cardAddressUpper = $('<p style="margin-top: 10px;">');
            var cardAddressLower = $('<p>');
            var cardTitle = $('<h5>')
            var cardAction = $('<div class="card-action">');
            var cardCopyright = $('<p style="float: right;">')
            var buyLink = $(`<a href=${deal.buyUrl}>`)

            cardTitle.text(deal.announcementTitle);
            cardText.text(deal.title);
            cardAddressUpper.text(`${deal.streetAddress}`);
            cardAddressLower.text(`${deal.city}, ${deal.state} ${deal.postalCode}`);
            cardCopyright.text('powered by GroupOn');
            buyLink.text(`\$${deal.priceAmount/100} (${deal.discountPercent}\% off)`);
            cardImg.append($(`<img src=${deal.grid4ImageUrl} style="vertical-align: center;">`));

            cardAction.append(buyLink);
            cardContent.append(cardTitle);
            cardContent.append(cardText);
            cardContent.append(cardAddressUpper);
            cardContent.append(cardAddressLower);
            cardContent.append(cardAction);
            // cardContent.append(cardCopyright);
            cardStacked.append(cardContent)

            cardHorizontal.append(cardImg);
            cardHorizontal.append(cardStacked);
            row.append(cardHorizontal);

            dealsContainer.append(row);
        }
    }
}
