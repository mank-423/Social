import request from "supertest";
import { app } from "../../lib/socket"; // or from "../app" if your app is exported there
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

// Mockup for cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: 'https://fake-cloudinary.com/image123.jpg',
      }),
    },
  },
}));

// Sign up
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

// Login
describe('POST /api/auth/login', () => {
  it("should login user successfully", async () => {

    const newUser = {
      fullName: "John Doe",
      email: "john@example.com",
      password: "Password123!",
    };

    // Sign up
    await request(app).post("/api/auth/signup").send(newUser).expect(201);

    const user = {
      email: "john@example.com",
      password: "Password123!",
    };

    // Login the user
    const res = await request(app).post('/api/auth/login').send(user).expect(200);

    expect(res.body).toHaveProperty("status", true);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("user");
  });

  it("should throw error for invalid email", async () => {
    const user = {
      email: "",
      password: "Password123!",
    };

    // Login the user
    const res = await request(app).post('/api/auth/login').send(user).expect(400);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Invalid email");
  });

  it("should throw error for invalid email", async () => {
    const user = {
      email: "john@example.com",
      password: "", //Empty password 
    };

    // Login the user
    const res = await request(app).post('/api/auth/login').send(user).expect(400);

    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Invalid password");
  });
});

// Refresh token
describe('POST /api/auth/refresh', () => {
  it("should refresh access token", async () => {

    const newUser = {
      fullName: "John Doe",
      email: "john@example.com",
      password: "Password123!",
    };

    // Sign up
    await request(app).post("/api/auth/signup").send(newUser).expect(201);

    const user = {
      email: "john@example.com",
      password: "Password123!",
    };

    // Login the user
    const res = await request(app).post('/api/auth/login').send(user).expect(200);

    const token = res.body.accessToken;

    await request(app)
      .post('/api/auth/refresh')
      .set("Cookie", [`jwt=${token}`])
      .send(user).expect(200);
  });

  it("should return error if cookie is missing", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .expect(500);

    expect(res.body.status).toBe(false);
  });
});

// Protected routes

//Check auth
describe('POST Checking authentication', () => {
  it("check authentication with the token", async () => {
    const newUser = {
      fullName: "John Doe",
      email: "john@example.com",
      password: "Password123!",
    };

    // Sign up
    await request(app).post("/api/auth/signup").send(newUser).expect(201);

    const user = {
      email: "john@example.com",
      password: "Password123!",
    };

    // Login the user
    const loginRes = await request(app).post('/api/auth/login').send(user).expect(200);

    // Access Token
    const token = loginRes?.body?.accessToken;

    // Check auth
    const checkRes = await request(app).get('/api/auth/check').set("Authorization", `Bearer ${token}`).expect(200);

    expect(checkRes.body.status).toBe(true);
    expect(checkRes.body.data).toHaveProperty("email");
  })

  it("check authentication without token", async () => {
    // Check auth
    await request(app).get('/api/auth/check').expect(401);
  })
})

// Update profile
describe("Update profile photo", () => {
  it("should upload photo and update user profile", async () => {
    // 1️⃣ Sign up and login user
    const newUser = {
      fullName: "John Doe",
      email: "john@example.com",
      password: "Password123!",
    };

    await request(app).post("/api/auth/signup").send(newUser).expect(201);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: newUser.email, password: newUser.password })
      .expect(200);

    const token = loginRes.body.accessToken;

    // 2️⃣ Hit update profile route with fake image URL
    const res = await request(app)
      .post("/api/auth/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ profileUrl: "https://example.com/image.jpg" })
      .expect(200);

    // 3️⃣ Verify
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe("Profile pic uploaded successfully");
    expect(res.body.data).toHaveProperty("profilePic", "https://fake-cloudinary.com/image123.jpg");

    // 4️⃣ Ensure Cloudinary mock was called
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith("https://example.com/image.jpg");
  });
});


afterAll(async () => {
  await mongoose.connection.close();
});
