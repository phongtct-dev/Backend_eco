const getallreviews = require('./GET/getAllReviews');
const getproductreviews = require('./GET/getProductReviews');
const togglereview = require('./PATCH/toggleReview');
const createreview = require('./POST/createReview');






module.exports = {
    getproductreviews,
    getallreviews,
    togglereview,
    createreview,
}