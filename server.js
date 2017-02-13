`use strict`;

var express = require(`express`);
var request = require(`request`);
var app = express();

var groupOnAPI = require(`./groupOnAPI`);

const PORT = process.env.PORT || 3000;

app.use(`/public`, express.static(`public`));
app.use(`/api`, groupOnAPI);

app.get(`/`, (req, res) => {
    res.sendFile(__dirname + `/index.html`);
});

app.get(`/deals.html`, (req, res) => {
    res.sendFile(__dirname + `/deals.html`);
});

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});
