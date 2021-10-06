const express = require('express');
const router = express.Router();
const Item = require("../models/item.js");
const { route } = require('./item_router.js');


router.get("/", async(req, res) => {
    listData = await Item.listAll();
    if(listData.status == 200){
        res.status(200).send(listData.list);
    } else {
        res.sendStatus(listData.status);
    }
});

router.get("/date", async (req, res) => {
    values = {}
    if(req.query.startDate){
        start = new Date(req.query.startDate).toISOString().substr(0,10);
        values.startDate = start;
    }
    if(req.query.endDate){
        end = new Date(req.query.endDate).toISOString().substr(0,10);
        values.endDate = end;
    }
    if(Object.keys(values).length === 0){
        res.sendStatus(400);
    } else {
        listData = await Item.listByDate(values);
        if(listData.status == 200){
            res.status(200).send(listData.list);
        } else {
            res.status(listData.status).send(listData.message);
        }
    }
});

router.get("/category/:category", async (req, res) => {
    listData = await Item.listByCategory(req.params.category);
    if(listData.status == 200){
        res.status(200).send(listData.list);
    } else {
        res.status(listData.status).send(listData.message);
    }
});

router.get("/location/:location", async (req, res) => {
    listData = await Item.listByLocation(req.params.location);
    if(listData.status == 200){
        res.status(200).send(listData.list);
    } else {
        res.status(listData.status).send(listData.message);
    }
    res.send(listData);
});

module.exports = router;