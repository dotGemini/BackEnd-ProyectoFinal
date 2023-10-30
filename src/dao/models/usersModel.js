import mongoose from 'mongoose';

const collection = 'Users';

const schema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email:String,
    birth_date :Number,
    password: String,
    role: {
        type: String,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Carts",
        required: false,
    },
    documents: [{
        name: String,
        reference: String
    }],
    last_connection: {
        type: Date,
        required: false
    }
})

const userModel = mongoose.model(collection,schema);

export default userModel;