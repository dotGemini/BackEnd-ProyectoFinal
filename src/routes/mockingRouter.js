import { Router } from "express";
import {productsFaker} from '../controller/mockingController.js'

const router = Router();

router.get('/', productsFaker);

export default router;