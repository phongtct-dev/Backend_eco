
const connectDB = require('./config/db');
const app = require('./app')



  

connectDB();

app.get('/',(req,res)  => {
    res.json({message: 'Chao , day den tu sever!'});
})


app.listen(process.env.PORT, () => {
    console.log(`listening...${process.env.NODE_ENV} ... ... ...`);
    
})