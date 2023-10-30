import { Router } from "express";
import { getProducts, getProductByID, addProduct, updateProduct, deleteProduct } from "../controller/productsController.js";
import { authToken } from "../utils.js";

const router = Router();

router.get('/', authToken(['admin', 'premium']), getProducts);
router.get('/:pid', getProductByID);
router.post('/', authToken(['admin', 'premium']),addProduct);
router.put('/:pid', authToken(['admin', 'premium']), updateProduct);
router.delete('/:pid', authToken(['admin', 'premium']), deleteProduct);

export default router;