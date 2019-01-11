module.exports = {
    mysql: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: proecss.env.DATABASE
    },
    jwtSecret: process.env.JWT_SECRET
};
