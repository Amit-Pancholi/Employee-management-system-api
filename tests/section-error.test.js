const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Routes = require("../utils/routes");
const { startConnection, endConnection } = require("./connection-for-test");

beforeAll(startConnection);
afterAll(endConnection);

describe("Section API errors", () => {
  let departmentId;
  let section;
  let section2;
  let token;
  let userId;
  let nonExistentId = new mongoose.Types.ObjectId();

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
    // for geting department id
    const deptRes = await request(app)
      .post(Routes.DEPARTMENTS)
      .send({
        name: "Engineering",
        description: "Handles product development and technical operations.",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(deptRes.statusCode).toBe(201);
    departmentId = deptRes.body.department._id;
    // for getting section
    const secRes = await request(app)
      .post(Routes.SECTIONS)
      .send({
        name: "Frontend Development",
        department: departmentId,
      })
      .set("Authorization", `Bearer ${token}`);
    expect(secRes.statusCode).toBe(201);
    section = secRes.body.section;

    // for getting section2
    const secRes2 = await request(app)
      .post(Routes.SECTIONS)
      .send({
        name: "Testing team",
        department: departmentId,
      })
      .set("Authorization", `Bearer ${token}`);
    expect(secRes2.statusCode).toBe(201);
    section2 = secRes2.body.section;
  });
  // ╔══════════════════════════════════════════════════════════════════════════════╗
  // ║                         SECTION CREATION ERROR TESTS                         ║
  // ║                                                                              ║
  // ║   ❌ These tests ensure that invalid section creation requests are caught    ║
  // ║      and rejected appropriately.                                             ║
  // ║                                                                              ║
  // ║   ✅ Goal: Validate input and error handling for section creation:           ║
  // ║     - Missing name                                                           ║
  // ║     - Missing department                                                     ║
  // ║     - Invalid department (nonexistent ObjectId or deleted)                   ║
  // ║     - Duplicate name under the same department (if not allowed)              ║
  // ╚══════════════════════════════════════════════════════════════════════════════╝
  it("should return error(creating with empty name)", async () => {
    const res = await request(app)
      .post(Routes.SECTIONS)
      .send({
        department: departmentId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure during sending data");
    expect(res.body.error[0]).toBe("Please enter name");
  });
  it("should return error(creating with name less then 2 char)", async () => {
    const res = await request(app)
      .post(Routes.SECTIONS)
      .send({
        name: "t",
        department: departmentId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure during sending data");
    expect(res.body.error[0]).toBe("Name must be at least 2 characters long");
  });
  it("should return error(creating with name has unexpected char)", async () => {
    const res = await request(app)
      .post(Routes.SECTIONS)
      .send({
        name: "te@",
        department: departmentId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure during sending data");
    expect(res.body.error[0]).toBe("Name can only contain letters and spaces");
  });

  it("should return error(creating with wrong department id)", async () => {
    const res = await request(app)
      .post(Routes.SECTIONS)
      .send({
        name: "testing team",
        department: nonExistentId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid Department");
  });

  it("should return error(creating with existing section in department)", async () => {
    const res = await request(app)
      .post(Routes.SECTIONS)
      .send({
        name: "Frontend Development",
        department: departmentId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(409);
    expect(res.body.Message).toBe("Section Exist");
  });

  // ╔═══════════════════════════════════════════════════════════════════════════╗
  // ║                      SECTION UPDATE ERROR TEST CASES                      ║
  // ║                                                                           ║
  // ║ ❌ These tests ensure the system handles invalid update attempts          ║
  // ║    gracefully and provides appropriate validation messages.               ║
  // ║                                                                           ║
  // ║ 🔍 Test Coverage:                                                         ║
  // ║    - Missing or empty name field                                          ║
  // ║    - Name too short or contains invalid characters                        ║
  // ║    - Missing or invalid department ID                                     ║
  // ║    - Invalid or non-existent section ID in URL                            ║
  // ║                                                                           ║
  // ║ 📌 These help validate middleware, Mongoose validation, and controller    ║
  // ║    logic for update route error paths.                                    ║
  // ╚═══════════════════════════════════════════════════════════════════════════╝

  it("should return error(updating with empty data)", async () => {
    const res = await request(app)
      .put(`${Routes.SECTIONS}/${section._id}`)
      .send({})
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure during sending data");
  });

  it("should return error(updating with empty name)", async () => {
    const res = await request(app)
      .put(`${Routes.SECTIONS}/${section._id}`)
      .send({
        department: departmentId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure during sending data");
    expect(res.body.error[0]).toBe("Please enter name");
  });
  it("should return error(updating with name less then 2 char)", async () => {
    const res = await request(app)
      .put(`${Routes.SECTIONS}/${section._id}`)
      .send({
        name: "t",
        department: departmentId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure during sending data");
    expect(res.body.error[0]).toBe("Name must be at least 2 characters long");
  });
  it("should return error(updating with name has unexpected char)", async () => {
    const res = await request(app)
      .put(`${Routes.SECTIONS}/${section._id}`)
      .send({
        name: "te@",
        department: departmentId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure during sending data");
    expect(res.body.error[0]).toBe("Name can only contain letters and spaces");
  });

  it("should return error(updating with wrong department id)", async () => {
    const res = await request(app)
      .put(`${Routes.SECTIONS}/${section._id}`)
      .send({
        name: "testing team",
        department: nonExistentId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid Department");
  });

  it("should return error(updating with existing section in department)", async () => {
    const res = await request(app)
      .put(`${Routes.SECTIONS}/${section._id}`)
      .send({
        name: section2.name,
        department: departmentId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Section Exist");
  });
  // ╔═══════════════════════════════════════════════════════════════════════════╗
  // ║                     SECTION GET REQUEST ERROR TEST CASES                  ║
  // ║                                                                           ║
  // ║ ❌ These tests verify that invalid GET requests are properly handled:     ║
  // ║    - Invalid or non-existent Section ID                                  ║
  // ║    - Invalid or non-existent Department ID                               ║
  // ║    - Malformed or missing parameters in request                          ║
  // ║                                                                           ║
  // ║ 🔍 Test Coverage:                                                         ║
  // ║    - GET /sections/:id with bad ID → 400 or 404                          ║
  // ║    - GET /sections/department/:id → invalid department → 400             ║
  // ║    - Ensure clear error messages for missing/invalid input               ║
  // ║                                                                           ║
  // ║ 📌 Ensures robust validation and safe API behavior in error scenarios.   ║
  // ╚═══════════════════════════════════════════════════════════════════════════╝

  it("should return error(get by Id)", async () => {
    const res = await request(app)
      .get(`${Routes.SECTIONS}/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.Message).toBe("section not found or removed");
  });

  it("should return error(get by department)", async () => {
    const res = await request(app)
      .get(`${Routes.SECTIONS}/department/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid department");
  });

  it("should return error(remove by Id", async () => {
    const res = await request(app)
      .delete(`${Routes.SECTIONS}/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("invalid section");
  });

  afterAll(async () => {
    const deptRes = await request(app)
      .delete(`${Routes.DEPARTMENTS}/${departmentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deptRes.statusCode).toBe(200);
    const secRes = await request(app)
      .delete(`${Routes.SECTIONS}/${section._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(secRes.statusCode).toBe(200);
    const secRes2 = await request(app)
      .delete(`${Routes.SECTIONS}/${section2._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(secRes2.statusCode).toBe(200);

    const uesrRemove = await request(app)
      .delete(`${Routes.AUTH}/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(uesrRemove.statusCode).toBe(200);
  });
});
