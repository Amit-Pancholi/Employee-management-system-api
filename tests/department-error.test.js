const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Routes = require("../utils/routes");
const { startConnection, endConnection } = require("./connection-for-test");

beforeAll(startConnection);
afterAll(endConnection);

describe.skip("Department error test", () => {
  let departmentId;
  let nonExistentId = new mongoose.Types.ObjectId();

  beforeAll(async () => {
    const res = await request(app).post(Routes.DEPARTMENTS).send({
      name: "Marketing",
      description: "Focuses on branding, advertising, and market research.",
    });
    expect(res.statusCode).toBe(201);
    departmentId = res.body.department._id;
  });

  it("should return error(empty name) in creating department", async () => {
    const res = await request(app).post(Routes.DEPARTMENTS).send({
      description: "testing section for test name send .",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    // console.log(res.body.error)
    expect(res.body.error[0]).toBe("Please enter name");
  });

  it("should return error(small name) creating department", async () => {
    const res = await request(app).post(Routes.DEPARTMENTS).send({
      name: "t",
      description: "testing section for test name send .",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    // console.log(res.body.error)
    expect(res.body.error[0]).toBe("Name must be at least 2 characters long");
  });

  it("should return error(wrong char in name)", async () => {
    const res = await request(app).post(Routes.DEPARTMENTS).send({
      name: "te#",
      description: "testing section for test name send .",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    // console.log(res.body.error)
    expect(res.body.error[0]).toBe("Name can only contain letters and spaces");
  });

  it("should return error(update empty name)", async () => {
    const res = await request(app)
      .put(`${Routes.DEPARTMENTS}/${departmentId}`)
      .send({
        description: "testing section for test name send .",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    // console.log(res.body.error)
    expect(res.body.error[0]).toBe("Please enter name");
  });

  it("should return error(update name less then 2 char)", async () => {
    const res = await request(app)
      .put(`${Routes.DEPARTMENTS}/${departmentId}`)
      .send({
        name: "t",
        description: "testing section for test name send .",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    // console.log(res.body.error)
    expect(res.body.error[0]).toBe("Name must be at least 2 characters long");
  });

  it("should return error(wrong char in name)", async () => {
    const res = await request(app)
      .put(`${Routes.DEPARTMENTS}/${departmentId}`)
      .send({
        name: "te$",
        description: "testing section for test name send .",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body.error[0]).toBe("Name can only contain letters and spaces");
  });

  it("should return error(use wrong ID in find)", async () => {
    const res = await request(app).get(`${Routes.DEPARTMENTS}/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.Message).toBe("Department not found or removed");
  });

  it("should return error(use wrong ID in remove)", async () => {
    const res = await request(app).delete(
      `${Routes.DEPARTMENTS}/${nonExistentId}`
    );
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("invalid department");
  });

  afterAll(async () => {
    const res = await request(app).delete(
      `${Routes.DEPARTMENTS}/${departmentId}`
    );
    expect(res.statusCode).toBe(200);
  });
});
