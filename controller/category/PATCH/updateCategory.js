const categoryServices = require('../../../services/categoryServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');



module.exports = catchAsync(async (req, res, next) => {
    const result = await categoryServices.updateCategory(req.params.id, req.body, req.file);
    sendResponse(res, 200, 'Cập nhật thành công', result);
});