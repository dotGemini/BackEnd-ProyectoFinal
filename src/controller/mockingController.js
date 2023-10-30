import { generateProductsFaker } from "../utils.js";

export const productsFaker = async (req, res) => {
    res.send(generateProductsFaker());
}