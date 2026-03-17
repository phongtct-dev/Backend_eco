const createproduct = require('./POST/createProduct');
const getallproduct = require('./GET/getALLProduct');
const getproduct = require('./GET/getOneProduct');
const updateproduct = require('./PATCH/updateProduct');
const deleteproduct = require('./DELETE/deleteProduct');



module.exports = {
    createproduct,
    getallproduct,
    getproduct,
    updateproduct,
    deleteproduct
}