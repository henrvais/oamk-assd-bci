const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const Item = require("../models/item.js");

// Post new item
router.post('/', auth, async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const location = req.body.location;
    const price = req.body.price;
    const date = req.body.date;
    const deliveryType = req.body.deliveryType;

    insertData = {
        "title": title,
        "description": description,
        "category": category,
        "location": location,
        "price": price,
        "date": date,
        "deliveryType": deliveryType
    }

    itemData = await Item.add(
        req.user.userId,
        insertData
    )
    if(itemData.status == 200){
        res.status(200).send(
            {
                "itemId" : itemData.itemId.toString()
            }
        );
    } else {
        res.status(itemData.status).send(
            {
                "message": itemData.message
            }
        );
    }
    /*
    o	Title
    o	Description
    o	Category (clothing, cars etc.)
    o	Location (city, county etc.)
    o	Images (max 4)
    o	Asking price
    o	Date of posting
    o	Delivery type: 
        	Shipping
        	Pickup
    o	Seller’s name and contact information

    */
});

// Edit item
router.put('/', auth, async (req, res) => {
    const itemData = await Item.edit(
        req.user.userId,
        req.body
    )
    if(itemData.status == 200){
        res.status(200).send(itemData.message);
    } else {
        res.status(itemData.status).send(itemData.message);
    }
})

// Delete item
router.delete('/', auth, async (req, res) => {
    const itemId = req.body.itemId;
    const itemData = await Item.delete(
        req.user.userId,
        itemId
    )
    console.log(itemData);
    if(itemData.status == 200){
        res.status(200).send(
            {
                "message": itemData.message
            }
        )
    } else {
        res.status(400).send(
            {
                "message": itemData.message
            }
        )
    }
});

module.exports = router;