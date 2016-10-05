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
                localStorage.setItem('groupondata',test.toString());
            }


        }
    }
}

class GrouponData {
    constructor(zipcode) {
        this.zipcode = zipcode;
        this.dealData = undefined;
        this.deals = [];
        this.doAjax(zipcode,0);
    }

// make Ajax call to Groupon API
    doAjax(zipcode,offset) {
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
                    for (var i = 0; i < deal.options.length; i++) {
                        var filtrdGroupon = parseGrouponData(deal,i);
                        // console.log('does this happen at least?');
                        // console.log(filtrdGroupon);
                        if (filtrdGroupon !== undefined) {
                            console.log('this happens?');
                            deals.push(filtrdGroupon);
                        }
                    }
                }
                console.log('deals?');
                console.log(deals);
                var dealsJSON = {};

                console.log(deals.length);
                for (var i = 0; i < deals.length; i++) {
                    console.log(deals[i]);
                    dealsJSON[i] = deals[i];
                }

                console.log(dealsJSON);

                localStorage.setItem('groupOnData',JSON.stringify(dealsJSON));
                window.location.href = 'file:///Users/yubodiwu/workspace/Galvanize/Projects/q1/deals.html';
            }
        });
    }

// get url, image, price, value, discount, latitude, and longitude from a GroupOn data point
    parseGrouponData(grouponObj,option) {
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
            if (tag.name === 'Restaurants') console.log('something happened');
            if (tag.name === 'Restaurants') {
            // TODO: figure out how to get multiple [lat,lng] pairs if there's more than one
                parsedObj.lat = grouponObj.options[option].redemptionLocations[0].lat;
                parsedObj.lng = grouponObj.options[option].redemptionLocations[0].lng;
                return JSON.stringify(parsedObj);
            }
        }
    }
}
