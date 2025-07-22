const request = require("supertest");
const app = require("../app");
const Routes = require("../utils/routes");
const { startConnection, endConnection } = require("./connection-for-test");

beforeAll(startConnection);
afterAll(endConnection);

describe("Section API", () => {
  let departmentId;
  let section;
  beforeAll(async () => {
    // for geting department id
    const deptRes = await request(app).post(Routes.DEPARTMENTS).send({
      name: "Engineering",
      description: "Handles product development and technical operations.",
    });
    expect(deptRes.statusCode).toBe(201);
    departmentId = deptRes.body.department._id;
    // for getting section
    const secRes = await request(app).post(Routes.SECTIONS).send({
      name: "Frontend Development",
      department: departmentId,
    });
    expect(secRes.statusCode).toBe(201);
    section = secRes.body.section;
  });
  // ╔═══════════════════════════════════════════════════════════════════════════╗
  // ║                          SECTION API TEST CASES                           ║
  // ║                                                                           ║
  // ║ ✅ Tests CRUD operations for the Section model, including:                ║
  // ║    - Creation with valid department                                      ║
  // ║    - Updating section name                                               ║
  // ║    - Fetching by ID and department                                       ║
  // ║    - Listing all sections                                                ║
  // ║    - Deleting section and its cleanup                                    ║
  // ╚═══════════════════════════════════════════════════════════════════════════╝

  it("should create section", () => {
    expect(section).toEqual(
      expect.objectContaining({
        name: "Frontend Development",
        department: departmentId,
      })
    );
    expect(section).toHaveProperty("_id");
  });
  it("should return updated section", async () => {
    const res = await request(app)
      .put(`${Routes.SECTIONS}/${section._id}`)
      .send({
        name: "backend Development",
        department: departmentId,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.Message).toBe("section update successfully");
    expect(res.body).toHaveProperty("section");
  });

  it("should return section list", async () => {
    const res = await request(app).get(Routes.SECTIONS);
    expect(res.statusCode).toBe(200);
    expect(res.body.section.length).toBeGreaterThan(0);
  });

  it("should return section by id", async () => {
    const res = await request(app).get(`${Routes.SECTIONS}/${section._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("section");
  });

  it("should return section by department", async () => {
    const res = await request(app).get(
      `${Routes.SECTIONS}/department/${departmentId}`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.section.length).toBeGreaterThan(0);
  });

  it("should remove section", async () => {
    const res = await request(app).delete(`${Routes.SECTIONS}/${section._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.Message).toBe("Section remove successfully");
  });
  afterAll(async () => {
    const deptRes = await request(app).delete(
      `${Routes.DEPARTMENTS}/${departmentId}`
    );
    expect(deptRes.statusCode).toBe(200);
  });
});
