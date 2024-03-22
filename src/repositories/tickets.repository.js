import { aTickets as TicketsDao } from "../dao/factory.js";

export default class TicketRepository {
    constructor() {
        this.dao = new TicketsDao()
    }

    save = async (ticket) => {
        const result = await this.dao.save(ticket);
        return result;
    }
}