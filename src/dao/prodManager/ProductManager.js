import ProductsModel from "../models/productsModel.js";
import UsersModel from "../models/usersModel.js";
import config from "../../config/config.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: config.mailing.auth.user,
        pass: config.mailing.auth.pass
    }
});

export default class ProductManager{

    constructor(){
        this.productsModel = ProductsModel;
        this.usersModel = UsersModel;
    }

    addProduct = async (newField) => {
        try {
            const newProduct = await this.productsModel.create(newField);
            return newProduct;
        } catch (error){
            throw new Error(error.message)
        }
    }

    updateProduct = async(productID, updateFields) => {
        console.log(updateFields)
        try {
            const {code, price, stock, url, ...otherFields} = updateFields;

            if(code) {
                const existProduct = await this.productsModel.findOne({code:code});
                if (existProduct && existProduct._id.toString() !== productID) {
                    throw new Error('Codigo ya utilizado')
                }
            }
            const updateProduct = await this.productsModel.findByIdAndUpdate(
                productID, updateFields
            );
            
            if(!updateProduct){
                throw new Error('No encontrado')
            }
            return updateProduct;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    deleteProduct = async(productID, email) => {
        try {
            const prod = this.getProductByID(productID);
            const isPremium = await this.usersModel.find(email);
            if(prod.owner === email){
                const product = await this.productsModel.findByIdAndDelete(productID);
                if(!product){
                    throw new Error('No encontrado');
                }
            }

            if(isPremium === 'premium'){
                const mailOptions = {
                    from: 'your_email@gmail.com',
                    to: prod.owner,
                    subject: 'Product Deleted',
                    text: `Your product ${prod.name} has been deleted.`
                };
                await transporter.sendMail(mailOptions);
            }
            
        } catch (error) {
            throw new Error (`${error.message}`);
        }
    }

    getProducts = async (limit, page, sort, query) => {
        try {

            const products = await this.productsModel.paginate(
                {query}, {
                    limit: limit || 5,
                    page : page || 1,
                    sort: sort === "asc" ? {price : 1} : sort === "desc" ? {price: -1} : undefined,
            });

            return products;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    getProductByID = async (productID) => {
        try{
            const product = await this.productsModel.findById(productID);
            if(!product){
                throw new Error(`Producto no encontrado`);
            }
            return product;
        } catch (error) {
            throw new Error ( `${error.message}`);
        }
    }
}

export { ProductManager }
