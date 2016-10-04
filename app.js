'use strict';

window.onload = function main() {
    document.getElementById('zipcode').addEventListener('keyup', getZip);
    var zipcode;

    function getZip(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            zipcode = event.target.value;

            console.log(zipcode);
            console.log(typeof zipcode);
            if (Number(zipcode) > 10000 && Number(zipcode) < 100000) {
                event.target.value = '';
                console.log(zipcode);

                var test = new GrouponData(zipcode);
            }
        }
    }
}

class GrouponData {
    constructor(zipcode) {
        this.zipcode = zipcode;
        this.dealData = [];
        this.doAjax(zipcode);
        console.log(this.dealData);
    }

    doAjax(zipcode) {
        $.ajax({
            url: `http://api.groupon.com/v2/deals/?client_id=e4452424d8c2dcd047b191712adc6ba0167342f2&postal_code=${zipcode}`,
            method: 'GET',
            success: function(data) {
                this.dealData.push(data);
            }
        });
    }
}
