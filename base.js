const PORT = process.env.PORT || 5000;
const Application = require('./Body_js/application')
const userRouter = require('./src/user_router')
const workjson = require('./Body_js/workjson')
const parsedUrl = require('./Body_js/parse_urk')

const app = new Application()

app.use(workjson);
app.use(parsedUrl('http://localhost:5000'));
app.addRouter(userRouter);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))