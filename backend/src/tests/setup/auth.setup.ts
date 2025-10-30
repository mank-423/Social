import request from "supertest";
import { app } from '../../lib/socket'

// Common login utility
export const loginUser = async (email = "john@example.com", password = "Password123!") => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  
  return loginRes.body.accessToken;
};

// Common user creation utility
export const createUser = async (userData = {}) => {
  const defaultUser = {
    fullName: "John Doe",
    email: "john@example.com",
    password: "Password123!",
    ...userData
  };

  await request(app)
    .post("/api/auth/signup")
    .send(defaultUser)
    .expect(201);

  return defaultUser;
};