require("dotenv").config();
const { default: axios } = require("axios");

const API = "http://localhost:5000/api/justdoit";

const headers = {
    'Content-Type': 'application/json',
    'Bearer': process.env.AUTH_TOKEN,
  }

describe("Testing the answer controller", () =>{
       test("should return more than 20 answers", async () => {

            const { data } = await axios.get(`${API}/answers/allAnswers`, { headers: headers });
            expect(data.answers.length).toBeGreaterThan(20);
       }, 30000);

});