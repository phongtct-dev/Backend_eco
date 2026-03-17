const getallcustomers = require('./GET/getALLCustomers');
const togglestatus = require('./PATCH/toggleStatus');
const createemployee = require('./POST/createEmployee');

const  getinventorystats = require('./GET/getInventoryStats');
const getrevenuestats = require('./GET/getRevenueStats');

const getproductstats = require('./GET/getProductStats');

module.exports = {
        getallcustomers,
        togglestatus,
        createemployee,
        getinventorystats,
        getrevenuestats,
        getproductstats,

}