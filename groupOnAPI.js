const express = require(`express`);
const request = require(`request`);

const router = express.Router();
const DIVISION_URL = `https://partner-api.groupon.com/division.json`;

router.get(`/get-division`, function(req, res) {
    console.log(`getting division`);
    request(DIVISION_URL, (error, response, body) => {
        res.json(JSON.parse(body));
    })
});

router.get(`/get-partner-data/:divisionId`, function(req, res) {
    console.log(`getting partner data`);
    var partnerUrl = `https://partner-api.groupon.com/deals.json?tsToken=US_AFF_0_201236_212556_0&division_id=${req.params.divisionId}&offset=0&limit=250&filters=category:food-and-drink`;

    request(partnerUrl, (error, response, body) => {
        res.json(JSON.parse(body));
    })
});

module.exports = router;
