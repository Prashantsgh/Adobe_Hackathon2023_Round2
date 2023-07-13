const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');
const path = require('path');
const {verifyRequest} = require('./verifyRequest');         // Module to verify the Request Object.
const {getJSON} = require('./createJSON');                  // Module to convert the req Object to JSON Object for Document Generation API.

// Requiring the Client ID and Secret Key
const {PDF_SERVICES_CLIENT_ID, PDF_SERVICES_CLIENT_SECRET} = require('../Credentials/secret');

// Set up Credentials to connect to Document Generation API
const credentials =  PDFServicesSdk.Credentials
    .servicePrincipalCredentialsBuilder()
    .withClientId(PDF_SERVICES_CLIENT_ID)
    .withClientSecret(PDF_SERVICES_CLIENT_SECRET)
    .build();

// Create an ExecutionContext using credentials
const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

let activeReqCnt = 0,currReqCnt=0;      //For Naming The Output Files uniquely.

// Middleware function to Generate Resume and Send Back Response
module.exports.createResume = function createResume(req,res){

    // Verify the request body format and send response if it it not valid.
    let isReqValid = verifyRequest(req);
    if(isReqValid===false){
        return res.status(400).send({Description: "Bad Request"});
    }

    // Check if the template ID is valid else return an Error
    const valid_templateID = ["1", "2", "3"];
    const template_id = req.body.template_id.trim();                           // Template to be used.
    if(valid_templateID.includes(template_id)===false){
        return res.status(404).send({Description: "Template not found"});
    }

    const INPUT = `./ResumeTemplates/Template${template_id}.docx`;      // Path to Docx Format of the Template.
    if(activeReqCnt===0){
        currReqCnt=0;                   // Reset the value of current output file naming variable.
    }
    const OUTPUT = path.join(__dirname,"../TemporaryResumes",`generatedResume${currReqCnt++}.pdf`);        // Path to store the generated Output Resume File.
    activeReqCnt++;

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
        activeReqCnt--;
        return res.status(200).sendFile(OUTPUT, err => {
            if (err) {
                console.log(err);
                return res.status(500).send({Description: "Internal Server Error"});
            }
            if(fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);
        });
    })
    .catch(err => {
        if(err instanceof PDFServicesSdk.Error.ServiceApiError
            || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
            console.log('Exception encountered while executing operation', err);
        } else {
            console.log('Exception encountered while executing operation', err);
        }

        activeReqCnt--;
        // Response for Error During Resume Generation Process.
        if(err.statusCode==400){
            return res.status(400).send({Description: "Bad Request"});
        }
        else if(err.statusCode==401){
            return res.status(401).send({Description: "Unauthorized"});
        }
        else if(err.statusCode==404){
            return res.status(404).send({Description: "Template not found"});
        }
        else{
            return res.status(500).send({Description: "Internal Server Error"});
        }
    });

};