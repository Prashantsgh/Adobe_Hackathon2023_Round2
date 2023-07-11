// Helper function to create Anchor Tag for the URLs in the string.
function replaceAnchor(str){
    str.replace(/\s+/g, ' ').trim();    // Remove Extra Spaces from the string to avoid any issues.
    let words = str.split(" ");         // Split the string to get every word.
    let result = "";
    for(let i =0; i<words.length; i++){
        // Check If the current word follows pattern of an URL. If yes then create an Anchor tag with the next word.
        if(i<words.length-1 && words[i].includes("://www.") && words[i].includes(".", words[i].indexOf(".")+1)){
            result+=`<a href=\"${words[i]}\">${words[i+1]}</a>` + " ";
            i++;
        }
        else{
            result+=words[i]+" ";   // Else add the word as it is.
        }
    }
    return result.trim();
}

// Function to create JSON Object from request body to send to the Document Generation API.
module.exports.getJSON = function getJSON(req){
    const result = {};

    // Extract the Personal Information from the Request Body.
    result.Name = req.personal_information.name.trim();
    result.LastName = req.personal_information.last_name.trim();
    result.EmailAddress = req.personal_information.email_address.trim();
    result.PhoneNumber = req.personal_information.phone_number.trim();
    result.LinkedIn = req.personal_information.linkedin_url.trim();
    result.LinkedIn = `<a href=\"${result.LinkedIn}\">linkedIn</a>`;    // Creating Anchor Tag for the Linkedin URL.

    // Extract the Job Title, Career Objective and Skills From the Request Body.
    result.JobTitle = req.job_title.trim();
    result.Summary = replaceAnchor(req.career_objective.trim());
    result.Skills = req.skills;
    // Remove Extra spaces from individual skills.
    result.Skills.map((skill)=>{
        return skill.trim();
    });

    // Extract Education Data From The Request Body.
    result.Education = [];
    req.education.forEach(element => {
        let eduData = {};
        eduData.SchoolName = element.school_name.trim();
        eduData.Year = element.passing_year.trim();
        eduData.Description = replaceAnchor(element.description.trim());
        result.Education.push(eduData);
    });

    // Extract Experience Field from the Request Body.
    result.Experience = [];
    req.experience.forEach(element => {
        let expData = {};
        expData.CompanyName = element.company_name.trim();
        expData.Year = element.passing_year.trim();
        expData.Description = replaceAnchor(element.responsibilities.trim());
        result.Experience.push(expData);
    });

    // Extract Achievements Field from the Request Body.
    result.Achievements = [];
    req.achievements.forEach(element => {
        let achData = {};
        achData.Type = element.field.trim();
        achData.Description = replaceAnchor(element.awards.trim());
        result.Achievements.push(achData);
    });

    return result;
}