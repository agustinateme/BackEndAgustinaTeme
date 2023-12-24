import ticketModel from '../dbManagers/models/tickets.models.js';

export default class Ticket {
    save = async (ticket) => {
        return await ticketModel.create(ticket);
    }
}