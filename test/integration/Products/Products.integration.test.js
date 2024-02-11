import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

after(async function () {
    const result = await requester.delete("/api/products")
    expect(result.statusCode).eql(200)
})


describe("Testing productos", () => {

    it("POST /api/products : Crea un producto.", async () => {
        const { statusCode, ok, _body } = await requester.post("/api/products")
            .set('Cookie', [`${cookie.name} = ${cookie.value}`])
            .send(mockProduct)

        expect(_body.payload).to.be.an('object')
    })

    it("DELETE /api/products/:pid : Elimina un producto", async () => {
        const { statusCode, ok, _body } = await requester.post("/api/products")
            .set('Cookie', [`${cookie.name} = ${cookie.value}`])
            .send(mockProduct)

        const result = await requester.delete(`/api/products/${_body.payload._id}`)
            .set('Cookie', [`${cookie.name} = ${cookie.value}`])

        expect(result.statusCode).eql(200)
        expect(result._body.payload.deletedCount).eql(1)
    })

    it("GET /api/products : Devuelve la lista de productos", async () => {
        const result = await requester.get("/api/products")

        expect(result.statusCode).to.equal(200)
        expect(result._body).to.have.property('payload')
        expect(result._body.payload.docs).to.be.an('array')
    })
})