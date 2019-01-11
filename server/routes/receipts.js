const router = require('express').Router();

const conn = require('../services/database');

conn.then(connection => {
    router.get('/', (req, res) => {
        connection
            .query(`SELECT * FROM receipt`)
            .then(rows => {
                res.json(rows);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('internal error');
            });
    });

    router.get('/:id', (req, res) => {
        const { id } = req.params;

        connection
            .query(
                `SELECT * FROM (SELECT * FROM goods_receipt LEFT JOIN goods ON goods.id=goods_receipt.goods_id WHERE goods_receipt.receipt_id=${+id}) as temp LEFT JOIN receipt ON temp.receipt_id=receipt.id`
            )
            .then(rows => {
                let response;

                if (!rows.length) {
                    connection
                        .query(`SELECT * FROM receipt where id=${+id}`)
                        .then(rows => {
                            return res.json(rows[0]);
                        });
                } else {
                    const storeItems = rows.map(item => ({
                        id: item.goods_id,
                        code: item.code,
                        name: item.name,
                        amount: item.amount,
                        inp_price: item.inp_price
                    }));
                    response = {
                        id,
                        identifier: rows[0].identifier,
                        date: rows[0].date,
                        company: rows[0].company,
                        price: rows[0].price,
                        storeItems
                    };
                    return res.json(response);
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('internal error');
            });
    });

    router.post('/', (req, res) => {
        const { date, company = '', identifier, price } = req.body;

        if (!date || !identifier || !price) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(
                    `INSERT INTO receipt (date, company, identifier, price) VALUES ("${date}", "${company}", "${identifier}", price)`
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

    router.post('/field', (req, res) => {
        const { amount, storeItemId, receiptId, inp_price } = req.body;

        if (!amount || !storeItemId || !receiptId || !inp_price) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(
                    `INSERT INTO goods_receipt (goods_id, receipt_id, amount, inp_price) VALUES (${+storeItemId}, ${+receiptId}, ${+amount}, ${+inp_price})`
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
        const { date, company = '', identifier, price, receiptId } = req.body;

        if (!date || !receiptId || !identifier || !price) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(
                    `UPDATE receipt SET date="${date}", company="${company}", identifier="${identifier}", price=${+price} WHERE id=${+receiptId};`
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

    router.delete('/field', (req, res) => {
        const { receiptId, storeItemId } = req.body;

        if (!storeItemId || !receiptId) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(
                    `DELETE FROM goods_receipt WHERE receipt_id=${+receiptId} AND goods_id=${+storeItemId}`
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

    router.delete('/', (req, res) => {
        const { id } = req.body;

        if (!id) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(`DELETE FROM goods_receipt WHERE receipt_id=${+id}`)
                .then(rows => {
                    return connection.query(
                        `DELETE FROM receipt WHERE id=${+id}`
                    );
                })
                .then(rows => {
                    res.json(rows);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('internal error');
                });
        }
    });
});

module.exports = router;
