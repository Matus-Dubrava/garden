create table goods(
    id int unsigned not null auto_increment,
    name varchar(255) not null,
    code varchar(20) not null unique,
    sellingPrice float,
    primary key(id)
);

create table receipt(
    id int unsigned not null auto_increment,
    company varchar(255) not null,
    identifier varchar(50) unique,
    date date not null,
    price float not null,
    primary key(id)
);

create table issue_card(
    id int unsigned not null auto_increment,
    identifier varchar(50) unique,
    receiver varchar(255),
    date date not null,
    primary key(id)
);

create table goods_receipt (
    goods_id int unsigned not null,
    receipt_id int unsigned not null,
    amount int unsigned not null,
    inp_price float not null,
    foreign key (goods_id) references goods(id),
    foreign key (receipt_id) references receipt(id),
    CONSTRAINT goods_receipt_unique UNIQUE (goods_id, receipt_id)
);

create table issue_card_goods (
    goods_id int unsigned not null,
    issue_card_id int unsigned not null,
    amount int unsigned not null,
    foreign key (goods_id) references goods(id),
    foreign key (issue_card_id) references issue_card(id),
    CONSTRAINT goods_receipt_unique UNIQUE (goods_id, issue_card_id)
);

CREATE VIEW store_items AS SELECT main.id, main.name, main.code, main.bought, main.sellingPrice, sec.sold FROM (SELECT goods.id, goods.name, goods.code, SUM(goods_receipt.amount) as bought, goods.sellingPrice FROM goods LEFT JOIN goods_receipt ON goods.id=goods_receipt.goods_id GROUP BY code) as main JOIN (SELECT goods.code, SUM(issue_card_goods.amount) as sold FROM goods LEFT JOIN issue_card_goods ON goods.id=issue_card_goods.goods_id GROUP BY code) as sec ON main.code=sec.code;



INSERT INTO goods (name, code, sellingPrice) VALUES ('agapantus', 'A100', 2.3);
INSERT INTO goods (name, code, sellingPrice) VALUES ('lisiantus', 'B100', 1.2);
update goods set name="agapantus new", code="A101", sellingPrice=10 where id=1;
SELECT * FROM goods;

INSERT INTO receipt (company, date, price) VALUES ('agawa', '2014-04-10', 3000);
INSERT INTO receipt (company, date, price) VALUES ('agawa', '2014-05-10', 5000);
SELECT * FROM receipt;

INSERT INTO goods_receipt (receipt_id, goods_id, amount, inp_price) VALUES (1, 1, 100, 1.3);
INSERT INTO goods_receipt (receipt_id, goods_id, amount, inp_price) VALUES (1, 2, 200, 0.9);
INSERT INTO goods_receipt (receipt_id, goods_id, amount, inp_price) VALUES (2, 2, 300, 0.8);
SELECT * FROM goods_receipt;

SELECT * FROM goods_receipt JOIN goods ON goods_receipt.goods_id = goods.id JOIN receipt ON goods_receipt.receipt_id = receipt.id;

// select goods per receipts 
SELECT receipt.company, receipt.date, goods.name, goods_receipt.amount, goods_receipt.inp_price FROM goods_receipt JOIN goods ON goods_receipt.goods_id = goods.id JOIN receipt ON goods_receipt.receipt_id = receipt.id;

// select goods per receipt id
SELECT receipt.company, receipt.date, goods.name, goods_receipt.amount, goods_receipt.inp_price FROM goods_receipt JOIN goods ON goods_receipt.goods_id = goods.id JOIN receipt ON goods_receipt.receipt_id = receipt.id WHERE goods_receipt.receipt_id=1;

// select goods per all receipts
SELECT receipt.id, receipt.company, receipt.date, goods.name, goods.code, goods_receipt.amount, goods_receipt.inp_price FROM goods_receipt JOIN goods ON goods_receipt.goods_id = goods.id JOIN receipt ON goods_receipt.receipt_id = receipt.id ORDER BY receipt.id;

// get total amount of each goods
SELECT goods.id, goods.name, goods.code, SUM(goods_receipt.amount) as bought, goods.sellingPrice FROM goods LEFT JOIN goods_receipt ON goods.id=goods_receipt.goods_id GROUP BY code;

INSERT INTO issue_card (date) VALUES ('2014-05-10');

INSERT INTO issue_card_goods (issue_card_id, goods_id, amount) VALUES (1, 1, 200);
INSERT INTO issue_card_goods (issue_card_id, goods_id, amount) VALUES (1, 2, 100);

// select one issue card
SELECT issue_card.id, issue_card.date, goods.code, goods.name, issue_card_goods.amount FROM issue_card_goods JOIN issue_card ON issue_card_goods.issue_card_id=issue_card.id JOIN goods ON issue_card_goods.goods_id=goods.id WHERE issue_card_goods.issue_card_id=1;

// get total amount sold
SELECT goods.id, goods.name, goods.code, SUM(issue_card_goods.amount), goods.sellingPrice FROM goods LEFT JOIN issue_card_goods ON goods.id=issue_card_goods.goods_id GROUP BY code;


// final all goods
SELECT main.id, main.name, main.code, main.bought, main.sellingPrice, sec.sold FROM (SELECT goods.id, goods.name, goods.code, SUM(goods_receipt.amount) as bought, goods.sellingPrice FROM goods LEFT JOIN goods_receipt ON goods.id=goods_receipt.goods_id GROUP BY code) as main JOIN (SELECT goods.code, SUM(issue_card_goods.amount) as sold FROM goods LEFT JOIN issue_card_goods ON goods.id=issue_card_goods.goods_id GROUP BY code) as sec ON main.code=sec.code;