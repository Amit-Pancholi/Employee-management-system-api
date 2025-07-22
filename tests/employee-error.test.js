const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Routes = require("../utils/routes");
const { startConnection, endConnection } = require("./connection-for-test");

beforeAll(startConnection);
afterAll(endConnection);

describe.skip("Employee error api", () => {
  let employee;
  let employee2;
  let departmentId;
  let sectionId;
  let nonExistentId = new mongoose.Types.ObjectId();

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

    // for create a test employee2
    const empRes2 = await request(app).post(Routes.EMPLOYEES).send({
      name: "jojo Verma",
      role: "Manager",
      phone: "9013245678",
      email: "jojoverma@example.com",
      department: departmentId,
      section: sectionId,
    });
    expect(empRes.statusCode).toBe(201);

    employee2 = empRes2.body.employee;
  });

  // ╔══════════════════════════════════════════════════════════════════════════════╗
  // ║                          EMPLOYEE CREATION TEST CASES                        ║
  // ║                                                                              ║
  // ║   📌 These tests validate the creation of employee records with various      ║
  // ║   input conditions including valid data, empty fields, short length,         ║
  // ║   invalid characters, and non-existent department/section references.        ║
  // ║                                                                              ║
  // ║   ✅ Goal: Ensure only correct, valid data results in successful creation    ║
  // ║   ❌ Catch all edge cases and validation failures                            ║
  // ║                                                                              ║
  // ║   Test Coverage:                                                             ║
  // ║     - Required fields: name, role, phone, email, department, section         ║
  // ║     - Format validation (letters only, valid email/phone, length checks)     ║
  // ║     - Reference validation (valid department/section ObjectId)               ║
  // ╚══════════════════════════════════════════════════════════════════════════════╝
  it("should return error(create using exist email)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "shyam Verma",
      role: "Manager",
      phone: "4362378928",
      email: "ravi.verma@example.com",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.Message).toBe("Email exist");
  });

  it("should return error(create using exist phone)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "shyam Verma",
      role: "Manager",
      phone: "9012345678",
      email: "shyam3289@example.com",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.Message).toBe("Phone exist");
  });

  it("should return error(empty name)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      role: "Intern",
      phone: "9000000001",
      email: "sneha.patel@example.com",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter name");
  });

  it("should return error(name is less then 2 char)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "t",
      role: "Intern",
      phone: "9000000001",
      email: "sneha.patel@example.com",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Name must be at least 2 characters long");
  });

  it("should return error(name have unexpeted char)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "Ps5",
      role: "Intern",
      phone: "9000000001",
      email: "sneha.patel@example.com",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Name can only contain letters and spaces");
  });

  it("should return error(empty role)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "Sneha Patel",
      role: "",
      phone: "9000000001",
      email: "sneha.patel@example.com",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter role");
  });

  it("should return error(role less then 2 char)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "Sneha Patel",
      role: "I",
      phone: "9000000001",
      email: "sneha.patel@example.com",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Role must be at least 2 characters long");
  });

  it("should return error(role have unexpected char)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "Sneha Patel",
      role: "In90",
      phone: "9000000001",
      email: "sneha.patel@example.com",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Role can only contain letters and spaces");
  });

  it("should return error(empty phone)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "Sneha Patel",
      role: "Intern",
      phone: "",
      email: "sneha.patel@example.com",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter a phone number");
  });

  it("should return error(phone less then min)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "Sneha Patel",
      role: "Intern",
      phone: "9887",
      email: "sneha.patel@example.com",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter a valid phone number");
  });

  it("should return error(phone more then max)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "Sneha Patel",
      role: "Intern",
      phone: "98877082765",
      email: "sneha.patel@example.com",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter a valid phone number");
  });

  it("should return error(phone has unexpected char)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "Sneha Patel",
      role: "Intern",
      phone: "9887(85763",
      email: "sneha.patel@example.com",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter a valid phone number");
  });

  it("should return error(empty email)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "Sneha Patel",
      role: "Intern",
      phone: "9000000001",
      email: "",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter email");
  });

  it("should return error(enter valid email)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "Sneha Patel",
      role: "Intern",
      phone: "9000000001",
      email: "ramlal42342",
      department: departmentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter a valid email");
  });

  it("should return error(enter valid department)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "Sneha Patel",
      role: "Intern",
      phone: "9000000001",
      email: "sneha.patel@example.com",
      department: nonExistentId,
      section: sectionId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid Department");
  });
  it("should return error(enter valid section)", async () => {
    const res = await request(app).post(Routes.EMPLOYEES).send({
      name: "Sneha Patel",
      role: "Intern",
      phone: "9000000001",
      email: "sneha.patel@example.com",
      department: departmentId,
      section: nonExistentId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid Section");
  });

  // ╔══════════════════════════════════════════════════════════════════════════════╗
  // ║                             EMPLOYEE UPDATE TESTS                            ║
  // ║                                                                              ║
  // ║   🔄 These tests validate the update operation for employee records.         ║
  // ║                                                                              ║
  // ║   ✅ Goal: Ensure existing employees can be updated with valid data          ║
  // ║   ❌ Handle invalid or missing fields during update                          ║
  // ║                                                                              ║
  // ║   Test Coverage:                                                             ║
  // ║     - Valid update (name, role, phone, email, department, section)          ║
  // ║     - Ensure changes persist and are returned correctly in response         ║
  // ║     - Prevent updates with invalid references or malformed inputs           ║
  // ╚══════════════════════════════════════════════════════════════════════════════╝

  it("should return error(no update fields sent)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
  });

  it("should return error(update using exist email)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "shyam Verma",
        role: "Manager",
        phone: "4362378928",
        email: employee2.email,
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.Message).toBe("Email exist");
  });

  it("should return error(update using exist phone)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "shyam Verma",
        role: "Manager",
        phone: employee2.phone,
        email: "shyam3289@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.Message).toBe("Phone exist");
  });
  it("should return error(update empty name)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        role: "Intern",
        phone: "9000000001",
        email: "sneha.patel@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter name");
  });

  it("should return error(update name is less then 2 char)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "t",
        role: "Intern",
        phone: "9000000001",
        email: "sneha.patel@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Name must be at least 2 characters long");
  });

  it("should return error(update name have unexpeted char)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "Ps5",
        role: "Intern",
        phone: "9000000001",
        email: "sneha.patel@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Name can only contain letters and spaces");
  });

  it("should return error(update empty role)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "Sneha Patel",
        role: "",
        phone: "9000000001",
        email: "sneha.patel@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter role");
  });

  it("should return error(update role less then 2 char)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "Sneha Patel",
        role: "I",
        phone: "9000000001",
        email: "sneha.patel@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Role must be at least 2 characters long");
  });

  it("should return error(update role have unexpected char)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "Sneha Patel",
        role: "In90",
        phone: "9000000001",
        email: "sneha.patel@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Role can only contain letters and spaces");
  });

  it("should return error(update empty phone)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "Sneha Patel",
        role: "Intern",
        phone: "",
        email: "sneha.patel@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter a phone number");
  });

  it("should return error(update phone less then min)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "Sneha Patel",
        role: "Intern",
        phone: "9887",
        email: "sneha.patel@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter a valid phone number");
  });

  it("should return error(update phone more then max)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "Sneha Patel",
        role: "Intern",
        phone: "98877082765",
        email: "sneha.patel@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter a valid phone number");
  });

  it("should return error(update phone has unexpected char)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "Sneha Patel",
        role: "Intern",
        phone: "9887(85763",
        email: "sneha.patel@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter a valid phone number");
  });

  it("should return error(update empty email)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "Sneha Patel",
        role: "Intern",
        phone: "9000000001",
        email: "",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter email");
  });

  it("should return error(update enter valid email)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "Sneha Patel",
        role: "Intern",
        phone: "9000000001",
        email: "ramlal42342",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error[0]).toBe("Please enter a valid email");
  });

  it("should return error(update enter valid department)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "Sneha Patel",
        role: "Intern",
        phone: "9000000001",
        email: "sneha.patel@example.com",
        department: nonExistentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid Department");
  });
  it("should return error(update enter valid section)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${employee._id}`)
      .send({
        name: "Sneha Patel",
        role: "Intern",
        phone: "9000000001",
        email: "sneha.patel@example.com",
        department: departmentId,
        section: nonExistentId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid Section");
  });

  it("should return error(update valid employee)", async () => {
    const res = await request(app)
      .put(`${Routes.EMPLOYEES}/${nonExistentId}`)
      .send({
        name: "Sneha Patel",
        role: "Intern",
        phone: "9000000001",
        email: "sneha.patel@example.com",
        department: departmentId,
        section: sectionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid Employee");
  });
  // ╔══════════════════════════════════════════════════════════════════════════════╗
  // ║                          EMPLOYEE GET REQUEST TESTS                          ║
  // ║                                                                              ║
  // ║   🔍 These tests validate the retrieval of employee data.                    ║
  // ║                                                                              ║
  // ║   ✅ Goal: Ensure employee data can be fetched correctly and consistently    ║
  // ║                                                                              ║
  // ║   Test Coverage:                                                             ║
  // ║     - GET /employees             → returns all employees                     ║
  // ║     - GET /employees/:id         → returns single employee by ID             ║
  // ║     - GET /employees/role/:role  → returns employees filtered by role        ║
  // ║     - GET /employees/department/:id → filtered by department ID              ║
  // ║     - GET /employees/section/:id → filtered by section ID                    ║
  // ║                                                                              ║
  // ║   🛑 Handles invalid or missing employee, role, department, or section IDs   ║
  // ╚══════════════════════════════════════════════════════════════════════════════╝

  it("should return error(invalid employee access)", async () => {
    const res = await request(app).get(`${Routes.EMPLOYEES}/${nonExistentId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.Message).toBe("Employee not found or removed");
  });

  it("should return error(invalid role)", async () => {
    const res = await request(app).get(`${Routes.EMPLOYEES}/role/tester`);

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid Role");
  });

  it("should return error(invalid department)", async () => {
    const res = await request(app).get(
      `${Routes.EMPLOYEES}/department/${nonExistentId}`
    );
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid Department");
  });

  it("should return error(invalid section)", async () => {
    const res = await request(app).get(
      `${Routes.EMPLOYEES}/section/${nonExistentId}`
    );
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid section");
  });

  it("should return error(remove invalid employee)", async () => {
    const res = await request(app).delete(
      `${Routes.EMPLOYEES}/${nonExistentId}`
    );
    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("invalid data");
  });
  afterAll(async () => {
    const deptRes = await request(app).delete(
      `${Routes.DEPARTMENTS}/${departmentId}`
    );
    expect(deptRes.statusCode).toBe(200);

    const secRes = await request(app).delete(`${Routes.SECTIONS}/${sectionId}`);
    expect(secRes.statusCode).toBe(200);

    const empRes = await request(app).delete(
      `${Routes.EMPLOYEES}/${employee._id}`
    );
    expect(empRes.statusCode).toBe(200);
  });
});
