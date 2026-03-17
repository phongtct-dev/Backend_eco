
const createvoucher = require('./POST/createVoucher');
const checkvoucher = require('./PATCH/checkVoucher');
const lockvoucher = require('./PATCH/lockVoucher');








module.exports = {
createvoucher,
checkvoucher,
lockvoucher
}

