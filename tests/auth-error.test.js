const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Routes = require("../utils/routes");
const { startConnection, endConnection } = require("./connection-for-test");

beforeAll(startConnection);
afterAll(endConnection);

describe("Auth error API", () => {
  let token;
  let userId;
  let nonExistentId = new mongoose.Types.ObjectId();

  beforeAll(async ()=>{
    // test sign up
    const res = await request(app).post(`${Routes.AUTH}/signup`).send({
      username: "jojo",
      email: "jojo@gmail.com",
      password: "Aq@12345",
      confirmPassword: "Aq@12345",
    });
    expect(res.statusCode).toBe(201);
    userId = res.body.user.id;

    // login for token
    const logRes = await request(app).post(`${Routes.AUTH}/login`).send({
      email: "jojo@gmail.com",
      password: "Aq@12345",
    });
    expect(logRes.statusCode).toBe(200);
    token = logRes.body.token;
  })

  it('should return error(signup with empty username)',async ()=>{
    const res = await request(app).post(`${Routes.AUTH}/signup`).send({
      username: "",
      email: "ramlal@gmail.com",
      password: "Aq@12345",
      confirmPassword: "Aq@12345",
    });
    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('Message')
    expect(res.body.error[0]).toBe("Please enter username");
  })

  it("should return error(signup with username less then 2 char)", async () => {
    const res = await request(app).post(`${Routes.AUTH}/signup`).send({
      username: "t",
      email: "ramlal@gmail.com",
      password: "Aq@12345",
      confirmPassword: "Aq@12345",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("Message");
    expect(res.body.error[0]).toBe(
      "Username must be at least 2 characters long"
    );
  });

  it("should return error(signup with unexpected char in username )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/signup`).send({
      username: "ram999",
      email: "ramlal@gmail.com",
      password: "Aq@12345",
      confirmPassword: "Aq@12345",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("Message");
    expect(res.body.error[0]).toBe(
      "Username can only contain letters and spaces"
    );
  });

  it("should return error(signup with empty email )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/signup`).send({
      username: "ramlal",
      email: "",
      password: "Aq@12345",
      confirmPassword: "Aq@12345",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("Message");
    expect(res.body.error[0]).toBe("Please enter email");
  });

  it("should return error(signup with invalid email )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/signup`).send({
      username: "ramlal",
      email: "sdffggd",
      password: "Aq@12345",
      confirmPassword: "Aq@12345",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("Message");
    expect(res.body.error[0]).toBe("Please enter a valid email");
  });

  it("should return error(signup with empty password )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/signup`).send({
      username: "ramlal",
      email: "ramlal@gmail.com",
      password: "",
      confirmPassword: "Aq@12345",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("Message");
    expect(res.body.error[0]).toBe("Please enter a password");
  });

  it("should return error(signup with less char password )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/signup`).send({
      username: "ramlal",
      email: "ramlal@gmail.com",
      password: "ajsdhn",
      confirmPassword: "Aq@12345",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("Message");
    expect(res.body.error[0]).toBe(
      "Password must be at least 8 characters long"
    );
  });

  it("should return error(signup with char only password )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/signup`).send({
      username: "ramlal",
      email: "ramlal@gmail.com",
      password: "ajsdhnghjkhjkjkhjhhjdww",
      confirmPassword: "Aq@12345",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("Message");
    expect(res.body.error[0]).toBe(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  });

  it("should return error(signup with not match confirm password )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/signup`).send({
      username: "ramlal",
      email: "ramlal@gmail.com",
      password: "Aq@123456",
      confirmPassword: "Aq@12345",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe(
      "Password and confirm Password must be same"
    );
  });

  it("should return error(signup with existing email )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/signup`).send({
      username: "ramlal",
      email: "jojo@gmail.com",
      password: "Aq@12345",
      confirmPassword: "Aq@12345",
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.Message).toBe("This email already exists");
  });


  it("should return error(login with empty email )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/login`).send({
      email: "",
      password: "Aq@12345",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("Message");
    expect(res.body.error[0]).toBe("Please enter email");
  });

  it("should return error(login with invalid email )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/login`).send({
      email: "sdffggd",
      password: "Aq@12345",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("Message");
    expect(res.body.error[0]).toBe("Please enter a valid email");
  });

  it("should return error(login with empty password )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/login`).send({
      email: "jojo@gmail.com",
      password: "",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("Message");
    expect(res.body.error[0]).toBe("Please enter a password");
  });

  it("should return error(login with less char password )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/login`).send({
      email: "jojo@gmail.com",
      password: "ajsdhn",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("Message");
    expect(res.body.error[0]).toBe(
      "Password must be at least 8 characters long"
    );
  });


  it("should return error(login with wrong password )", async () => {
    const res = await request(app).post(`${Routes.AUTH}/login`).send({
      email: "jojo@gmail.com",
      password: "Aq@12345634234",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid Password");
  });

  it('should return error(remove with invalid id',async ()=>{
    const res = await request(app)
      .delete(`${Routes.AUTH}/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`);  
      expect(res.statusCode).toBe(404)
      expect(res.body.Message).toBe("User not found or Invalid Id");
  })

  it("should return error(remove with empty token)", async () => {
    const res = await request(app)
      .delete(`${Routes.AUTH}/${userId}`)
      .set("Authorization", `Bearer `);
    expect(res.statusCode).toBe(401);
    expect(res.body.Message).toBe("Invalid token");
  });

  it("should return error(remove with invalid token)", async () => {
    const res = await request(app)
      .delete(`${Routes.AUTH}/${userId}`)
      .set("Authorization", `Bearer ${nonExistentId}`);
    expect(res.statusCode).toBe(401);
    expect(res.body.Message).toBe("Invalid token");
  });
  afterAll(async ()=>{
    const res = await request(app)
      .delete(`${Routes.AUTH}/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  })
});
