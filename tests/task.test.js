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
    expect(task).toHaveProperty('_id')
  });

  it('should update task', async()=>{
    const res = await request(app).put(`${Routes.TASKS}/${task._id}`).send({
      taskName: "API Integration",
      description: "Connect the frontend with the employee management API.",
      status: "in progress",
      employee: employeeId, 
    });

    expect(res.statusCode).toBe(200)
    expect(res.body.Message).toBe("task update successfully");
  })

  it('should return task list', async ()=>{
    const res = await request(app).get(Routes.TASKS)

    expect(res.statusCode).toBe(200)
    expect(res.body.task.length).toBeGreaterThan(0)
  })

  it('should return task by Id',async()=>{
    const res = await request(app).get(`${Routes.TASKS}/${task._id}`)
    expect(res.statusCode).toBe(200);
   expect(res.body).toHaveProperty('task')
  })

  it('should return task by employee',async ()=>{
    const res = await request(app).get(`${Routes.TASKS}/employee/${employeeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("task");
   
  })

  it('should remove task',async ()=>{
    const res = await request(app).delete(`${Routes.TASKS}/${task._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.Message).toBe("task remove successfully");
  })
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
  });
});
