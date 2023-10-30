import chai from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import config from "../config/config.js";

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

mongoose.connect(`mongodb+srv://${config.admin}:${config.password}@clusterprueba.g12vkb7.mongodb.net/supertest`)

describe('Test de Products Router', () => {

    before(async () => {
        mongoose.connection.collections.users.drop();
    });

    it('El endpoint GET /api/products debe entregar todos los productos', async () => {
        const {statusCode, ok, _body} = await requester.get('/api/products');
        expect(statusCode).to.equal(400);
        expect(ok).to.equal(true);
        expect(_body).to.have.property('payload');
        expect(_body.payload).to.be.an('array');
    })

    it('El endpoint POST /api/products/ debe crear el producto satisfactoriamente', async () => {
        const prodMock = {
            title: "Test1",
            description: "prueba SuperTest",
            code: "test001",
            price: 100,
            stock: 10,
            category: "Test",
        };
        const {statusCode, ok} = (await requester.post('/api/products')).send(prodMock);
        expect(statusCode).to.equal(400);
        expect(ok).to.equal(false);
    })

    it('El endpoint DELETE /api/products/:pid debe borrar el producto correctamente', async () => {
        const prodMock = {
            title: "Test1",
            description: "prueba SuperTest",
            code: "test001",
            price: 100,
            stock: 10,
            category: "Test",
        };

        const {_body} = (await requester.post('/api/products')).send(prodMock);
        const id = _body.payload._id;
        const {statusCode, ok} = await requester.delete(`/api/products/${id}`);
        expect(statusCode).to.equal(200);
        expect(ok).to.equal(true);
        const {_body: deletedProd } = await requester.get(`/api/products/${id}`)
        expect(deletedProd.payload).to.equal(null)
    })

    after(async () => {
        mongoose.connection.collections.users.drop();
    });
})