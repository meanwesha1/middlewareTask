
const fnValidator = require( 'awesome-phonenumber' )
const {fromJson} = require('json-joi-converter')
const Joi = require('joi');
const { Validator } = require('format-utils');

var baseSchema = Joi.object({
	fullname: Joi.object({
		firstname: Joi.string()
			.min(5)
			.max(30),
		lastname: Joi.string()
			.min(5)	
			.max(30)
	}),
    username: Joi.string()
        .alphanum()
        .min(5)
        .max(30),
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
			.integer(),
	}),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    pswd: Joi.string()
        .pattern(new RegExp('^\\w{6,12}$')),	
	contactnumber: Joi.object({
		countrycode: Joi.string()
			.min(1)
			.max(2),
		phonenumber: Joi.string()
			.length(10)
			.regex(/^\d+$/)
	})
	.and('countrycode', 'phonenumber')
	.custom(( {countrycode, phonenumber}, helper )=>{
		if( /^\d+$/.test(countrycode) )	{
			countrycode = fnValidator.getRegionCodeForCountryCode(countrycode)
		}
		const obj = new fnValidator(phonenumber, countrycode)
		if( !obj.isValid() ) {
			return helper.error('any.invalid');		
		}
		return {countrycode, phonenumber};		
	}),
	aadhaar: Joi.string()
		.custom((value, helper)=> {
			if( !Validator.aadhaar(value) ) {
				return helper.error('any.invalid')
			}
			return value
		}),
	pan: Joi.string()
		.custom((value, helper)=> {
			if( !Validator.pan(value) ) {
				return helper.error('any.invalid')
			}
			return value
		}),
	creditcard: Joi.string()
		.creditCard()
});	

module.exports = {
	validateInput: () => {
		return (req, res, next)=>{
			if( req.body.hasOwnProperty('schema')  ) {
				if( !Joi.isSchema(req.body.schema) ) {
					req.body.schema = fromJson(req.body.schema)
				}
				baseSchema = baseSchema.concat(	req.body.schema )
			}
			const { error,value } = baseSchema.validate(req.body.data)
			if (error) {
				next(error)	
			} else {
				next()
			}
		}
	}
}
