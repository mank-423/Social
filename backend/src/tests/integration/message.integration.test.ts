import request from "supertest"
import { app } from '../../lib/socket'

describe("Complete Message Flow Integration", () => {
    it("should register two users, send messages, and fetch conversation", async () => {
        // Setup: Create two users
        const user1 = await request(app)
            .post("/api/auth/signup")
            .send({
                fullName: "User One",
                email: "user1@example.com",
                password: "Password123!",
            })
            .expect(201);

        const user2 = await request(app)
            .post("/api/auth/signup")
            .send({
                fullName: "User Two",
                email: "user2@example.com",
                password: "Password123!",
            })
            .expect(201);

        // Login as user1
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "user1@example.com",
                password: "Password123!",
            })
            .expect(200);

        const token = loginResponse.body.accessToken;
        const receiverId = user2.body.data._id;

        // Send multiple messages
        const messages = [
            "Hello!",
            "How are you?",
            "Let's catch up soon!"
        ];

        for (const text of messages) {
            await request(app)
                .post(`/api/message/send/${receiverId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ text })
                .expect(201);
        }

        // Fetch the conversation
        const conversationResponse = await request(app)
            .get(`/api/message/${receiverId}?page=1&limit=10`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        // Verify the conversation
        expect(conversationResponse.body.data.messages.length).toBe(3);
        expect(conversationResponse.body.data.messages[0].text).toBe("Hello!");
        expect(conversationResponse.body.data.messages[2].text).toBe("Let's catch up soon!");
    });
});

describe("User List and Messaging Integration", () => {
    it("should show users list and allow messaging between them", async () => {
        // Create multiple users
        const users = [
            { fullName: "Alice", email: "alice@example.com", password: "Password123!" },
            { fullName: "Bob", email: "bob@example.com", password: "Password123!" },
            { fullName: "Charlie", email: "charlie@example.com", password: "Password123!" },
        ];

        for (const user of users) {
            await request(app).post("/api/auth/signup").send(user).expect(201);
        }

        // Login as Alice
        const aliceLogin = await request(app)
            .post("/api/auth/login")
            .send({ email: "alice@example.com", password: "Password123!" })
            .expect(200);

        const aliceToken = aliceLogin.body.accessToken;

        // Get users list (should show Bob and Charlie, excluding Alice)
        const usersListResponse = await request(app)
            .get("/api/message/users")
            .set("Authorization", `Bearer ${aliceToken}`)
            .expect(200);

        expect(usersListResponse.body.data.length).toBe(2);
        
        const bobUser = usersListResponse.body.data.find((u: any) => u.email === "bob@example.com");
        expect(bobUser).toBeDefined();

        // Send message to Bob
        const messageResponse = await request(app)
            .post(`/api/message/send/${bobUser._id}`)
            .set("Authorization", `Bearer ${aliceToken}`)
            .send({ text: "Hi Bob!" })
            .expect(201);

        expect(messageResponse.body.data.text).toBe("Hi Bob!");
        expect(messageResponse.body.data.senderId).toBe(aliceLogin.body.user._id);
        expect(messageResponse.body.data.receiverId).toBe(bobUser._id);
    });
});