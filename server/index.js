const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const goodsRoutes = require('./routes/goods');
const receiptRoutes = require('./routes/receipts');
const issueCardRoutes = require('./routes/issueCards');
const userRoutes = require('./routes/users');

require('./services/passport');

const app = express();
const port = process.env.PORT || 5000;
const version = 'v0';
const baseUrl = `/garden/${version}`;

app.use(bodyParser.json());
app.use(cors());

app.use(baseUrl + '/users', userRoutes);
app.use(baseUrl + '/goods', goodsRoutes);
app.use(baseUrl + '/receipts', receiptRoutes);
app.use(baseUrl + '/issue-cards', issueCardRoutes);

app.listen(port, () => {
    console.log(`application listening on port ${port}`);
});
