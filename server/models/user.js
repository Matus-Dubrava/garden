const bcrypt = require('bcrypt-nodejs');

const conn = require('../services/database');

const hashPassword = password => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt, null);
    return hash;
};

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    saveUser() {
        return conn.then(connection => {
            const hash = hashPassword(this.password);
            return connection.query(
                `INSERT user (username, password) VALUES ("${
                    this.username
                }", "${hash}")`
            );
        });
    }

    static getUser(username) {
        return conn.then(connection => {
            return connection
                .query(`SELECT * FROM user WHERE username="${username}"`)
                .then(rows => {
                    if (rows.length) {
                        return new User(username, rows[0].password);
                    } else {
                        return null;
                    }
                });
        });
    }

    verifyPassword(candidatePassword) {
        const isMatch = bcrypt.compareSync(candidatePassword, this.password);
        return isMatch;
    }
}

module.exports = User;
