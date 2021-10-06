const express = require('express');
const router = express.Router();
const Item = require("../models/item.js");
const { route } = require('./item_router.js');


router.get("/", async(req, res) => {

});

router.get("/date", async (req, res) => {
    values = {}
    if(req.query.startDate){
        values.startDate = req.query.startDate;
    }
    if(req.query.endDate){
        values.endDate = req.query.endDate;
    }
    listData = await Item.listByDate(values);
    if(listData.status == 200){
        res.status(200).send(listData.list);
    } else {
        res.status(listData.status).send(listData.message);
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