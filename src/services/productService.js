import ProductManager from "../dao/prodManager/ProductManager.js";

export class ProductsService {
    constructor() {
        this.prodDao = new ProductManager();
    }

    async getProducts(limit, page, sort, query){
        return await this.prodDao.getProducts (limit, page, sort, query);
    }

    async getProductByID(id) {
        const prodID = await this.prodDao.getProductByID(id)
        return prodID;
    }

    async addProduct(body) {
        return await this.prodDao.addProduct(body);
    }

    async updateProduct(prodID, newObject){
        return await this.prodDao.updateProduct(prodID, newObject);
    }

    async deleteProduct(id, email) {
        return await  this.prodDao.deleteProduct(id, email);
    }
}