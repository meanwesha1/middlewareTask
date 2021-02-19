
//example application of the middleware package in an Express API.

const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {validateInput} = require('./middlewares/valM')
const Data = require('./models/data')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/data', 
	validateInput(),
	(req, res, next)=>{
		const data = new Data(req.body.data)
		data.save()
		.then((returnv)=>res.status(201).send(returnv))
		.catch(next)		
	}
)

app.listen(3000, () => {
	console.log('Server is up on port 3000.')
	mongoose.connect('mongodb://localhost:27017/data', {
	useNewUrlParser:true,
	useCreateIndex:true,
	useFindAndModify:false,
	useUnifiedTopology: true
	})
	.then( ()=>console.log('DB connection successful') )
	.catch( (err)=> console.log(error) )
});