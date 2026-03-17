const createcategory = require('./POST/createCategory');
const getallcategories = require('./GET/getAllCategory');
const getcategory = require('./GET/getOneCategory');
const updatecategory = require('./PATCH/updateCategory');
const deletecategory = require('./DELETE/deleteCategory');



module.exports = {
    createcategory,
    getallcategories,
    getcategory,
    updatecategory,
    deletecategory
}