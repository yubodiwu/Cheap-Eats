'use strict';

window.onload = function() {
    var groupOnDataString = JSON.parse(localStorage.getItem('groupOnData'));
    var groupOnData = []

    for (let key in groupOnDataString) {
        groupOnData.push(JSON.parse(groupOnDataString[key]));
    }

    console.log(groupOnData);
}
