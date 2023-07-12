// List of all valid Fields and SubFields of the Request Data Object
let validElements = ["template_id","personal_information", "job_title", "career_objective", "skills", "education", "experience", "achievements"];
let validPersonalInfo = ["name", "last_name", "email_address", "phone_number", "linkedin_url"];
let validEdu = ["school_name", "passing_year", "description"];
let validExp = ["company_name", "passing_year", "responsibilities"];
let validAch = ["field", "awards"];

module.exports.verifyRequest = function verifyRequest(req){

    // Verify Request Headers.
    if(typeof(req.headers)!="object" || typeof(req.headers.accept)!="string" || typeof(req.headers["content-type"])!="string"){
        return false;
    }
    else if(req.headers.accept !="application/pdf" || req.headers["content-type"]!="application/json"){
        return false;
    }

    const data = req.body;
    
    // Check if all the required fields are present.
    validElements.forEach((element)=>{
        if(data[element]===undefined){
            return false;
        }
    });
    // Check if there are no extra fields present in the Request Body.
    if(keyCount(data)!=validElements.length){
        return false;
    }

    // Check if template_id is a non empty string
    if(typeof(data.template_id)!="string" || data.template_id===""){
        return false;
    }

    // Check Personal Information for extra/missing sub-fields, type of sub-fields.
    if(typeof(data.personal_information)!="object" || keyCount(data.personal_information)!=validPersonalInfo.length){
        return false;
    }
    validPersonalInfo.forEach((element)=>{
        if(typeof(data.personal_information[element])!="string" || data.personal_information[element]===""){
            return false;
        }
    });


    // Check Job Title and Career Object.
    if(typeof(data.job_title)!="string" || data.job_title===""){
        return false;
    }
    if(typeof(data.career_objective)!="string" || data.career_objective===""){
        return false;
    }


    // Check if skills is an Array and is not empty.
    if(!Array.isArray(data.skills) || data.skills.length===0){
        return false;
    }
    // Check if every element of Skills is a non empty string.
    data.skills.forEach((skill)=>{
        if(typeof(skill)!="string" || skill.length===0){
            return false;
        }
    });


    // Check if education is an Array and non empty.
    if(!Array.isArray(data.education) || data.education.length===0){
        return false;
    }
    // Check if every element of Education is an Object and contains all the required fields.
    data.education.forEach((edu)=>{
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
    if(!Array.isArray(data.experience) || data.experience.length===0){
        return false;
    }
    // Check if every element of Experience is an Object and contains all the required fields.
    data.experience.forEach((exp)=>{
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
    if(!Array.isArray(data.achievements) || data.achievements.length===0){
        return false;
    }
    // Check if every element of Experience is an Object and contains all the required fields.
    data.achievements.forEach((ach)=>{
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