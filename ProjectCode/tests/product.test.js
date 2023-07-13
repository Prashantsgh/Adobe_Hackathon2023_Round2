const request = require("supertest");
const app = require("../app");

// A request data object to be sent through requests.
const validObject = {
    "template_id" : "2",
    "personal_information" : {
        "name": "Lorem",
        "last_name": "ipsum",
        "email_address": "ipsum@abc.com",
        "phone_number": "+91 99xx14xx99",
        "linkedin_url": "https://www.linkedin.com"
    },
    "job_title": "Software Development Engineer",
    "career_objective" : "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper.",
    "skills": [
        "Java", 
        "ReactJs",
        "Strong interpersonal & communication skills"
    ],
    "education": [
        {
        "school_name": "School",
        "passing_year": "201X-201Y",
        "description" : "There are many variations of passages of <a href=\"https://www.google.com\">Lorem Ipsum</a> available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
        },
        {
        "school_name": "College",
        "passing_year": "203X-203Y",
        "description" : "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable."
        }
    ],
    "experience": [
        {
        "company_name": "Adobe",
        "passing_year": "201X-201Y",
        "responsibilities" : "It is a long <a href=\"https://www.adobe.com\">established</a> fact that a reader will be distracted by the readable content of a page when looking at its layout."
        }
    ],
    "achievements": [
        {
        "field" : "Academics",
        "awards" : "<a href=\"https://www.google.com\">Institute</a> Topper"
        },
        {
        "field" : "Sports",
        "awards" : "Gold Medalist in <a href=\"https://www.adobe.com\">Long Jump</a> "
        }
    ]
};
const validObject2 = {
    "template_id" : "3",
    "personal_information" : {
      "name": "Lorem",
      "last_name": "ipsum",
      "email_address": "ipsum@abc.com",
      "phone_number": "+91 99xx14xx99",
      "linkedin_url": "https://www.linkedin.com"
    },
    "job_title": "Software Development Engineer",
    "career_objective" : "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper.",
    "skills": [
      "Strong interpersonal",
      "communication skills", 
      "Leadership",
      "Poised under pressure"
    ],
    "education": [
      {
        "school_name": "School",
        "passing_year": "201X-201Y",
        "description" : "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
      },
      {
        "school_name": "College",
        "passing_year": "203X-203Y",
        "description" : "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc"
      }
    ],
    "experience": [
      {
        "company_name": "Adobe",
        "passing_year": "201X-201Y",
        "responsibilities" : "It is a long established fact that a reader will be distracted by the readable content. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod"
      }
    ],
    "achievements": [
      {
        "field" : "Academics",
        "awards" : "Lorem ipsum dolor sit amet"
      },
      {
        "field" : "Sports",
        "awards" : "consectetuer adipiscing elit"
      }
    ]
}

// Test for get request.
describe("GET /", () => {
    it("should return the index.html file", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.text.length).toBeGreaterThan(0);
    });
});

// Test for a valid Post request.
describe("POST /resume", () => {
    it("should return the Resume PDF file", async () => {
        const res = await request(app).post("/resume").set("Accept", "application/pdf").set("Content-type", "application/json").send(validObject);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toBe("application/pdf");
    });

    it("should return the Resume PDF file", async () => {
        const res = await request(app).post("/resume").set("Accept", "application/pdf").set("Content-type", "application/json").send(validObject2);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toBe("application/pdf");
    });
});

// Test for an invalid request with wrong headers, wrong request object
describe("POST /resume", () => {
    it("should return an error code", async () => {

        const res = await request(app).post("/resume").set("Content-type", "application/json").send(validObject);
        expect(res.statusCode).toBe(400);
        expect(res.body.Description).toBe("Bad Request");
    });

    it("should return an error code", async () => {

        const res = await request(app).post("/resume").set("Accept", "application/json").send(validObject);
        expect(res.statusCode).toBe(400);
        expect(res.body.Description).toBe("Bad Request");
    });

    it("should return an error code", async () => {

        const res = await request(app).post("/resume").set("Accept", "application/pdf").send("Create Resume");
        expect(res.statusCode).toBe(400);
        expect(res.body.Description).toBe("Bad Request");
    });
});

// Test for an request with invalid data.
describe("POST /resume", () => {
    // Template ID contains only white spaces.
    it("should return an error code", async () => {
        let invalidObject = {...validObject};
        invalidObject.template_id="  ";
        const res = await request(app).post("/resume").set("Accept", "application/pdf").set("Content-type", "application/json").send(invalidObject);
        expect(res.statusCode).toBe(400);
        expect(res.body.Description).toBe("Bad Request");
    });
    
    // Empty Name Field
    it("should return an error code", async () => {
        let invalidObject = {...validObject};
        invalidObject.personal_information = {...invalidObject.personal_information};
        invalidObject.personal_information.name="";
        const res = await request(app).post("/resume").set("Accept", "application/pdf").set("Content-type", "application/json").send(invalidObject);
        expect(res.statusCode).toBe(400);
        expect(res.body.Description).toBe("Bad Request");
    });

    // Missing Job title Field
    it("should return an error code", async () => {
        let invalidObject = {...validObject};
        delete invalidObject.job_title;
        const res = await request(app).post("/resume").set("Accept", "application/pdf").set("Content-type", "application/json").send(invalidObject);
        expect(res.statusCode).toBe(400);
        expect(res.body.Description).toBe("Bad Request");
    });

    // Job Title type to be object rather than string.
    it("should return an error code", async () => {
        let invalidObject = {...validObject};
        invalidObject.job_title={job_title: validObject.job_title};
        const res = await request(app).post("/resume").set("Accept", "application/pdf").set("Content-type", "application/json").send(invalidObject);
        expect(res.statusCode).toBe(400);
        expect(res.body.Description).toBe("Bad Request");
    });

    // skills contains an empty string(whitespaces only) as skill.
    it("should return an error code", async () => {
        let invalidObject = {...validObject};
        invalidObject.skills = [...invalidObject.skills];
        invalidObject.skills.push("  ");
        const res = await request(app).post("/resume").set("Accept", "application/pdf").set("Content-type", "application/json").send(invalidObject);
        expect(res.statusCode).toBe(400);
        expect(res.body.Description).toBe("Bad Request");
    });

    // education is defined as an object and not an array of objects.
    it("should return an error code", async () => {
        let invalidObject = {...validObject};
        invalidObject.education = {
            "school_name": "School",
            "passing_year": "201X-201Y",
            "description" : "There are many variations of passages of <a href=\"https://www.google.com\">Lorem Ipsum</a> available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
        };
        const res = await request(app).post("/resume").set("Accept", "application/pdf").set("Content-type", "application/json").send(invalidObject);
        expect(res.statusCode).toBe(400);
        expect(res.body.Description).toBe("Bad Request");
    });
});

// Test for wrong template id.
describe("POST /resume", () => {
    it("should return an error code", async function() {
        let invalidObject = {...validObject};
        invalidObject["template_id"]="7";
        const res = await request(app).post("/resume").set("Accept", "application/pdf").set("Content-type", "application/json").send(invalidObject);
        expect(res.statusCode).toBe(404);
        expect(res.body.Description).toBe("Template not found");
    });
});
