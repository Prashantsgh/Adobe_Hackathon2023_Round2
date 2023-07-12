# Adobe_Hackathon2023_Round2

Requirements: Recent Version of Node JS and any Browser.

Initial Setup:
Step 1:- Change Directory to the Project Code in the Terminal and Install all the Node Modules using "npm install".

Step 2:- To Change the credentials, Go to the Credentials Folder -> secret.js File and change the Client ID and Secret Key there. Also, Replace the credentials.json file(Optional).

Step 3:- Run the "npm start" or "node ./server.js" Command to run the application.


The API Listens for requests on two Routes:

  a. GET /   -> It Sends the ResumeBuilder UI HTML File as a response. No Request Headers required.
  
  b. POST /resume    -> It sends the created RESUME in PDF Format as a response. 
  
   The Request Object is strictly verified before Generation. Request Object must be in the shared Format (All Fields Present, Contain Non Empty Values in Right       Format, No Extra Fields Present and Headers properly included).
   To add Hyperlinks to the text, wrap the text as:  <a href=\"URL\">Text</a>
    
  On Successful generation of the RESUME, The headers and Resume(PDF) are sent. In case of Error, A Error Code( 400, 401, 404, 500) is sent with a DESCRIPTION          Message for the same as shared in the API Description.


