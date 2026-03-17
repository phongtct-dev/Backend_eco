const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Da ket noi den MongoDB thanh cong!!!');
    } catch (error) {
         console.error('Loi ket noi den MongoDb:', error);
    process.exit(1);
    }
}

module.exports = connectDB;