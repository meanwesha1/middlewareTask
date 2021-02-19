
const sinon = require('sinon')
const {expect} = require('chai');
const Joi = require('joi');
const {toJson} = require('json-joi-converter')
const {validateInput, checkResponse} = require('../../lib/valM');

describe('Test valM function', () => {
	it('should check that next is called with a validation error when input data does not validate acc. to baseSchema', ()=>{
		const req = {
			'body': {
				'data': {
					'fullname': {'firstname': 'Anwesha', 'lastname': 'Ghosh'},
					'dob': {'date': 15, 'month': 16, 'year': 1948},
					'contactnumber':	{'countrycode':'91', 'phonenumber':'8961686789'},
					'pan': 'ALWPG5809L'
				}					
			}
		}
		const res = {}
		const nextSpy = sinon.spy()
		validateInput()(req, res, nextSpy)
		expect(nextSpy.calledOnce).to.be.true
		expect(nextSpy.firstCall.args[0]).to.be.an('error')
		expect(Joi.isError(nextSpy.firstCall.args[0])).to.be.true
	});	
	it('should check that next is called without any arguments when input data validates acc. to baseSchema', ()=>{
		const req = {
			'body': {
				'data': {
					'fullname': {'firstname': 'Anwesha', 'lastname': 'Ghosh'},
					'dob': {'date': 15, 'month': 7, 'year': 1948},
					'contactnumber':	{'countrycode':'91', 'phonenumber':'8961686789'},
					'pan': 'ALWPG5809L'
				}					
			}
		}
		const res = {}
		const nextSpy = sinon.spy()
		validateInput()(req, res, nextSpy)
		expect(nextSpy.calledOnce).to.be.true
		expect(nextSpy.firstCall.args[0]).to.be.undefined
	});		
	it('should check that next is called with a validation error when input data does not validate acc. to userSchema', ()=>{
		const req = {
			'body': {
				'data': {
					'fullname': {'firstname': 'Anwesha', 'lastname': 'Ghosh'},
					'dob': {'date': 15, 'month': 7, 'year': 1948},
					'yearOfPassing': 2018,
					'contactnumber':	{'countrycode':'91', 'phonenumber':'8961686789'},
					'pan': 'ALWPG5809L',
				},
				'schema':  toJson(
							Joi.object({
								yearOfPassing: Joi.number()
									.integer()
									.min(2019)
									.max(2020)
							})
				)
			}		
		}
		const res = {}
		const nextSpy = sinon.spy()
		validateInput()(req, res, nextSpy)
		expect(nextSpy.calledOnce).to.be.true
		expect(nextSpy.firstCall.args[0]).to.be.an('error')
		expect(Joi.isError(nextSpy.firstCall.args[0])).to.be.true
	});	
	it('should check that next is called without any arguments when input data validates acc. to userSchema', ()=>{
		const req = {
			'body': {
				'data': {
					'fullname': {'firstname': 'Anwesha', 'lastname': 'Ghosh'},
					'dob': {'date': 15, 'month': 7, 'year': 1948},
					'contactnumber':	{'countrycode':'91', 'phonenumber':'8961686789'},
					'yearsOfExperience': 3.7,
					'pan': 'ALWPG5809L'
				},
				'schema': toJson(
							Joi.object({
								yearsOfExperience: Joi.number()
									.min(2)
									.max(5)
							})
				)
			}		
		}
		const res = {}
		const nextSpy = sinon.spy()
		validateInput()(req, res, nextSpy)
		expect(nextSpy.calledOnce).to.be.true
		expect(nextSpy.firstCall.args[0]).to.be.undefined
	});	
	it('should check that next is called with a validation error when input data does not validate modified baseSchema', ()=>{
		const req = {
			'body': {
				'data': {
					'fullname': {'firstname': 'Anwesha', 'lastname': 'Ghosh'},
					'dob': {'date': 15, 'month': 7, 'year': 1994},
					'contactnumber':	{'countrycode':'91', 'phonenumber':'8961686789'},
					'email': 'meanwesha1@wipro.com',
					'pan': 'ALWPG5809L',
				},
				'schema':  toJson(
							Joi.object({
								dob: Joi.object({		//should take string type too.
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
		}
		const res = {}
		const nextSpy = sinon.spy()
		validateInput()(req, res, nextSpy)
		expect(nextSpy.calledOnce).to.be.true
		expect(nextSpy.firstCall.args[0]).to.be.an('error')
		expect(Joi.isError(nextSpy.firstCall.args[0])).to.be.true
	});	
});