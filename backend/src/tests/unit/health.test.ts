import request from "supertest";
import { app } from "../../lib/socket";

describe("GET API healthy", () => {
    it("should return 200 and a message", async () => {
        const response = await request(app).get('/api/ping');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Server is reachable");
    })
})