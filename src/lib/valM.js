
/*
This is a middleware package for validation of user input. As of now it supports validation for only the following fields:
fulname(1st name, last name), username, emailid, dob, password, contactnumber, aadhaar, pan, credit card. Apart from that it allows custom validation where enduser will be able to validate other fields as well based on schema provided by them. It also supports validation of data after modification of schema for the existing fields.

Constraints for using this package:
	1. When being used by the enduser, if user is not providing schema for a field, then, the name of the field should match with that mentioned in the schema for this package.
	2. If enduser is modifying the schema of an existing field, then they should make sure that..
		a. Either basic datatype matches in both the baseSchema and schema provided by user. For example, if address is an object in the baseSchema, then it cannot be a string in the userschema. This is a requirement of joi.concat() used in the package.
		b. Or, you can just change the name of the field a little when declaring the userschema.
	3. 	Since, I was unable to figure out a way to pass a Joi schema directly from the request body. I had to convert it to json at the client-side before sending request, and then convert it back to a joi schema at the server-side after recieving the request. Luckily, both of these features are provided by the existing package 'json-joi-converter'. Hence it is recommended for the enduser to use this package( as well as Joi) incase they want to send the schema as a json. Otherwise, if an user is able to send the schema as it is, then no problem.
	4. I have noticed a small issue with the package 'json-joi-converter'. Please refer the following link.
	https://github.com/siavashg87/json-joi-converter/issues/5
	Hope they will verify it soon. Till then I will try to figure out a way to pass a joi schema as it is.
*/

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