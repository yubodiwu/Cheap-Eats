'use strict';

window.onload = function main() {
    document.getElementById('zipcode').addEventListener('keyup', getZip);
    var zipcode;

    function getZip(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            zipcode = event.target.value;

            if (Number(zipcode) > 10000 && Number(zipcode) < 100000) {
                event.target.value = '';

                var test = new GrouponData(Number(zipcode));
                console.log(this.deals);
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
            url: `http://api.groupon.com/v2/deals/?client_id=e4452424d8c2dcd047b191712adc6ba0167342f2&postal_code=${zipcode}&offset=`,
            method: 'GET',
            dataType: 'jsonp',
            success: function(data) {
                dealData = data.deals;
                for (let deal of dealData) {
                    for (var i = 0; i < deal.options.length; i++) {
                        var filtrdGroupon = parseGrouponData(deal,i);

                        if (filtrdGroupon !== undefined) {
                            deals.push(filtrdGroupon);
                        }
                    }
                }
                console.log('deals?');
                console.log(deals);
            }
        });
    }

// get url, image, price, value, discount, latitude, and longitude from a GroupOn data point
    parseGrouponData(grouponObj,option) {
        var parsedObj = {
            buyUrl: grouponObj.options[option].buyUrl,
            grid4ImageUrl: grouponObj.grid4ImageUrl,
            priceAmount: grouponObj.options[option].price.amount,
            valueAmount: grouponObj.options[option].value.amount,
            savings: grouponObj.options[option].discount.amount,
            discountPercent: grouponObj.options[option].dicountPercent,
            lat: grouponObj.options[option].redemptionLocations.lat,
            lng: grouponObj.options[option].redemptionLocations.lng,
            tags: grouponObj.tags
        };

        for (let tag of parsedObj.tags) {
            if (tag.name === 'Restaurants') {
                return parsedObj;
            }
        }
    }
}
