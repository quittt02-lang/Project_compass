const PORT = process.env.PORT || 5000;
const Application = require('./Body_js/application');
const userRouter = require('./src/user_router');
const workjson = require('./Body_js/workjson');
const parsedUrl = require('./Body_js/parse_urk');
const mongoose = require('mongoose');

const app = new Application();

app.use(workjson);

app.use(parsedUrl('http://localhost:5000'));

app.addRouter(userRouter);

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:12345@cluster0.xsyuasu.mongodb.net/?appName=Cluster0') 
        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
    } catch(e){
        console.log(e)
    }
}
start()