# Adobe_Hackathon2023_Round2
# Resume Builder

### The Repository Contains the Submission Work For Round 2 of Adobe PapyrusNebulae 2023 Document Cloud Hackathon.
### Must go through the documentation to understand the amazing project work.

## Requirements:
Recent Version of Node JS and Browser.

## Initial Setup:
### Step 1:-
Change Directory to the Project Code using the Terminal and Install all the Node Modules using **`npm install`** command.

### Step 2:-
To Change the **credentials**, Go to the `Credentials Folder -> secret.js` File and change the Client ID and Secret Key there. Also, Replace the credentials.json file(Optional).

### Step 3:-
Run the **`npm start`** or **`node ./server.js`** command to run the application. To run the unit tests, use **`npm run test`** command.

The API is accessible at `localhost:8080`. 

### The API Listens for requests on two Endpoints:

  **a. GET /   ->** It Sends the **ResumeBuilder UI** HTML File as a response. No Request Header is required. The users can directly fill the Form in the UI and then generate Resumes. The Interface is user friendly.
  
  **b. POST /resume    ->** It sends the created **RESUME in PDF** Format as a response. The Request object must be in the shared format as it is strictly verified before Generation. The **Hyperlinks must be pre formatted** in the resume object. ***Refer DOCUMENTATION.***
    
On Successful generation of the RESUME, The headers and Resume(PDF) are sent. In case of Error, An Error Code( 400, 401, 404, 500) is sent with a DESCRIPTION       Message for the same as shared in the API Description.


