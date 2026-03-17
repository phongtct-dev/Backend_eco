const catchAsync = require("../../../utils/catchAsync");


module.exports = catchAsync(async (req, res, next) => {
    // req.user đã có sẵn nhờ middleware 'protect'
    res.status(200).json({
        success: true,
        data: req.user
    });
});

//product