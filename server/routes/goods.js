const router = require('express').Router();

const conn = require('../services/database');

conn.then(connection => {
    router.get('/', (req, res) => {
        const { date } = req.query;
        if (date) {
            connection
                .query(
                    `SELECT id, code, name, sum(amount) as bought FROM store_items_bought_date WHERE date_bought < "${date}" GROUP BY id`
                )
                .then(boughtRows => {
                    connection
                        .query(
                            `SELECT id, code, name, sum(amount) as sold FROM store_items_sold_date WHERE date_sold < "${date}" GROUP BY id`
                        )
                        .then(soldRows => {
                            const result = [];
                            const processedIds = [];

                            boughtRows.forEach(item => {
                                let processed = false;
                                for (let i = 0; i < soldRows.length; i++) {
                                    if (item.id === soldRows[i].id) {
                                        processed = true;
                                        processedIds.push(item.id);
                                        result.push({
                                            id: item.id,
                                            name: item.name,
                                            code: item.code,
                                            available:
                                                +item.bought - +soldRows[i].sold
                                        });
                                        break;
                                    }
                                }
                                if (!processed) {
                                    result.push({
                                        id: item.id,
                                        name: item.name,
                                        code: item.code,
                                        available: +item.bought
                                    });
                                }
                            });

                            soldRows.forEach(item => {
                                if (!processedIds.includes(item.id)) {
                                    result.push({
                                        id: item.id,
                                        name: item.name,
                                        code: item.code,
                                        available: -Number(item.sold)
                                    });
                                }
                            });

                            return res.json(result);
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('internal error');
                });
        } else {
            connection
                .query('SELECT * FROM store_items')
                .then(rows => {
                    res.json(rows);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('internal error');
                });
        }
    });

    router.post('/', (req, res) => {
        const { code, name, sellingPrice } = req.body;

        if (!code || !name || !sellingPrice) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(
                    `INSERT INTO goods (name, code, sellingPrice) VALUES ('${name}', '${code}', ${+sellingPrice})`
                )
                .then(rows => {
                    res.json(rows);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('internal error');
                });
        }
    });

    router.post('/update', (req, res) => {
        const { code, name, sellingPrice, id } = req.body;

        if (!code || !name || !sellingPrice || !id) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(
                    `UPDATE goods SET name="${name}", code="${code}", sellingPrice=${+sellingPrice} WHERE id=${+id}`
                )
                .then(rows => {
                    res.json(rows);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('internal error');
                });
        }
    });

    router.delete('/:id', (req, res) => {
        const { id } = req.params;

        connection
            .query(`DELETE FROM goods WHERE id=${+id}`)
            .then(rows => {
                res.status(204).json({});
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('internal error');
            });
    });
});

module.exports = router;
