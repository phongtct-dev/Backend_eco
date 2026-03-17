const categoryServices = require('../../../services/categoryServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');

module.exports = catchAsync(async (req, res, next) => {
    const result = await categoryServices.createCategory(req.body, req.file);
    sendResponse(res, 201, 'Tạo danh mục thành công', result);
});