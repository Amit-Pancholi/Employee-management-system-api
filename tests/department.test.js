const request = require("supertest");
const app = require("../app");
const Routes = require("../utils/routes");
const { startConnection, endConnection } = require("./connection-for-test");

beforeAll(startConnection);
afterAll(endConnection);

describe("Department API", () => {
  let department;
  let token;
  let userId;

  beforeAll(async () => {
    const signUpRes = await request(app).post(`${Routes.AUTH}/signup`).send({
      username: "tester",
      email: "test@gmail.com",
      password: "Aq@12345",
      confirmPassword: "Aq@12345",
    });

    const loginRes = await request(app).post(`${Routes.AUTH}/login`).send({
      email: "test@gmail.com",
      password: "Aq@12345",
    });

    token = loginRes.body.token;
    userId = loginRes.body.user.id;
  });
  it("should create department", async () => {
    const res = await request(app)
      .post(Routes.DEPARTMENTS)
      .send({
        name: "Marketing",
        description: "Focuses on branding, advertising, and market research.",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.department).toEqual(
      expect.objectContaining({
        name: "Marketing",
        description: "Focuses on branding, advertising, and market research.",
      })
    );
    department = res.body.department;
  });

  it("should return department list", async () => {
    const res = await request(app)
      .get(Routes.DEPARTMENTS)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.department.length).toBeGreaterThan(0);
  });

  it("should return department by id", async () => {
    const res = await request(app)
      .get(`${Routes.DEPARTMENTS}/${department._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.department).toEqual(
      expect.objectContaining({
        name: "Marketing",
        description: "Focuses on branding, advertising, and market research.",
      })
    );
  });

  it("should update department", async () => {
    const res = await request(app)
      .put(`${Routes.DEPARTMENTS}/${department._id}`)
      .send({
        name: "Finance",
        description: "Handles budgeting, auditing, and financial planning.",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.department).toEqual(
      expect.objectContaining({
        name: "Finance",
        description: "Handles budgeting, auditing, and financial planning.",
      })
    );
  });

  it("should remove department", async () => {
    const res = await request(app)
      .delete(`${Routes.DEPARTMENTS}/${department._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.department.isDelete).toBe(true);
  });

  afterAll(async () => {
    const uesrRemove = await request(app)
      .delete(`${Routes.AUTH}/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(uesrRemove.statusCode).toBe(200);
  });
});
