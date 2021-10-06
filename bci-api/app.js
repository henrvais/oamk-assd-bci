const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const app = express();
const port = process.env.PORT;

// Routes
const user_router = require('./router/user_router.js');
const item_router = require('./router/item_router.js');
const search_router = require('./router/search_router.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', user_router);
app.use('/item', item_router);
app.use('/search', search_router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;