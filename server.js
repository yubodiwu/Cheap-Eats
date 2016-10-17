'use strict';

var express = require(`express`);
var app = express();
const PORT = process.env.PORT || 3000;

app.use(`/public`, express.static(`public`));

app.get(`/`, function(req, res) {
    res.sendFile(__dirname + `/index.html`);
});

app.get(`/deals.html`, function(req, res) {
    res.sendFile(__dirname + `/deals.html`);
});

app.listen(PORT, function() {
    console.log(`server is listening on port ${PORT}`);
});
