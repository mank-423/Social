import dotenv from "dotenv";
import { server } from "./lib/socket";
import connectDB from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  await connectDB();
});
