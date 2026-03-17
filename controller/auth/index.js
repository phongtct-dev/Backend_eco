//POST

const signup = require('./POST/signup');
const signin = require('./POST/signin');
const refreshtoken = require('./POST/refreshToken');
const signout = require('./POST/signout');
const sendverificationcode = require('./POST/sendVerificationCode');
const verifyverificationcode = require('./POST/verifyVerificationCode');
const sendforgotpasswordcode = require('./POST/sendForgotPasswordCode');

const changepassword = require('./PATCH/changePassword');
const forgotpasswordcode = require('./PATCH/forgotPasswordCode');

module.exports = {
//post
    signup,
    signin,
    refreshtoken,
    signout,
    sendverificationcode,
    verifyverificationcode,
    sendforgotpasswordcode,
//patch
    changepassword,
    forgotpasswordcode

}



