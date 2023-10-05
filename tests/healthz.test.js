//Load Environment files
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);
const { expect } = chai;

describe('Health Test - validate /healthz API Endpoint', () => {
    it('Integration Test - should respond 200 OK when DB is connected', async () => {
        const res = await chai.request(server).get('/healthz');
        expect(res).to.have.status(200);
        expect(res).to.have.header('Cache-Control', 'no-cache');
    });

});