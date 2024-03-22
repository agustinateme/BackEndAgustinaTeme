import configs from "../config/config.js";

const persistance = configs.persistance;
console.log(persistance);

let aProducts, aCarts, aMessages, aUsers, aTickets

switch (persistance) {
    case 'MONGO':
        console.log("Trabajando con BD Mongo")
        const mongoose = await import('mongoose')
        const MongoStore = await import("connect-mongo")
        try {
            await mongoose.connect(configs.mongoUrl)
            const { default: Products } = await import('./dbManagers/products.managers.js')
            const { default: Carts } = await import('./dbManagers/carts.managers.js')
            const { default: Users } = await import('./dbManagers/user.managers.js')
            const { default: Messages } = await import('./dbManagers/messages.manager.js')
            const { default: Ticket } = await import('./dbManagers/tickets.manager.js')

            aProducts = Products
            aCarts = Carts
            aUsers = Users
            aMessages = Messages
            aTickets = Ticket 

        } catch (error) {
            console.log(error.message)
            mongoose.disconnect()
        }
        break
    case 'FILE':
        console.log("Trabajando con archivos")
        const { default: CartManager } = await import('./fileManagers/managers/CartManagers.js')
        const { default: ProductManager } = await import('./fileManagers/managers/ProductManagers.js')
        aProducts = ProductManager
        aCarts = CartManager
        break
}

export {
    aProducts,
    aCarts,
    aUsers,
    aMessages,
    aTickets
}