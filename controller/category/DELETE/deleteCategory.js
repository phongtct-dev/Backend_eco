const categoryServices = require('../../../services/categoryServices');
const catchAsync = require('../../../utils/catchAsync');
const sendResponse = require('../../../utils/sendResponse');


module.exports = catchAsync(async (req, res, next) => {
    await categoryServices.deleteCategory(req.params.id);
    sendResponse(res, 204, 'Xoa Thanh Cong', null);
});