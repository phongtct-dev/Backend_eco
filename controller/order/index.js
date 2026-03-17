const createorder = require('./POST/createOrder');
const getmyorders = require('./GET/getMyOrders');
const getallorders = require('./GET/getAllOrders');
const getorderdetails = require('./GET/getOrderDetails');
const updateorderstatus = require('./PATCH/updateOrderStatus');






module.exports = {
    createorder,
    getmyorders,
    getallorders,
    getorderdetails,
    updateorderstatus,

}
