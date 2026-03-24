
const createvoucher = require('./POST/createVoucher');
const checkvoucher = require('./PATCH/checkVoucher');
const lockvoucher = require('./PATCH/lockVoucher');
const getallvouchers = require('./GET/getAllVouchers');







module.exports = {
createvoucher,
checkvoucher,
lockvoucher,
getallvouchers
}

