// List of all valid Fields and SubFields of the form
let validElements = ["template_id","personal_information", "job_title", "career_objective", "skills", "education", "experience", "achievements"];
let validPersonalInfo = ["name", "last_name", "email_address", "phone_number", "linkedin_url"];
let validEdu = ["school_name", "passing_year", "description"];
let validExp = ["company_name", "passing_year", "responsibilities"];
let validAch = ["field", "awards"];

module.exports.verifyRequest = function verifyRequest(req){

    // Check if all the required fields are present.
    validElements.forEach((element)=>{
        if(req[element]===undefined){
            return false;
        }
    });
    // Check if there are no extra fields present in the Request Body.
    if(keyCount(req)!=validElements.length){
        return false;
    }

    // Check if template_id is a non empty string
    if(typeof(req.template_id)!="string" || req.template_id===""){
        return false;
    }

    // Check Personal Information for extra/missing sub-fields, type of sub-fields.
    if(typeof(req.personal_information)!="object" || keyCount(req.personal_information)!=validPersonalInfo.length){
        return false;
    }
    validPersonalInfo.forEach((element)=>{
        if(typeof(req.personal_information[element])!="string" || req.personal_information[element]===""){
            return false;
        }
    });


    // Check Job Title and Career Object.
    if(typeof(req.job_title)!="string" || req.job_title===""){
        return false;
    }
    if(typeof(req.career_objective)!="string" || req.career_objective===""){
        return false;
    }


    // Check if skills is an Array and is not empty.
    if(!Array.isArray(req.skills) || req.skills.length===0){
        return false;
    }
    // Check if every element of Skills is a non empty string.
    req.skills.forEach((skill)=>{
        if(typeof(skill)!="string" || skill.length===0){
            return false;
        }
    });


    // Check if education is an Array and non empty.
    if(!Array.isArray(req.education) || req.education.length===0){
        return false;
    }
    // Check if every element of Education is an Object and contains all the required fields.
    req.education.forEach((edu)=>{
        if(typeof(edu)!="object" || keyCount(edu)!=validEdu.length){
            return false;
        }
        validEdu.forEach((element)=>{
            if(typeof(edu[element])!="string" || edu[element]===""){
                return false;
            }
        });
    });


    // Check if experience is an Array and non empty.
    if(!Array.isArray(req.experience) || req.experience.length===0){
        return false;
    }
    // Check if every element of Experience is an Object and contains all the required fields.
    req.experience.forEach((exp)=>{
        if(typeof(exp)!="object" || keyCount(exp)!=validExp.length){
            return false;
        }
        validExp.forEach((element)=>{
            if(typeof(exp[element])!="string" || exp[element]===""){
                return false;
            }
        });
    });
    

    // Check if achievements is an Array and non empty.
    if(!Array.isArray(req.achievements) || req.achievements.length===0){
        return false;
    }
    // Check if every element of Experience is an Object and contains all the required fields.
    req.achievements.forEach((ach)=>{
        if(typeof(ach)!="object" || keyCount(ach)!=validAch.length){
            return false;
        }
        validAch.forEach((element)=>{
            if(typeof(ach[element])!="string" || ach[element]===""){
                return false;
            }
        });
    });

    return true;    // return true if all constraints satisfied
}

// A helper function that tells the count of no. of keys present in an Object.
function keyCount(obj){
    let count=0;
    for(let key in obj){
        count++;
    }
    return count;
}