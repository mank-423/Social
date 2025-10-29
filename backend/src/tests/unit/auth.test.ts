import request from "supertest";
import { app } from "../../lib/socket"; // or from "../app" if your app is exported there
import mongoose from "mongoose";

describe("POST /api/auth/signup", () => {
  it("should create a new user successfully", async () => {
    const newUser = {
      fullName: "John Doe",
      email: "john@example.com",
      password: "Password123!",
    };

    const response = await request(app)
      .post("/api/auth/signup")
      .send(newUser)
      .expect(201);

    // Check structure
    expect(response.body).toHaveProperty("status", true);
    expect(response.body).toHaveProperty("message", "User created successfully");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("email", newUser.email);
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ email: "", password: "" })
      .expect(400);

    expect(response.body.status).toBe(false);
    expect(response.body).toHaveProperty("error");
  });

  it("should not allow duplicate email signup", async () => {
    const user = {
      fullName: "Alice",
      email: "alice@example.com",
      password: "Secret123!",
    };

    // First signup
    await request(app).post("/api/auth/signup").send(user).expect(201);

    // Second signup with same email
    const response = await request(app).post("/api/auth/signup").send(user).expect(400);

    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Error in credentials");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
