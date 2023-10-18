// Load environment variables from .env file into process.env
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);
const { expect } = chai;

describe('HealthTestSuite - Checking Healthz API Endpoint', () => {
    it('TestIntegrationHealth - should respond 200 OK when DB is connected', async () => {
        const res = await chai.request(server).get('/healthz');
        expect(res).to.have.status(200);
        expect(res).to.have.header('cache-control', 'no-cache, no-store, must-revalidate');
    });
});
