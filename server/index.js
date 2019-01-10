const express = require('express');
const cors = require('cors');
const mysql = require('promise-mysql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
let connection;

app.use(bodyParser.json());
app.use(cors());

app.get('/goods', (req, res) => {
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

app.post('/goods', (req, res) => {
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

app.post('/goods/update', (req, res) => {
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

app.delete('/goods/:id', (req, res) => {
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

app.get('/receipts', (req, res) => {
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

app.get('/issue-cards', (req, res) => {
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

app.get('/receipts/:id', (req, res) => {
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

app.get('/issue-cards/:id', (req, res) => {
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

app.post('/receipts', (req, res) => {
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

app.post('/issue-cards', (req, res) => {
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

app.post('/receipts/field', (req, res) => {
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

app.post('/issue-cards/field', (req, res) => {
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

app.post('/receipts/update', (req, res) => {
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

app.post('/issue-cards/update', (req, res) => {
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

app.post('/issue-cards/update/field', (req, res) => {
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

app.delete('/receipts/field', (req, res) => {
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

app.delete('/issue-cards/field', (req, res) => {
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

app.delete('/receipts', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(422).send('incomplete form data');
    } else {
        connection
            .query(`DELETE FROM goods_receipt WHERE receipt_id=${+id}`)
            .then(rows => {
                return connection.query(`DELETE FROM receipt WHERE id=${+id}`);
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

app.delete('/issue-cards', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(422).send('incomplete form data');
    } else {
        connection
            .query(`DELETE FROM issue_card_goods WHERE issue_card_id=${+id}`)
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

app.get('/', (req, res) => {
    res.send('welcome to garden');
});

mysql
    .createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'garden'
    })
    .then(conn => {
        connection = conn;
        app.listen(port, () => {
            console.log(`application listening on port ${port}`);
        });
    });
