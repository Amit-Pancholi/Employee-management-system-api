const request = require("supertest");
const app = require("../app");
const Routes = require("../utils/routes");
const { startConnection, endConnection } = require("./connection-for-test");

beforeAll(startConnection);
afterAll(endConnection);

describe("Employee API", () => {
  let employee;
  let departmentId;
  let sectionId;

  beforeAll(async () => {
    // for geting department id
    const deptRes = await request(app).post(Routes.DEPARTMENTS).send({
      name: "Engineering",
      description: "Handles product development and technical operations.",
    });
    expect(deptRes.statusCode).toBe(201);
    departmentId = deptRes.body.department._id;

    // for getting section id
    const secRes = await request(app).post(Routes.SECTIONS).send({
      name: "Frontend Development",
      department: departmentId,
    });
    expect(secRes.statusCode).toBe(201);
    sectionId = secRes.body.section._id;

    // for create a test employee
    const empRes = await request(app).post(Routes.EMPLOYEES).send({
      name: "Ravi Verma",
      role: "HR Manager",
      phone: "9012345678",
      email: "ravi.verma@example.com",
      department: departmentId,
      section: sectionId,
    });
    expect(empRes.statusCode).toBe(201);

    employee = empRes.body.employee;
  });

  it("should create employee", () => {
    expect(employee.name).toBe("Ravi Verma");
    expect(employee.role).toBe("HR Manager");
    expect(employee.phone).toBe("9012345678");
    expect(employee.email).toBe("ravi.verma@example.com");
    expect(employee).toHaveProperty("_id");
    expect(employee).toHaveProperty("department");
    expect(employee).toHaveProperty("section");
  });

  it("should return employee list", async () => {
    const res = await request(app).get(Routes.EMPLOYEES);

    expect(res.statusCode).toBe(200);
    expect(res.body.employee.length).toBeGreaterThan(0);
  });

  it("should return employee data by id", async () => {
    const res = await request(app).get(`${Routes.EMPLOYEES}/${employee._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.employee.name).toBe("Ravi Verma");
    expect(res.body.employee.role).toBe("HR Manager");
    expect(res.body.employee.phone).toBe("9012345678");
    expect(res.body.employee.email).toBe("ravi.verma@example.com");
    expect(res.body.employee.department.name).toBe("Engineering");
    expect(res.body.employee.section.name).toBe("Frontend Development");
  });

  it("should return employees by role", async () => {
    const res = await request(app).get(
      `${Routes.EMPLOYEES}/role/${employee.role}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.employee.length).toBeGreaterThan(0);
  });

  it("should return employees by department", async () => {
    const res = await request(app).get(
      `${Routes.EMPLOYEES}/department/${employee.department}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.employee.length).toBeGreaterThan(0);
  });

  it("should return employee by section", async () => {
    const res = await request(app).get(
      `${Routes.EMPLOYEES}/section/${employee.section}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.employee.length).toBeGreaterThan(0);
  });
  it("should update employee", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "shyam Verma",
        role: "Manager",
        phone: "9012345678",
        email: "shyam.verma@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.employee).toEqual(
      expect.objectContaining({
        name: "shyam Verma",
        role: "Manager",
        phone: "9012345678",
        email: "shyam.verma@example.com",
      })
    );
  });
  it("should remove employee", async () => {
    const res = await request(app).delete(
      `${Routes.EMPLOYEES}/${employee._id}`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.Message).toBe("Successfully remove employee");
    expect(res.body.employee).toEqual(
      expect.objectContaining({
        name: "shyam Verma",
        role: "Manager",
        phone: "9012345678",
        email: "shyam.verma@example.com",
      })
    );
  });
  afterAll(async () => {
    const deptRes = await request(app).delete(
      `${Routes.DEPARTMENTS}/${departmentId}`
    );
    expect(deptRes.statusCode).toBe(200);

    const secRes = await request(app).delete(`${Routes.SECTIONS}/${sectionId}`);
    expect(secRes.statusCode).toBe(200);
  });
});
