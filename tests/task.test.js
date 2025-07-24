const request = require("supertest");
const app = require("../app");
const Routes = require("../utils/routes");
const { startConnection, endConnection } = require("./connection-for-test");

beforeAll(startConnection);
afterAll(endConnection);

describe("Task API", () => {
  let employeeId;
  let departmentId;
  let sectionId;
  let task;
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

    // for getting section id
    const secRes = await request(app)
      .post(Routes.SECTIONS)
      .send({
        name: "Frontend Development",
        department: departmentId,
      })
      .set("Authorization", `Bearer ${token}`);
    expect(secRes.statusCode).toBe(201);
    sectionId = secRes.body.section._id;

    // for create a test employee
    const empRes = await request(app)
      .post(Routes.EMPLOYEES)
      .send({
        name: "Ravi Verma",
        role: "HR Manager",
        phone: "9012345678",
        email: "ravi.verma@example.com",
        department: departmentId,
        section: sectionId,
      })
      .set("Authorization", `Bearer ${token}`);
    expect(empRes.statusCode).toBe(201);

    employeeId = empRes.body.employee._id;

    const taskRes = await request(app)
      .post(Routes.TASKS)
      .send({
        taskName: "Finish API Integration",
        description: "Connect the frontend with the employee management API.",
        status: "pending", // optional, defaults to "pending"
        employee: employeeId, // replace with actual ObjectId from test setup
      })
      .set("Authorization", `Bearer ${token}`);
    expect(taskRes.statusCode).toBe(201);
    task = taskRes.body.task;
  });
  // ╔══════════════════════════════════════════════════════════════════════════════╗
  // ║                            ✅ TASK API TEST CASES                            ║
  // ║                                                                              ║
  // ║   📌 Purpose: Ensure correct functionality of Task-related operations.       ║
  // ║                                                                              ║
  // ║   🧪 Covered Scenarios:                                                      ║
  // ║     - Creating a task with valid data                                        ║
  // ║     - Updating task information                                              ║
  // ║     - Fetching all tasks or a single task by ID                              ║
  // ║     - Deleting or archiving tasks (if applicable)                            ║
  // ║                                                                              ║
  // ║   🚫 Error/Validation scenarios not tested in this suite                     ║
  // ╚══════════════════════════════════════════════════════════════════════════════╝
  it("should create task", () => {
    expect(task).toEqual(
      expect.objectContaining({
        taskName: "Finish API Integration",
        description: "Connect the frontend with the employee management API.",
        status: "pending", // optional, defaults to "pending"
        employee: employeeId, // replace with actual ObjectId from test setup
      })
    );
    expect(task).toHaveProperty("_id");
  });

  it("should update task", async () => {
    const res = await request(app)
      .put(`${Routes.TASKS}/${task._id}`)
      .send({
        taskName: "API Integration",
        description: "Connect the frontend with the employee management API.",
        status: "in progress",
        employee: employeeId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.Message).toBe("task update successfully");
  });

  it("should return task list", async () => {
    const res = await request(app)
      .get(Routes.TASKS)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.task.length).toBeGreaterThan(0);
  });

  it("should return task by Id", async () => {
    const res = await request(app)
      .get(`${Routes.TASKS}/${task._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("task");
  });

  it("should return task by employee", async () => {
    const res = await request(app)
      .get(`${Routes.TASKS}/employee/${employeeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("task");
  });

  it("should remove task", async () => {
    const res = await request(app)
      .delete(`${Routes.TASKS}/${task._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.Message).toBe("task remove successfully");
  });
  afterAll(async () => {
    // remove test department
    const deptRes = await request(app)
      .delete(`${Routes.DEPARTMENTS}/${departmentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deptRes.statusCode).toBe(200);

    // remove test section
    const secRes = await request(app)
      .delete(`${Routes.SECTIONS}/${sectionId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(secRes.statusCode).toBe(200);

    // remove employee section
    const empRes = await request(app)
      .delete(`${Routes.EMPLOYEES}/${employeeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(empRes.statusCode).toBe(200);

    const uesrRemove = await request(app)
      .delete(`${Routes.AUTH}/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(uesrRemove.statusCode).toBe(200);
  });
});
