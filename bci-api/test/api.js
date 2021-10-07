const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.use(chaiHttp);

describe('Test REST endpoints', () =>{
    const time = new Date().toISOString();
    const firstname = 'Tester';
    const lastname = 'Testing';
    const username = `test${time}`;
    const password = 'testpass321';
    const phone = '0401231234';
    const itemLocation = 'oulu';
    const itemCategory = 'cars';
    var token = null;

    // Test user creation
    describe('POST /user',  () => {
        it('Creates new user', (done) => {
            chai.request(server)
                .post("/user")
                .set('content-type', 'application/json')
                .send(
                    {
                        firstname: firstname,
                        lastName: lastname,
                        userName: username,
                        password: password,
                        phone: phone
                    }
                )
                .end((error, response) => {
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.keys(['token']);
                    if (error) {
                        done(error);
                    } else {
                        done();
                    }
                });
        });
    });

    // Test login
    describe('POST /user/login', () => {
        it('Logins user and receive JWT', (done) => {
            chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/json')
                .send(
                    {
                        username: username,
                        password: password
                    }
                )
                .end((error, response) => {
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.keys(['token']);
                    if (error) {
                        done(error);
                    } else {
                        token = response.body.token;
                        done();
                    }
                });
        });
    });

    var itemId = null;

    // Test posting new item
    describe('POST /item', () => {
        it('Posts new item', (done) => {
            chai.request(server)
                .post('/item')
                .set('content-type', 'application/json')
                .set({"Authorization": `Bearer ${token}`})
                .send(
                    {
                        title: 'title',
                        description: 'description',
                        deliveryType: 2,
                        price: 19.10,
                        location: 'Oulu',
                        category: 'luokka'
                    }
                )
                .end((error, response) => {
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.keys(['itemId']);
                    if (error) {
                        done(error);
                    } else {
                        itemId = response.body.itemId;
                        done();
                    }
                });
        });
    });

    // Test editing item
    describe('PUT /item', () => {
        it('Edits item', (done) => {
            chai.request(server)
                .put('/item')
                .set('content-type', 'application/json')
                .set({"Authorization": `Bearer ${token}`})
                .send(
                    {
                        itemId: itemId,
                        title: 'title',
                        description: 'description',
                        deliveryType: 2,
                        price: 19.10,
                        location: itemLocation,
                        category: itemCategory
                    }
                )
                .end((error, response) => {
                    expect(response.status).to.equal(200);
                    if (error) {
                        done(error);
                    } else {
                        done();
                    }
                });
        });
    });

    // Test listing all items
    describe('GET /search', () => {
        it('Lists all items', (done) => {
            chai.request(server)
                .get('/search')
                .end((error, response) => {
                    expect(response.status).to.equal(200);
                    if (error) {
                        done(error);
                    } else {
                        done();
                    }
                });
        });
    });

    // Test listing items by location
    describe('GET /search/location/:location', () => {
        it('Lists items by location', (done) => {
            chai.request(server)
                .get(`/search/location/${itemLocation}`)
                .end((error, response) => {
                    expect(response.status).to.equal(200);
                    if (error) {
                        done(error);
                    } else {
                        done();
                    }
                });
        });
    });

    // Test listing items by category
    describe('GET /search/category/:category', () => {
        it('Lists items by category', (done) => {
            chai.request(server)
                .get(`/search/category/${itemCategory}}`)
                .end((error, response) => {
                    expect(response.status).to.equal(200);
                    if (error) {
                        done(error);
                    } else {
                        done();
                    }
                });
        });
    });

    // Test listing items by date
    describe('GET /search/date', () => {
        it('Lists items by date', (done) => {
            chai.request(server)
                .get('/search/date')
                .query({startDate: '01.01.2000', endDate: '01.01.2040'})
                .end((error, response) => {
                    expect(response.status).to.equal(200);
                    if (error) {
                        done(error);
                    } else {
                        done();
                    }
                });
        });
    });

    // Test deleting item
    describe('DELETE /item', () => {
        it('Deletes the item', (done) => {
            chai.request(server)
                .delete('/item')
                .set('content-type', 'application/json')
                .set({"Authorization": `Bearer ${token}`})
                .send(
                    {
                        itemId: itemId
                    }
                )
                .end((error, response) => {
                    expect(response.status).to.equal(200);
                    if (error) {
                        done(error);
                    } else {
                        done();
                    }
                });
        });
    });
});