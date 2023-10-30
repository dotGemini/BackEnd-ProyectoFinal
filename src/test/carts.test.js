import chai from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import config from "../config/config.js";

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

mongoose.connect(`mongodb+srv://${config.admin}:${config.password}@clusterprueba.g12vkb7.mongodb.net/supertest`)

describe('Test de Carts router', () => {

    before(async () => {
        mongoose.connection.collections.users.drop();
    });

    it('El endpoint POST /api/carts debe crear un nuevo carrito', async () => {
        const{statusCode, ok} = await requester.post('/api/carts');
        expect(statusCode).to.equal(200);
        expect(ok).to.equal(true)
    })

    it('El endpoint GET /api/carts/:cid debe devolver el carrito correctamente', async () => {
        const{_body} = await requester.post('/api/carts');
        const id = _body.payload._id;
        const {statusCode, ok} = await requester.get(`/api/carts/${id}`);
        expect(statusCode).to.equal(200);
        expect(ok).to.equal(true);
    })

    it('El endpoint DELETE /api/cart/:cid debe vaciar el carrito', async () => {
        const{_body} = await requester.post('/api/carts');
        const id = _body.payload._id;
        const {statusCode, ok} = await requester.delete(`/api/carts/${id}`);
        expect(statusCode).to.equal(200);
        expect(ok).to.equal(true);
        const {_body: deletedCart} = await requester.get(`/api/carts/${id}`);
        expect(deletedCart.payload).to.equal(null)
    })

    after(async () => {
        mongoose.connection.collections.users.drop();
    });
})