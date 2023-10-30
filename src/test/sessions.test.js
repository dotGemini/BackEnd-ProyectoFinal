import chai from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import config from "../config/config.js";

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

mongoose.connect(`mongodb+srv://${config.admin}:${config.password}@clusterprueba.g12vkb7.mongodb.net/supertest`)

describe("Test de sessionsRouter", () => {

    let cookie;

    before(async () => {
        mongoose.connection.collections.users.drop();
    });

    it("Se debe registrar correctamente el usuario", async () => {
        const mockUser ={ 
            first_name: "Diego",
            last_name: "R",
            email: "prueba1@coder.com",
            age: 25,
            password: "123456"
            }
            
        const {_body} = await requester.post('/api/sessions/register').send(mockUser);
        expect(_body.payload).to.be.ok;
    })

    it("Debe Loguear cirrectamente el usuario y devolver una cookie", async () => {
        const mockUser= {
            email: "prueba1@coder.com",
            password: "123456"
        };

        const result = await requester.post("/api/sessions/login").send(mockUser);
        const cookieResult = result.headers["set-cookie"][0];

        expect(cookieResult).to.be.ok
         cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1]
            }
        expect(cookie.name).to.be.ok.and.eql("coderCookie")
        expect(cookie.value).to.be.ok
    })
})