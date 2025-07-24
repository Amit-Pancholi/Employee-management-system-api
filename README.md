# 🧾 Employee Management System API

A RESTful API for managing employee data with secure authentication and GitHub Actions CI/CD automation.

---

## 🚀 Features

- CRUD operations for:
  - Employees
  - Departments
  - Positions
- JWT-based user authentication
- MongoDB for data storage
- `.env` support for environment variables
- Dockerized for containerized deployment
- GitHub Actions for CI/CD:
  - Runs tests on push
  - Auto-merge to master on successful test

---

## 📦 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT
- **CI/CD:** GitHub Actions
- **Containerization:** Docker

---

## 🔧 Installation

```bash
git clone https://github.com/Amit-Pancholi/Employee-management-system-api.git
cd Employee-management-system-api
npm install
```

---

## 🔐 Environment Configuration

Create a `.env` file in the root directory with:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret
```

---

## ▶️ Running the Project Locally

```bash
npm start
```

The API will be available at:  
`http://localhost:3000`

---

## 🧪 Running Tests

```bash
npm test
```

> If you face timeout errors in async hooks, increase the timeout:

```js
jest.setTimeout(15000);
```

---

## 🐳 Docker Support

### Build Docker Image

```bash
docker build -t employee-api .
```

### Run Docker Container

```bash
docker run --env-file .env -p 3000:3000 employee-api
```

---

## ⚙️ GitHub Actions Workflow

This project includes a GitHub Actions workflow for:

- Setting up Node.js
- Installing dependencies
- Running tests
- Creating `.env` file from secrets
- Auto-merging branches to `master` if tests pass

> You must add the following secrets in your GitHub repository:
- `MONGO_URI`
- `PORT`
- `JWT_SECRET`
- `PAT_TOKEN` (for auto-merge)

---

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       └── githubCiCd.yaml
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
├── test/
├── Dockerfile
├── .env.example
├── package.json
└── README.md
```

---

## 🧑‍💻 Contributing

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 📫 Author

**Amit Kumar Pancholi**  
 [GitHub Profile](https://github.com/Amit-Pancholi)