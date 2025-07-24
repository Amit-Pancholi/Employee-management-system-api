const request = require("supertest");
const app = require("../app");
const Routes = require("../utils/routes");
const { startConnection, endConnection } = require("./connection-for-test");

beforeAll(startConnection);
afterAll(endConnection);

describe('Auth API', ()=>{
    let token ;
    let userId;

    it('should singup', async ()=>{
        const res = await request(app).post(`${Routes.AUTH}/signup`).send({
            username : 'jojo',
            email:'jojo@gmail.com',
            password:'Aq@12345',
            confirmPassword : 'Aq@12345'
        })
        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('user')
        expect(res.body).toHaveProperty("Message");
        userId = res.body.user.id
    })

    it("should login", async () => {
      const res = await request(app).post(`${Routes.AUTH}/login`).send({
        email: "jojo@gmail.com",
        password: "Aq@12345",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("user");
      expect(res.body).toHaveProperty("token");
      token = res.body.token
    });
    
    it("should singup", async () => {
      const res = await request(app)
        .delete(`${Routes.AUTH}/${userId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("Message");
    });
})