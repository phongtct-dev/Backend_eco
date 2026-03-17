const categoryServices = require('../../../services/categoryServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');



// getAll.js
module.exports = catchAsync(async (req, res, next) => {
    const categories = await categoryServices.getAllCategories();
    sendResponse(res, 200, 'Thành công', { results: categories.length, categories });
});
