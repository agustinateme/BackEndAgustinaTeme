import configs from "../config/config.js";

const persistence = configs.persistence;

let Carts;
let Products;
let Users;
let Tickets;

switch (persistence) {
    case "MONGO":
        console.log("Working with BDD");
        const mongoose = await import("mongoose");
        await mongoose.connect(configs.mongoUrl);

        const { default: UsersMongo } = await import("./mongo/users.mongo.js");
        Users = UsersMongo;

        const { default: ProductsMongo } = await import("./mongo/products.mongo.js");
        Products = ProductsMongo;

        const { default: CartsMongo } = await import("./mongo/carts.mongo.js");
        Carts = CartsMongo;

        const { default: TicketsMongo } = await import("./mongo/tickets.mongo.js");
        Tickets = TicketsMongo;

        break;
    
    case "MEMORY":
        console.log("Working with memory");

        const { default: UsersMemory } = await import("./memory/users.memory.js");
        Users = UsersMemory;

        const { default: ProductsMemory } = await import("./memory/products.memory.js");
        Products = ProductsMemory;

        const { default: CartsMemory } = await import("./memory/carts.memory.js");
        Carts = CartsMemory;

        const { default: TicketsMemory } = await import( "./memory/tickets.memory.js");
        Tickets = TicketsMemory;

        break;
    
    default:
}

export { Carts, Products, Users, Tickets };