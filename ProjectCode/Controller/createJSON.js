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
    result.Summary = req.career_objective.trim();
    result.Skills = req.skills;
    // Trim Extra spaces from individual skills.
    result.Skills.map((skill)=>{
        return skill.trim();
    });

    // Extract Education Data From The Request Body.
    result.Education = [];
    req.education.forEach(element => {
        let eduData = {};
        eduData.SchoolName = element.school_name.trim();
        eduData.Year = element.passing_year.trim();
        eduData.Description = element.description.trim();
        result.Education.push(eduData);
    });

    // Extract Experience Field from the Request Body.
    result.Experience = [];
    req.experience.forEach(element => {
        let expData = {};
        expData.CompanyName = element.company_name.trim();
        expData.Year = element.passing_year.trim();
        expData.Description = element.responsibilities.trim();
        result.Experience.push(expData);
    });

    // Extract Achievements Field from the Request Body.
    result.Achievements = [];
    req.achievements.forEach(element => {
        let achData = {};
        achData.Type = element.field.trim();
        achData.Description = element.awards.trim();
        result.Achievements.push(achData);
    });

    return result;
}