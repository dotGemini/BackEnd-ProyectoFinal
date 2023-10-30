import { Router } from "express";
import { createCart, getCart, addProductsToCart, emptyCart, addToCart, updateProductQuantity, removeFromCart } from "../controller/cartsController.js";
import { createTicket } from "../controller/ticketsController.js";
import { authToken } from "../utils.js";

const router = Router();

router.post('/', createCart);

router.get('/:cid', getCart);
router.put('/:cid', addProductsToCart);
router.delete('/:cid', emptyCart);

router.post('/:cid/product/:pid', authToken(['user', 'premium']),addToCart);
router.put('/:cid/product/:pid', authToken(['user', 'premium']),updateProductQuantity);
router.delete('/:cid/product/:pid', authToken(['user', 'premium']),removeFromCart);

router.post('/:cid/purchase', authToken(['user', 'premium']), createTicket);

export default router;