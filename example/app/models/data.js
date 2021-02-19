
const mongoose = require('mongoose');

const mySchema = new mongoose.Schema ({
  username: {type:String, required: true},
  dob: {
	  date: {type:Number},
	  month: {type:Number},
	  year: {type:Number}	  
  },
  contactnumber: {
	  countrycode: String,
	  phonenumber: String,
  },
  email: {type:String, required: true},
  pswd: {type:String, required: true},
  address: {
	  country: {type:String},
	  state: {type:String},
	  city: {type:String},
	  road: {type:String},
	  buildingNo: {type:String}		  
  }
});

module.exports = mongoose.model('DATA', mySchema);