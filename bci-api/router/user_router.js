const express = require('express');
const router = express.Router();
const User = require('../models/user.js')

// Create user, return jwt
router.post('/', async function(req, res){
   res.setHeader('Content-Type', 'application/json');
   const firstname = req.body.firstname;
   const lastname = req.body.lastname;
   const username = req.body.username;
   const password = req.body.password;
   const phone = req.body.phone;
   if(
      !(firstname && lastname && username && password && phone) || 
      firstname.length > 32 || lastname.length > 32 || username.length > 32 ||
      password.length > 64 || phone.length > 16 
   ){
      res.sendStatus(400);
   } else {
      userData = await User.create(
         firstname,
         lastname,
         username,
         password
      )
      if(userData.status == 200){
         res.status(200).send(
            {
               'token': userData.user.token
            }
         );
      } else {
         res.sendStatus(userData.status);
      }
   }
});

router.post('/login', async function(req, res){
   res.setHeader('Content-Type', 'application/json');
   const username = req.body.username;
   const password = req.body.password;
   if (!(username && password) || username.length > 32 || password.length > 64) {
      res.sendStatus(400);
   } else {
      loginData = await User.login(
         username,
         password
      )
      if(loginData.status == 200){
         res.status(200).send(
            {
               'token': loginData.token
            }
         );
      } else {
         res.sendStatus(loginData.status);
      }
   }
});

module.exports = router;