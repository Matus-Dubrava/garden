const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
const conn = require('./services/database');

const goodsRoutes = require('./routes/goods');
const receiptRoutes = require('./routes/receipts');
const issueCardRoutes = require('./routes/issueCards');

app.use(bodyParser.json());
app.use(cors());

app.use('/goods', goodsRoutes);
app.use('/receipts', receiptRoutes);
app.use('/issue-cards', issueCardRoutes);

conn.then(connection => {
    app.get('/', (req, res) => {
        res.send('welcome to garden');
    });

    app.listen(port, () => {
        console.log(`application listening on port ${port}`);
    });
});
