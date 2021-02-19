const Joi = require('joi')
const request = require('request');
const {toJson} = require('json-joi-converter')

var input = {
	'data': {
		'username': 'anwesha115',
		'dob': {'date': 15, 'month': 7, 'year': 1994},
		'contactnumber':	{'countrycode':'RU', 'phonenumber':'8005553535'},
		'email': 'anwesha.ghosh@gmail.com',
		'pswd': 'abcC_3',
		'address': {
			'country': 'India',
			'state': 'Karnataka',
			'city': 'Bangalore',
			'road': 'Neeladri Road',
			'buildingNo': '24A'		
		}		
	},
	'schema': toJson(
		Joi.object({
			address: Joi.object({
				country: Joi.string(),
				state: Joi.string(),
				city: Joi.string(),
				road: Joi.string(),
				buildingNo: Joi.string()
					.alphanum()
			}),
			dob: Joi.object({
				date: Joi.number()
					.integer()
					.min(1)
					.max(31),
				month: Joi.number()
					.integer()
					.min(1)
					.max(12),
				year: Joi.number()
					.integer()
					.max(1993),
			})
		})
	)	
}

request.post({url: 'http://localhost:3000/data', json:input}, function(error, response, body){
	if (error) {
		console.log(error);
	} else{
		console.log(response.body);
	}
});