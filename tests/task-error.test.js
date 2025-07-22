const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Routes = require("../utils/routes");
const { startConnection, endConnection } = require("./connection-for-test");

beforeAll(startConnection);
afterAll(endConnection);

describe("Task API error", () => {
  let employeeId;
  let departmentId;
  let sectionId;
  let task;
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

    employeeId = empRes.body.employee._id;

    const taskRes = await request(app).post(Routes.TASKS).send({
      taskName: "Finish API Integration",
      description: "Connect the frontend with the employee management API.",
      status: "pending", // optional, defaults to "pending"
      employee: employeeId, // replace with actual ObjectId from test setup
    });
    expect(taskRes.statusCode).toBe(201);
    task = taskRes.body.task;
  });
  // ╔══════════════════════════════════════════════════════════════════════════════════╗
  // ║                    ❌ TASK CREATION ERROR TEST CASES                             ║
  // ║                                                                                  ║
  // ║   🧪 Purpose: Ensure proper validation and error responses during task creation.  ║
  // ║                                                                                  ║
  // ║   🔍 Covered Scenarios:                                                           ║
  // ║     - Missing required fields (taskName or employee)                              ║
  // ║     - Invalid employee ObjectId                                                   ║
  // ║     - Invalid enum value for status (e.g. "done")                                 ║
  // ║                                                                                  ║
  // ║   ✅ Confirms that invalid task creation requests are correctly rejected.         ║
  // ╚══════════════════════════════════════════════════════════════════════════════════╝

  it("should return error(creating with empty name)", async () => {
    const res = await request(app).post(Routes.TASKS).send({
      taskName: "",
      description: "Add comprehensive tests for the task routes.",
      status: "completed",
      employee: employeeId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body.error[0]).toBe("Please enter task name");
  });

  it("should return error(creating with name has less than 2 char)", async () => {
    const res = await request(app).post(Routes.TASKS).send({
      taskName: "w",
      description: "Add comprehensive tests for the task routes.",
      status: "completed",
      employee: employeeId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body.error[0]).toBe(
      "Task name must be at least 2 characters long"
    );
  });

  it("should return error(creating with name has unexpected char)", async () => {
    const res = await request(app).post(Routes.TASKS).send({
      taskName: "write 2386",
      description: "Add comprehensive tests for the task routes.",
      status: "completed",
      employee: employeeId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body.error[0]).toBe(
      "Task name can only contain letters and spaces"
    );
  });
  it("should return error(creating with unexpected status)", async () => {
    const res = await request(app).post(Routes.TASKS).send({
      taskName: "write test case",
      description: "Add comprehensive tests for the task routes.",
      status: "comp",
      employee: employeeId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body.error[0]).toBe(
      "Please enter status like pending,in progress or completed"
    );
  });

  it("should return error(creating without employee Id)", async () => {
    const res = await request(app).post(Routes.TASKS).send({
      taskName: "write test case",
      description: "Add comprehensive tests for the task routes.",
      status: "completed",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("please send employees");
  });

  it("should return error(creating with invalid employee Id)", async () => {
    const res = await request(app).post(Routes.TASKS).send({
      taskName: "write test case",
      description: "Add comprehensive tests for the task routes.",
      status: "completed",
      employee: nonExistentId,
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.Message).toBe("Employee not found");
  });
  // ╔═══════════════════════════════════════════════════════════════════════════════=======═╗
  // ║                     ❌ TASK UPDATE ERROR TEST CASES                                   ║
  // ║                                                                                       ║
  // ║   🧪 Purpose: Ensure validation and error handling during task updates.               ║
  // ║                                                                                       ║
  // ║   🔍 Covered Scenarios:                                                               ║
  // ║     - Updating with missing required fields (e.g., taskName, employee)                ║
  // ║     - Providing an invalid task ID (malformed or non-existent)                        ║
  // ║     - Setting invalid status values (not in ['pending', 'in progress', 'completed'])  ║
  // ║                                                                                       ║
  // ║   ✅ Confirms that the API responds correctly to invalid update requests.             ║
  // ╚═══════════════════════════════════════════════════════════════════════════════=====══=╝
  it("should return error(updating with empty data)", async () => {
    const res = await request(app).put(`${Routes.TASKS}/${task._id}`).send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
  });
  it("should return error(updating with empty name)", async () => {
    const res = await request(app).put(`${Routes.TASKS}/${task._id}`).send({
      taskName: "",
      description: "Add comprehensive tests for the task routes.",
      status: "completed",
      employee: employeeId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body.error[0]).toBe("Please enter task name");
  });

  it("should return error(updating with name has less than 2 char)", async () => {
    const res = await request(app).put(`${Routes.TASKS}/${task._id}`).send({
      taskName: "w",
      description: "Add comprehensive tests for the task routes.",
      status: "completed",
      employee: employeeId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body.error[0]).toBe(
      "Task name must be at least 2 characters long"
    );
  });

  it("should return error(updating with name has unexpected char)", async () => {
    const res = await request(app).put(`${Routes.TASKS}/${task._id}`).send({
      taskName: "write 2386",
      description: "Add comprehensive tests for the task routes.",
      status: "completed",
      employee: employeeId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body.error[0]).toBe(
      "Task name can only contain letters and spaces"
    );
  });
  it("should return error(updating with unexpected status)", async () => {
    const res = await request(app).put(`${Routes.TASKS}/${task._id}`).send({
      taskName: "write test case",
      description: "Add comprehensive tests for the task routes.",
      status: "comp",
      employee: employeeId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Error occure in sending data");
    expect(res.body.error[0]).toBe(
      "Please enter status like pending,in progress or completed"
    );
  });

  it("should return error(updating without employee Id)", async () => {
    const res = await request(app).put(`${Routes.TASKS}/${task._id}`).send({
      taskName: "write test case",
      description: "Add comprehensive tests for the task routes.",
      status: "completed",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid Employee");
  });

  it("should return error(updating with invalid employee Id)", async () => {
    const res = await request(app).put(`${Routes.TASKS}/${task._id}`).send({
      taskName: "write test case",
      description: "Add comprehensive tests for the task routes.",
      status: "completed",
      employee: nonExistentId,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.Message).toBe("Invalid Employee");
  });
  // ╔════════════════════════════════════════════════════════════════════════════════════════╗
  // ║                   ❌ TASK GET & DELETE ERROR TEST CASES                                ║
  // ║                                                                                        ║
  // ║   🧪 Purpose: Verify error handling for invalid or failed GET and DELETE operations.   ║
  // ║                                                                                        ║
  // ║   🔍 Covered Scenarios:                                                                ║
  // ║     - Fetching task with invalid or non-existent ID                                    ║
  // ║     - Deleting task with invalid or non-existent ID                                    ║
  // ║     - Handling improperly formatted ObjectId                                           ║
  // ║                                                                                        ║
  // ║   ✅ Confirms the API returns appropriate status codes and error messages.             ║
  // ╚════════════════════════════════════════════════════════════════════════════════════════╝
it('should return error(get by invalid Id)',async()=>{
    const res = await request(app).get(`${Routes.TASKS}/${nonExistentId}`)
    expect(res.statusCode).toBe(400)
    expect(res.body.Message).toBe("Bad request : task not find or removed");
})

it("should return error(get by invalid employee Id)", async () => {
  const res = await request(app).get(`${Routes.TASKS}/employee/${nonExistentId}`);
  expect(res.statusCode).toBe(400);
  expect(res.body.Message).toBe("Bad request : task not find");
});

it("should return error(remove with invalid employee Id)", async () => {
  const res = await request(app).delete(
    `${Routes.TASKS}/${nonExistentId}`
  );
  expect(res.statusCode).toBe(400);
  expect(res.body.Message).toBe("invalid task");
});
  afterAll(async () => {
    // remove test department
    const deptRes = await request(app).delete(
      `${Routes.DEPARTMENTS}/${departmentId}`
    );
    expect(deptRes.statusCode).toBe(200);

    // remove test section
    const secRes = await request(app).delete(`${Routes.SECTIONS}/${sectionId}`);
    expect(secRes.statusCode).toBe(200);

    // remove employee section
    const empRes = await request(app).delete(
      `${Routes.EMPLOYEES}/${employeeId}`
    );
    expect(empRes.statusCode).toBe(200);

    // remove test task
    const taskRes = await request(app).delete(`${Routes.TASKS}/${task._id}`);
    expect(taskRes.statusCode).toBe(200);
  });
});
