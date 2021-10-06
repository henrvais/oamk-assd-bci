const pool = require("../config/db.js");

module.exports = {
    async add(userId, itemData){
        data = {
            "status": 400,
            "message": "Unknown error",
            "itemId": null
        }
        try {
            const conn = await pool.getConnection();
            const insertItem = await conn.query(
                "INSERT INTO `items`(`userId`,`title`,`description`,`category`,`location`,`price`,`deliveryType`) VALUES(?,?,?,?,?,?,?)",
                [
                    userId,
                    itemData.title,
                    itemData.description,
                    itemData.category,
                    itemData.location,
                    itemData.price,
                    itemData.deliveryType
                ]
            );
            if(insertItem.affectedRows == 1){
                data.status = 200;
                data.itemId = insertItem.insertId;
            }
        } catch (err) {
            throw err;
        }
        return data;
    },

    async delete(userId, itemId){
        data = {
            "status": 400,
            "message": "Unknown error"
        }
        try {
            const conn = await pool.getConnection();
            const deleteItem = await conn.query(
                "DELETE FROM `items` WHERE `userId`=? AND `id`=?",
                [
                    userId,
                    itemId
                ]
            )
            if(deleteItem.affectedRows == 1){
                data.status = 200;
                data.message = "Item " + itemId.toString() + " deleted";
            } else {
                data.status = 404;
                data.message = "Item was not found";
            }
        } catch (err) {
            throw err;
        }
        return data;
    },

    async edit(userId, values){
        data = {
            "status": 400,
            "message": "Unknown error"
        }
        const allowed = [
            "title",
            "description",
            "category",
            "location",
            "price"
        ]
        conditions = "";
        skipAnd = true;
        for (const [key, value] of Object.entries(values)) {
            if(allowed.includes(key)){
                if(skipAnd == false){
                    conditions += ",";
                }
                conditions += " `" + key + "`='" + value + "'";
                skipAnd = false;
            }
        }
        if(conditions !== ""){
            sql = "UPDATE `items` SET " + conditions + " WHERE `userId`=? AND `id`=?"
            try {
                const conn = await pool.getConnection();
                const updateItem = await conn.query(
                    sql,
                    [
                        userId,
                        values.itemId
                    ]
                )
                if(updateItem.affectedRows == 1){
                    data.status = 200;
                    data.message = "Item " + values.itemId.toString() + " updated";
                } else {
                    data.status = 404;
                    data.message = "Item was not found";
                }
            } catch (err) {
                throw err;
            }
        }
        return data;
    },

    async listAll(){
        data = {
            'status': 400,
            'list': null
        }
        try {
            const conn = await pool.getConnection();
            listItems = await conn.query(
                "SELECT `items`.*, `users`.firstname, users.lastname, users.phone, users.username FROM `items` LEFT JOIN `users` ON items.userId = users.id"
            )
            data.status = 200
            data.list = listItems;
        } catch (err){
            throw err;
        }
        return data;
    },

    async listByCategory(category){
        data = {
            "status": 400,
            "list": null
        }
        try {
            const conn = await pool.getConnection();
            listItems = await conn.query(
                "SELECT `items`.*, `users`.firstname, users.lastname, users.phone, users.username FROM `items` LEFT JOIN `users` ON items.userId = users.id WHERE `category`=?",
                category
            )
            data.status = 200
            data.list = listItems;
        } catch (err){
            throw err;
        }
        return data;
    },

    async listByLocation(location){
        data = {
            "status": 400,
            "list": null
        }
        try {
            const conn = await pool.getConnection();
            listItems = await conn.query(
                "SELECT `items`.*, `users`.firstname, users.lastname, users.phone, users.username FROM `items` LEFT JOIN `users` ON items.userId = users.id WHERE `location`=?",
                location
            )
            data.status = 200
            data.list = listItems;
        } catch (err){
            throw err;
        }
        return data;
    },

    async listByDate(values){
        data = {
            "status": 404,
            "list": null
        }
        condition = "";
        if("startDate" in values && "endDate" in values){
            condition += " `items`.`timestamp` >= '" + values.startDate + "' AND `items`.`timestamp` <= '" + values.endDate + "'";
        } else {
            if("startDate" in values){
                condition += " `items`.`timestamp` >= '" + values.startDate + "'";
            } else if ("endDate" in values){
                condition += " `items`.`timestamp` <= '" + values.endDate + "'";
            }
        }
        if(condition !== ""){
            sql = "SELECT `items`.*, `users`.firstname, users.lastname, users.phone, users.username FROM `items` LEFT JOIN `users` ON items.userId = users.id WHERE" + condition;
            try {
                const conn = await pool.getConnection();
                listItems = await conn.query(
                    sql
                )
                data.status = 200
                data.list = listItems;
            } catch (err){
                throw err;
            }
        }
        return data;
    }
};