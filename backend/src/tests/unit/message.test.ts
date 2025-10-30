import request from "supertest"
import { app } from '../../lib/socket'
import mongoose from "mongoose"

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

// Sending a message
describe("Sending message to the user", () => {

    it("Send empty body to the user", async () => {
        // Logged in user
        const newUser1 = {
            fullName: "John Doe",
            email: "john@example.com",
            password: "Password123!",
        };

        // User it will chat to
        const newUser2 = {
            fullName: "Eva Doe",
            email: "eva@example.com",
            password: "Eva@123!",
        };

        // Sign up both users
        const user1 = await request(app).post("/api/auth/signup").send(newUser1).expect(201);
        const user2 = await request(app).post("/api/auth/signup").send(newUser2).expect(201);

        const receiverId = user2.body.data._id;

        // Login with first user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: "john@example.com", password: "Password123!" })
            .expect(200);

        const token = loginRes.body.accessToken;

        // Message to send
        const chatToSend = {
        }

        // Send message
        const res = await request(app)
            .post(`/api/message/send/${receiverId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(chatToSend)
            .expect(400);


        expect(res.body.status).toBe(false);
    });

    it("Sending simple text message", async () => {
        // Logged in user
        const newUser1 = {
            fullName: "John Doe",
            email: "john@example.com",
            password: "Password123!",
        };

        // User it will chat to
        const newUser2 = {
            fullName: "Eva Doe",
            email: "eva@example.com",
            password: "Eva@123!",
        };

        // Sign up both users
        const user1 = await request(app).post("/api/auth/signup").send(newUser1).expect(201);
        const user2 = await request(app).post("/api/auth/signup").send(newUser2).expect(201);

        const receiverId = user2.body.data._id;

        // Login with first user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: "john@example.com", password: "Password123!" })
            .expect(200);

        const token = loginRes.body.accessToken;

        // Message to send
        const chatToSend = {
            text: 'Hello!'
        }

        // Send message
        const res = await request(app)
            .post(`/api/message/send/${receiverId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(chatToSend)
            .expect(201);


        // Comprehensive assertions
        expect(res.body).toHaveProperty('data');

        // Check response structure
        expect(res.body.status).toBe(true);

        // Check message data structure
        const message = res.body.data;
        expect(message).toHaveProperty('_id');
        expect(message).toHaveProperty('senderId');
        expect(message).toHaveProperty('receiverId');
        expect(message).toHaveProperty('text', 'Hello!');
        expect(message).toHaveProperty('status', 'sent');
        expect(message).toHaveProperty('createdAt');
        expect(message).toHaveProperty('updatedAt');

        // Verify sender and receiver IDs
        expect(message.senderId).toBe(user1.body.data._id); // Should be the logged-in user's ID
        expect(message.receiverId).toBe(receiverId); // Should be the target user's ID

        // Verify message content
        expect(message.text).toBe('Hello!');
        expect(message.retryCount).toBe(0);
    });

    it("Sending image message successfully", async () => {
        // Logged in user
        const newUser1 = {
            fullName: "John Doe",
            email: "john@example.com",
            password: "Password123!",
        };

        // User it will chat to
        const newUser2 = {
            fullName: "Eva Doe",
            email: "eva@example.com",
            password: "Eva@123!",
        };

        // Sign up both users
        const user1 = await request(app).post("/api/auth/signup").send(newUser1).expect(201);
        const user2 = await request(app).post("/api/auth/signup").send(newUser2).expect(201);

        const receiverId = user2.body.data._id;

        // Login with first user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: "john@example.com", password: "Password123!" })
            .expect(200);

        const token = loginRes.body.accessToken;

        // Image data (base64 or image URL)
        const imageData = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

        // Message with image
        const imageMessage = {
            image: imageData
        }

        // Send image message
        const res = await request(app)
            .post(`/api/message/send/${receiverId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(imageMessage)
            .expect(201);

        // Comprehensive assertions
        expect(res.body).toHaveProperty('data');
        expect(res.body.status).toBe(true);

        // Check message data structure
        const message = res.body.data;
        expect(message).toHaveProperty('_id');
        expect(message).toHaveProperty('senderId');
        expect(message).toHaveProperty('receiverId');
        expect(message).toHaveProperty('image', 'https://fake-cloudinary.com/image123.jpg'); // Mocked URL
        expect(message).toHaveProperty('status', 'sent');
        expect(message).toHaveProperty('createdAt');
        expect(message).toHaveProperty('updatedAt');

        // Verify sender and receiver IDs
        expect(message.senderId).toBe(user1.body.data._id);
        expect(message.receiverId).toBe(receiverId);

        // Verify image was uploaded to Cloudinary
        expect(cloudinary.uploader.upload).toHaveBeenCalledWith(imageData);

        // Text should be undefined or empty for image-only messages
        expect(message.text).toBe("");
    });

    it("Sending message with both text and image", async () => {
        // Logged in user
        const newUser1 = {
            fullName: "John Doe",
            email: "john@example.com",
            password: "Password123!",
        };

        // User it will chat to
        const newUser2 = {
            fullName: "Eva Doe",
            email: "eva@example.com",
            password: "Eva@123!",
        };

        // Sign up both users
        const user1 = await request(app).post("/api/auth/signup").send(newUser1).expect(201);
        const user2 = await request(app).post("/api/auth/signup").send(newUser2).expect(201);

        const receiverId = user2.body.data._id;

        // Login with first user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: "john@example.com", password: "Password123!" })
            .expect(200);

        const token = loginRes.body.accessToken;

        // Message with both text and image
        const combinedMessage = {
            text: "Check out this image!",
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        }

        // Send combined message
        const res = await request(app)
            .post(`/api/message/send/${receiverId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(combinedMessage)
            .expect(201);

        // Assertions
        expect(res.body.status).toBe(true);

        const message = res.body.data;
        expect(message).toHaveProperty('text', 'Check out this image!');
        expect(message).toHaveProperty('image', 'https://fake-cloudinary.com/image123.jpg');
        expect(message.senderId).toBe(user1.body.data._id);
        expect(message.receiverId).toBe(receiverId);

        // Verify Cloudinary was called
        expect(cloudinary.uploader.upload).toHaveBeenCalledWith(combinedMessage.image);
    });

    it("Sending image message when Cloudinary upload fails", async () => {
        // Logged in user
        const newUser1 = {
            fullName: "John Doe",
            email: "john@example.com",
            password: "Password123!",
        };

        // User it will chat to
        const newUser2 = {
            fullName: "Eva Doe",
            email: "eva@example.com",
            password: "Eva@123!",
        };

        // Sign up both users
        const user1 = await request(app).post("/api/auth/signup").send(newUser1).expect(201);
        const user2 = await request(app).post("/api/auth/signup").send(newUser2).expect(201);

        const receiverId = user2.body.data._id;

        // Login with first user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: "john@example.com", password: "Password123!" })
            .expect(200);

        const token = loginRes.body.accessToken;

        // Mock Cloudinary to reject
        (cloudinary.uploader.upload as jest.Mock).mockRejectedValueOnce(new Error('Cloudinary upload failed'));

        const imageData = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

        const imageMessage = {
            image: imageData
        }

        // Send image message - should fail
        const res = await request(app)
            .post(`/api/message/send/${receiverId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(imageMessage)
            .expect(500);

        expect(res.body.status).toBe(false);
        expect(res.body).toHaveProperty('message'); // Error message

        // Verify Cloudinary was still called
        expect(cloudinary.uploader.upload).toHaveBeenCalledWith(imageData);
    });
});

// Fetching message
describe("Getting message for a user", () => {


    it("Get messages of user with pagination", async () => {
        // Logged in user
        const newUser1 = {
            fullName: "John Doe",
            email: "john@example.com",
            password: "Password123!",
        };

        // User it will chat to
        const newUser2 = {
            fullName: "Eva Doe",
            email: "eva@example.com",
            password: "Eva@123!",
        };

        // Sign up both users
        const user1 = await request(app).post("/api/auth/signup").send(newUser1).expect(201);
        const user2 = await request(app).post("/api/auth/signup").send(newUser2).expect(201);

        const receiverId = user2.body.data._id;

        // Login with first user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: "john@example.com", password: "Password123!" })
            .expect(200);

        const token = loginRes.body.accessToken;

        // Message to send
        const messages = [
            { text: 'Hello!' },
            { text: 'How are you?' },
            { text: 'Nice to meet you!' }
        ];

        // Send all messages concurrently
        await Promise.all(
            messages.map(message =>
                request(app)
                    .post(`/api/message/send/${receiverId}`)
                    .set("Authorization", `Bearer ${token}`)
                    .send(message)
                    .expect(201)
            )
        );

        const getRes = await request(app)
            .get(`/api/message/${receiverId}?page=1&limit=10`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(getRes.body.data.messages.length).toBe(3);
        expect(getRes.body.pagination.hasMore).toBeFalsy();
        expect(getRes.body.pagination).toHaveProperty("nextCursor");
    });

    it("Get messages of user without pagination", async () => {
        // Logged in user
        const newUser1 = {
            fullName: "John Doe",
            email: "john@example.com",
            password: "Password123!",
        };

        // User it will chat to
        const newUser2 = {
            fullName: "Eva Doe",
            email: "eva@example.com",
            password: "Eva@123!",
        };

        // Sign up both users
        const user1 = await request(app).post("/api/auth/signup").send(newUser1).expect(201);
        const user2 = await request(app).post("/api/auth/signup").send(newUser2).expect(201);

        const receiverId = user2.body.data._id;

        // Login with first user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: "john@example.com", password: "Password123!" })
            .expect(200);

        const token = loginRes.body.accessToken;

        // Message to send
        const messages = [
            { text: 'Hello!' },
            { text: 'How are you?' },
            { text: 'Nice to meet you!' }
        ];

        // Send all messages concurrently
        await Promise.all(
            messages.map(message =>
                request(app)
                    .post(`/api/message/send/${receiverId}`)
                    .set("Authorization", `Bearer ${token}`)
                    .send(message)
                    .expect(201)
            )
        );

        const getRes = await request(app)
            .get(`/api/message/${receiverId}?page=1&limit=10`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(getRes.body.data.messages.length).toBe(3);
        expect(getRes.body.pagination.hasMore).toBeFalsy();
        expect(getRes.body.pagination).toHaveProperty("nextCursor");
    });

});


// Users list
describe("Get users list", () => {
    it("Get users list paginated", async () => {
        const newUser1 = {
            fullName: "John Doe",
            email: "john@example.com",
            password: "Password123!",
        };

        // This user will come up in the list
        const newUser2 = {
            fullName: "Eva Doe",
            email: "eva@example.com",
            password: "Eva@123!",
        };

        // Sign up response
        const user1 = await request(app).post("/api/auth/signup").send(newUser1).expect(201);

        // Sign up response
        await request(app).post("/api/auth/signup").send(newUser2).expect(201);

        // Login response
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: "john@example.com", password: "Password123!" })
            .expect(200);

        const token = loginRes.body.accessToken;

        // Calling the users
        const res = await request(app)
            .get('/api/message/users?page=1&limit=10')
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("Get users list without pagination", async () => {
        const newUser1 = {
            fullName: "John Doe",
            email: "john@example.com",
            password: "Password123!",
        };

        // This user will come up in the list
        const newUser2 = {
            fullName: "Eva Doe",
            email: "eva@example.com",
            password: "Eva@123!",
        };

        // Sign up response
        await request(app).post("/api/auth/signup").send(newUser1).expect(201);

        // Sign up response
        await request(app).post("/api/auth/signup").send(newUser2).expect(201);

        // Login response
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: "john@example.com", password: "Password123!" })
            .expect(200);

        const token = loginRes.body.accessToken;

        // Calling the users
        const res = await request(app)
            .get('/api/message/users')
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
});


afterAll(async () => {
    await mongoose.connection.close();
});