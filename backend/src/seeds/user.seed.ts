import { config } from "dotenv";
import connectDB from "../config/db";
import User from "../models/user.model";

import crypto from 'crypto';

const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('base64');
};

config();

const seedUsers = [
  // Female Users
  {
    email: "emma.thompson@example.com",
    fullName: "Emma Thompson",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "olivia.miller@example.com",
    fullName: "Olivia Miller",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "sophia.davis@example.com",
    fullName: "Sophia Davis",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "ava.wilson@example.com",
    fullName: "Ava Wilson",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "isabella.brown@example.com",
    fullName: "Isabella Brown",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "mia.johnson@example.com",
    fullName: "Mia Johnson",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "charlotte.williams@example.com",
    fullName: "Charlotte Williams",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "amelia.garcia@example.com",
    fullName: "Amelia Garcia",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
    encryptionKey: generateEncryptionKey(),
  },

  // Male Users
  {
    email: "james.anderson@example.com",
    fullName: "James Anderson",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "william.clark@example.com",
    fullName: "William Clark",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "benjamin.taylor@example.com",
    fullName: "Benjamin Taylor",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "lucas.moore@example.com",
    fullName: "Lucas Moore",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "henry.jackson@example.com",
    fullName: "Henry Jackson",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "alexander.martin@example.com",
    fullName: "Alexander Martin",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
    encryptionKey: generateEncryptionKey(),
  },
  {
    email: "daniel.rodriguez@example.com",
    fullName: "Daniel Rodriguez",
    password: process.env.SEED_PASSWORD,
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
    encryptionKey: generateEncryptionKey(),
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();