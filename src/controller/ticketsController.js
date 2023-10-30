import { TicketsService } from "../services/ticketsService.js";

const ticketsService = new TicketsService();

export const createTicket = async (req, res) => {
    const cartID = req.params.cid;
    const email = req.user.email;
    const ticket = await ticketsService.createTicket(cartID, email)
    res.send(ticket)
}