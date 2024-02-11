import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

after(async function () {
    const result = await requester.delete("/api/cart")
    expect(result.statusCode).eql(200)
})


describe("Testing del módulo de carts", () => {
    let mockCart = {
        owner: "adminCoder@coder.com"
    }

    it("GET /api/cart/:cid : Devuelve un cart", async () => {
        const { statusCode, ok, _body } = await requester.post("/api/cart").send(mockCart)
        expect(statusCode).eql(200)

        let result = await requester.get(`/api/cart/${_body.payload._id}`)
        expect(result.statusCode).eql(200)
        expect(result._body).to.have.property("payload")
    })

    it("POST /api/cart: Crea un carrito", async () => {
        const { statusCode, ok, _body } = await requester.post("/api/cart").send(mockCart)

        expect(statusCode).eql(200)
        expect(_body).to.have.property("payload")
        expect(_body.payload.products_list).to.be.an('array')
    })
})