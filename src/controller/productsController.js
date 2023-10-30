import { ProductsService } from "../services/productService.js"
import {generateProductAddError} from "../services/errors/info.js"
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js"

const prodService = new ProductsService();

export const getProducts = async (req, res) =>{
    const {limit} = parseInt(req.query);
    const page = req.query.page;
    const sort = req.query.sort;
    const query = req.query.query;
    const prod = await prodService.getProducts(limit, page, sort, query);
    res.send(prod);
} 

export const getProductByID = async (req, res) => {
    const prodID = req.params.pid
    const prod = await prodService.getProductByID(prodID);
    console.log(prod)
    res.send(prod);
}

export const addProduct = async (req, res) => {
    let body = req.body;
    let owner = req.user.email

    let newProd = {...body, owner}
    let addProduct = await prodService.addProduct(newProd);

    if(addProduct){
        res.status(200).send(addProduct)
    } else {
        CustomError.createError({
            name: "Request error",
            cause: generateProductAddError(),
            code: EErrors.INVALID_TYPES_ERROR,
            message: "Fail to add product."
        })
    }
}

export const updateProduct = async (req, res) => {
    const prodID = req.params.pid;
    const newObject = req.body;

    res.send(await prodService.updateProduct(prodID, newObject));
}

export const deleteProduct = async (req, res) => {
    res.send(await prodService.deleteProduct(req.params.pid, req.session.user.email))
}