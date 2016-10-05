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
    cards.createCards(dealsContainer);

    console.log(groupOnData);
}

// class of cards for the GroupOn deals for the deals page
class GroupOnCards {
    constructor(groupOnData) {
        this.data = groupOnData
    }

    createCards(dealsContainer) {
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
            buyLink.text('BUY');

            cardContent.append(cardTitle);
            cardContent.append(cardText);
            cardAction.append(buyLink);
            cardContent.append(cardAction);
            innerRow.append(cardContent);
            row.append(innerRow);
            innerRow.append(cardColors);
            cardColors.append(cardContent);

            console.log(`row is instance of jQuery? ${row instanceof jQuery}`);
            console.log(row[0]);

            dealsContainer.append(row);
        }
    }
}
