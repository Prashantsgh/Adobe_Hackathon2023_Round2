const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');
// Requiring the Client ID and Secret Key
const {PDF_SERVICES_CLIENT_ID, PDF_SERVICES_CLIENT_SECRET} = require('./Credentials/secret');

// Set up Credentials to connect to Document Generation API
const credentials =  PDFServicesSdk.Credentials
    .servicePrincipalCredentialsBuilder()
    .withClientId(PDF_SERVICES_CLIENT_ID)
    .withClientSecret(PDF_SERVICES_CLIENT_SECRET)
    .build();

// Create an ExecutionContext using credentials
const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

// Function to link the URLs in the string with the word following them.
function replaceAnchor(str){
    let words = str.split(" ");
    let result = "";
    for(let i =0; i<words.length-1; i++){
        // Check If the current word follows pattern of an URL. If yes then create an Anchor with the next word.
        if(words[i].includes("://www.") && words[i].includes(".", words[i].indexOf(".")+1)){
            result+=`<a href=\"${words[i]}\">${words[i+1]}</a>` + " ";
            i++;
        }
        else{
            result+=words[i]+" ";
        }
    }
    result+=words[words.length-1];
    return result;
}

/* Function to create JSON Object from
request body to send to the Document Generation API*/
function getJSON(req){
    const result = {};

    // Extract The Personal Information From The Request Body
    result.Name = req.personal_information.name;
    result.LastName = req.personal_information.last_name;
    result.EmailAddress = req.personal_information.email_address;
    result.PhoneNumber = req.personal_information.phone_number;
    result.LinkedIn = req.personal_information.linkedin_url;
    result.LinkedIn = `<a href=\"${result.LinkedIn}\">linkedIn</a>`;    // Creating Anchor for the Linkedin URL

    // Extract The JobTitle, Career Objective and Skills From The Request Body
    result.JobTitle = req.job_title;
    result.Summary = replaceAnchor(req.career_objective);

    result.Skills = req.skills;

    // Extract Education Data From The Request Body
    result.Education = [];
    req.education.forEach(element => {
        let eduData = {};
        eduData.SchoolName = element.school_name;
        eduData.Year = element.passing_year;
        eduData.Description = replaceAnchor(element.description);
        result.Education.push(eduData);
    });

    result.Experience = [];
    req.experience.forEach(element => {
        let expData = {};
        expData.CompanyName = element.company_name;
        expData.Year = element.passing_year;
        expData.Description = replaceAnchor(element.responsibilities);
        result.Experience.push(expData);
    });

    result.Achievements = [];
    req.achievements.forEach(element => {
        let achData = {};
        achData.Type = element.field;
        achData.Description = replaceAnchor(element.awards);
        result.Achievements.push(achData);
    });

    console.log(result);
    return result;
}

function verifyRequest(req){
    return true;
}

// Middleware function to Generate Resume and Send Back Response
module.exports.createResume = function createResume(req,res){

    // Verify the request body and send response if it it not valid.
    let isReqValid = verifyRequest(req.body);
    if(isReqValid===false){
        return res.status(400).send({Description: "Bad Request"});
    }

    const valid_templateID = ["1", "2", "3"];
    const template_id = req.body.template_id;                           // Template to be used.

    // Check if the template ID is valid else return an Error
    if(valid_templateID.includes(template_id)===false){
        return res.status(404).send({Description: "Template not found"});
    }

    const INPUT = `./ResumeTemplates/Template${template_id}.docx`;      // Path to Docx Format of the Template.
    const OUTPUT = './generatedResume.pdf';                             // Path to store the generated Output Resume File.

    // If our output already exists, remove it so we can run the application again.
    if(fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);

    // Extract the JSON data to send to Document Generation API From Request Body.
    const JSON_INPUT = getJSON(req.body);

    // Create the Operation.
    const documentMerge = PDFServicesSdk.DocumentMerge,
        documentMergeOptions = documentMerge.options,
        options = new documentMergeOptions.DocumentMergeOptions(JSON_INPUT, documentMergeOptions.OutputFormat.PDF);

    // Create a new operation instance using the options instance.
    const documentMergeOperation = documentMerge.Operation.createNew(options);

    // Set operation input document template from a source file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile(INPUT);
    documentMergeOperation.setInput(input);

    // Execute the operation and Send the Resume with the Response
    documentMergeOperation.execute(executionContext)
    .then(result => {
        return result.saveAsFile(OUTPUT);
    })
    .then(()=>{
        // On Successful generation of Resume, Create the Response and Send it.
        res.setHeader("Content-type", "application/pdf");
        return res.status(200).sendFile(OUTPUT,{root:__dirname});
    })
    .catch(err => {
        if(err instanceof PDFServicesSdk.Error.ServiceApiError
            || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
            console.log('Exception encountered while executing operation', err);
        } else {
            console.log('Exception encountered while executing operation', err);
        }

        // Response for Error During Resume Generation Process
        return res.status(500).send({Description: "Internal Server Error"});
    });

};
