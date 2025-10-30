import request from "supertest"
import { app } from '../../lib/socket'

describe("User Registration and Login Integration", () => {
    it("should register user, login, and access protected route", async () => {
        // 1. Register a new user
        const userData = {
            fullName: "Test User",
            email: "test@example.com",
            password: "Password123!",
        };

        const registerResponse = await request(app)
            .post("/api/auth/signup")
            .send(userData)
            .expect(201);

        expect(registerResponse.body.status).toBe(true);
        expect(registerResponse.body.data.email).toBe(userData.email);

        // 2. Login with the same user
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: userData.email,
                password: userData.password,
            })
            .expect(200);

        const token = loginResponse.body.accessToken;
        expect(token).toBeDefined();

        // 3. Access protected route with the token
        const protectedResponse = await request(app)
            .get("/api/auth/check")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(protectedResponse.body.status).toBe(true);
        expect(protectedResponse.body.data.email).toBe(userData.email);
    });
});

describe("Authentication and Authorization Integration", () => {
    it("should prevent unauthorized access to protected routes", async () => {
        // Try to access protected route without token
        await request(app)
            .get("/api/message/users")
            .expect(401);

        // Try to access with invalid token
        await request(app)
            .get("/api/message/users")
            .set("Authorization", "Bearer invalid-token")
            .expect(401);

        // Create a user and get valid token
        await request(app)
            .post("/api/auth/signup")
            .send({
                fullName: "Test User",
                email: "test@example.com",
                password: "Password123!",
            })
            .expect(201);

        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "Password123!",
            })
            .expect(200);

        const validToken = loginResponse.body.accessToken;

        // Access protected route with valid token
        await request(app)
            .get("/api/message/users")
            .set("Authorization", `Bearer ${validToken}`)
            .expect(200);
    });
});