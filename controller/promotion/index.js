const setpromotion = require('./PATCH/setPromotion');
const stoppromotion = require('./DELETE/stopPromotion');
const getallpromotions = require('./GET/getAllPromotions');

module.exports = {
    setpromotion,
    stoppromotion,
    getallpromotions
}