const request = require("supertest");
const app = require("../app");

describe("GET /", () => {
    it("should return the index.html file", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.text.length).toBeGreaterThan(0);
    });
});

describe("POST /resume", () => {
    it("should return the Resume PDF file", async () => {
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
        const res = await request(app).post("/resume").set("Accept", "application/pdf").set("Content-type", "application/json").send(validObject);
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toBe("application/pdf");
    });
});