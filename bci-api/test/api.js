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
    const password = 'testpass321'
    var token = null;

    // Test user creation
    describe('POST /user',  () => {
        it('Creates new user', (done) => {
            chai.request(server)
                .post("/user")
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(
                    {
                        firstname: firstname,
                        lastname: lastname,
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
                .set('content-type', 'application/x-www-form-urlencoded')
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

    // Test posting new item
    describe('POST /item', () => {
        it('Posts new item', (done) => {
            chai.request(server)
                .post('/item')
                .set('content-type', 'application/x-www-form-urlencoded')
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
});