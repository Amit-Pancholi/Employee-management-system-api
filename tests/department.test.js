const request = require("supertest");
const app = require("../app");
const Routes = require("../utils/routes");
const { startConnection, endConnection } = require("./connection-for-test");

beforeAll(startConnection);
afterAll(endConnection);

describe("Department API", () => {
  let department;

  it("should create department", async () => {
    const res = await request(app).post(Routes.DEPARTMENTS).send({
      name: "Marketing",
      description: "Focuses on branding, advertising, and market research.",
    });
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
    const res = await request(app).get(Routes.DEPARTMENTS);

    expect(res.statusCode).toBe(200);
    expect(res.body.department.length).toBeGreaterThan(0);
  });

  it("should return department by id", async () => {
    const res = await request(app).get(
      `${Routes.DEPARTMENTS}/${department._id}`
    );

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
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.department).toEqual(
        expect.objectContaining({
          name: "Finance",
          description: "Handles budgeting, auditing, and financial planning.",
        })
      );
  });

  it('should remove department', async()=>{
    const res = await request(app).delete(
      `${Routes.DEPARTMENTS}/${department._id}`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.department.isDelete).toBe(true)
  })
});
