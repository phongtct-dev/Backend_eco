const categoryServices = require('../../../services/categoryServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');



// getOne.js
module.exports = catchAsync(async (req, res, next) => {
    const category = await categoryServices.getCategoryById(req.params.id);
    sendResponse(res, 200, 'Thành công', category);
});