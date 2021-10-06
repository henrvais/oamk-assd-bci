const pool = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    async create(firstname, lastname, username, password){
        data = {
            'status': 400,
            'user': {}
        }
        try {
            const conn = await pool.getConnection();
            sqlQuery = "SELECT `username` FROM `users` WHERE `username`=?";
            const userExists = await conn.query(
                sqlQuery, 
                username.toLowerCase()
            );
            if(userExists[0] == null){
                encryptedPassword = await bcrypt.hash(password, 10);
                sqlInsert = "INSERT INTO `users`(`firstname`,`lastname`,`username`,`secret`) VALUES (?,?,?,?)";
                const insertQuery = await conn.query(
                    sqlInsert,
                    [
                        firstname,
                        lastname,
                        username.toLowerCase(),
                        encryptedPassword
                    ]
                );
                if("insertId" in insertQuery){
                    const token = jwt.sign(
                        {
                            userId: insertQuery.insertId, username
                        },
                        process.env.TOKEN_SECRET,
                        {
                            expiresIn: "2h",
                        }
                    );
                    const updateToken = await conn.query(
                        "UPDATE `users` SET `token`=? WHERE `id`=?",
                        [
                            token,
                            parseInt(insertQuery.insertId)
                        ]
                    )
                    data.user.id = insertQuery.insertId;
                    data.user.firstname = firstname;
                    data.user.lastname = lastname;
                    data.user.username = username.toLowerCase();
                    data.user.token = token;
                }
                data.status = 200;
            }
            conn.end();
        } catch(err) {
            throw err;
        }
        return data;
    },

    async login(username, password){
        data = {
            'status': 400,
            'token': null
        }
        try {
            const conn = await pool.getConnection();
            const verifyUser = await conn.query(
                "SELECT `id`,`username`,`secret` FROM `users` WHERE `username`=?",
                username
            )
            if(
                (verifyUser[0] != null) && 
                (await bcrypt.compare(password, verifyUser[0].secret))
            ){
                const token = jwt.sign(
                    {
                        userId: verifyUser[0].id,
                        username: verifyUser.username
                    },
                    process.env.TOKEN_SECRET,
                    {
                        expiresIn: "2h",
                    }
                );
                const updateToken = await conn.query(
                    "UPDATE `users` SET `token`=? WHERE `id`=?",
                    [token, verifyUser[0].id]
                )
                if(updateToken.affectedRows == 1){
                    data.token = token;
                    data.status = 200;
                }
            } else {
                data.message = "Invalid username or password";
            }
            conn.end();
        } catch (err) {
            throw err;
        }
        return data;
    }
}; 