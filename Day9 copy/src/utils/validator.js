const validator = require('validator');

const validate = (data)=>{
    if (data.emailId && !data.emailID) {
        data.emailID = data.emailId;
    }

    const mandatoryField = ['firstName','emailID','password'];
    const IsAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k));
    if(!IsAllowed){
        throw new Error("some Field Missing");
    }

    if(!validator.isEmail(data.emailID)){
        throw new Error("Invalid Email");
    }

    if(!validator.isStrongPassword(data.password)){
        throw new Error(" ye Weak Password");
    }
    
}

module.exports = validate;
