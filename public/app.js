'use strict';

// TODO rename functions and methods properly
window.onload = function main() {
    var autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('address')), {
            types: ['geocode']
        });

    autocomplete.addListener('place_changed', function(event) {
        console.log(`going to deals page...`);
        var address = autocomplete.getPlace();
        localStorage.setItem('inputAddress', JSON.stringify(address));

        for (let component of address.address_components) {
            console.log("address is ", address);
            if (component.types[0] === 'postal_code') {
                var zipcode = component.long_name;
            }
        }
        console.log("zipcode is ", zipcode);
        var groupOn = new GrouponData(zipcode);
    });
};
