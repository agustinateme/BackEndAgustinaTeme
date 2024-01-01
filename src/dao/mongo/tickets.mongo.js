import ticketsModel from '../mongo/models/tickets.models.js';

export default class Ticket {
    save = async (ticket) => {
        return await ticketsModel.create(ticket);
    }
}