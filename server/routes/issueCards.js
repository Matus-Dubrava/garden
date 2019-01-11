const router = require('express').Router();
const passport = require('passport');

const conn = require('../services/database');

const tokenLogin = passport.authenticate('jwt', { session: false });

conn.then(connection => {
    router.get('/', tokenLogin, (req, res) => {
        connection
            .query(`SELECT * FROM issue_card`)
            .then(rows => {
                res.json(rows);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('internal error');
            });
    });

    router.get('/:id', tokenLogin, (req, res) => {
        const { id } = req.params;

        connection
            .query(
                `SELECT * FROM (SELECT * FROM issue_card_goods LEFT JOIN goods ON goods.id=issue_card_goods.goods_id WHERE issue_card_goods.issue_card_id=${+id}) as temp LEFT JOIN issue_card ON temp.issue_card_id=issue_card.id`
            )
            .then(rows => {
                let response;

                if (!rows.length) {
                    connection
                        .query(`SELECT * FROM issue_card where id=${+id}`)
                        .then(rows => {
                            return res.json(rows[0]);
                        });
                } else {
                    const storeItems = rows.map(item => ({
                        id: item.goods_id,
                        code: item.code,
                        name: item.name,
                        amount: item.amount
                    }));
                    response = {
                        id,
                        identifier: rows[0].identifier,
                        date: rows[0].date,
                        receiver: rows[0].receiver,
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

    router.post('/', tokenLogin, (req, res) => {
        const { date, receiver = '', identifier } = req.body;

        if (!date || !identifier) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(
                    `INSERT INTO issue_card (date, receiver, identifier) VALUES ("${date}", "${receiver}", "${identifier}")`
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

    router.post('/field', tokenLogin, (req, res) => {
        const { amount, storeItemId, issueCardId } = req.body;

        if (!amount || !storeItemId || !issueCardId) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(
                    `INSERT INTO issue_card_goods (goods_id, issue_card_id, amount) VALUES (${+storeItemId}, ${+issueCardId}, ${+amount})`
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

    router.post('/update', tokenLogin, (req, res) => {
        const { date, receiver = '', identifier, issueCardId } = req.body;

        if (!date || !issueCardId || !identifier) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(
                    `UPDATE issue_card SET date="${date}", receiver="${receiver}", identifier="${identifier}" WHERE id=${+issueCardId};`
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

    router.post('/update/field', tokenLogin, (req, res) => {
        const { issueCardId, storeItemId, amount } = req.body;

        if (!storeItemId || !issueCardId || !amount) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(
                    `UPDATE issue_card_goods SET amount=${+amount} WHERE issue_card_id=${+issueCardId} AND goods_id=${+storeItemId}`
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

    router.delete('/field', tokenLogin, (req, res) => {
        const { issueCardId, storeItemId } = req.body;

        if (!storeItemId || !issueCardId) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(
                    `DELETE FROM issue_card_goods WHERE issue_card_id=${+issueCardId} AND goods_id=${+storeItemId}`
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

    router.delete('/', tokenLogin, (req, res) => {
        const { id } = req.body;

        if (!id) {
            return res.status(422).send('incomplete form data');
        } else {
            connection
                .query(
                    `DELETE FROM issue_card_goods WHERE issue_card_id=${+id}`
                )
                .then(rows => {
                    return connection.query(
                        `DELETE FROM issue_card WHERE id=${+id}`
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
