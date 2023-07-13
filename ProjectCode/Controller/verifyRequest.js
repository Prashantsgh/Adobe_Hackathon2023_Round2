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
    for( let element of validElements){
        if(data[element]===undefined){
            return false;
        }
    };
    // Check if there are no extra fields present in the Request Body.
    if(keyCount(data)!=validElements.length){
        return false;
    }

    // Check if template_id is a non empty string
    if(typeof(data.template_id)!="string" || !data.template_id.trim()){
        return false;
    }

    // Check Personal Information for extra/missing sub-fields, type of sub-fields.
    if(typeof(data.personal_information)!="object" || keyCount(data.personal_information)!=validPersonalInfo.length){
        return false;
    }
    for(let element of validPersonalInfo){
        // Check if the info is not a string or it only contains spaces.
        if(typeof(data.personal_information[element])!="string" || !data.personal_information[element].trim().length){
            return false;
        }
    };


    // Check Job Title and Career Object.
    if(typeof(data.job_title)!="string" || !data.job_title.trim()){
        return false;
    }
    if(typeof(data.career_objective)!="string" || !data.career_objective.trim()){
        return false;
    }


    // Check if skills is an Array and is not empty.
    if(!Array.isArray(data.skills) || data.skills.length===0){
        return false;
    }
    // Check if every element of Skills is a non empty string.
    for( let skill of data.skills){
        if(typeof(skill)!="string" || !skill.trim()){
            return false;
        }
    };


    // Check if education is an Array and non empty.
    if(!Array.isArray(data.education) || data.education.length===0){
        return false;
    }
    // Check if every element of Education is an Object and contains all the required fields.
    for( let edu of data.education){
        if(typeof(edu)!="object" || keyCount(edu)!=validEdu.length){
            return false;
        }
        for( let element of validEdu){
            if(typeof(edu[element])!="string" || !edu[element].trim()){
                return false;
            }
        };
    };


    // Check if experience is an Array and non empty.
    if(!Array.isArray(data.experience) || data.experience.length===0){
        return false;
    }
    // Check if every element of Experience is an Object and contains all the required fields.
    for( let exp of data.experience){
        if(typeof(exp)!="object" || keyCount(exp)!=validExp.length){
            return false;
        }
        for( let element of validExp){
            if(typeof(exp[element])!="string" || !exp[element].trim()){
                return false;
            }
        };
    };
    

    // Check if achievements is an Array and non empty.
    if(!Array.isArray(data.achievements) || data.achievements.length===0){
        return false;
    }
    // Check if every element of Experience is an Object and contains all the required fields.
    for( let ach of data.achievements){
        if(typeof(ach)!="object" || keyCount(ach)!=validAch.length){
            return false;
        }
        for( let element of validAch){
            if(typeof(ach[element])!="string" || !ach[element].trim()){
                return false;
            }
        };
    };

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