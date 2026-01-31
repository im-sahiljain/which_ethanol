import { getDatabase } from "../mongodb";
import type { AdminUser, AdminSession } from "../models/admin";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function createAdmin(
  adminData: Omit<
    AdminUser,
    "_id" | "createdAt" | "updatedAt" | "passwordHash"
  > & { password: string }
) {
  const db = await getDatabase();
  const collection = db.collection<AdminUser>("admins");

  // Check if admin already exists
  const existingAdmin = await collection.findOne({
    $or: [{ username: adminData.username }, { email: adminData.email }],
  });

  if (existingAdmin) {
    throw new Error("Admin with this username or email already exists");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(adminData.password, 12);

  const newAdmin = {
    username: adminData.username,
    email: adminData.email,
    passwordHash,
    role: adminData.role,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(newAdmin);
  return result.insertedId;
}

export async function authenticateAdmin(email: string, password: string) {
  // console.log("Authenticating admin with email:", email);
  // console.log("Password:", password);
  const db = await getDatabase();
  const collection = db.collection<AdminUser>("admins");

  const admin = await collection.findOne({ email });
  // console.log(admin)
  if (!admin) {
    return null;
  }

  // const isValidPassword = await bcrypt.compare(password, admin.passwordHash)

  const isValidPassword = password === admin.passwordHash

  // console.log(isValidPassword)
  // console.log(admin.passwordHash)
  // console.log(password)

  // const isValidPassword = password;
  if (!isValidPassword) {
    return null;
  }

  // Update last login
  await collection.updateOne(
    { _id: admin._id },
    { $set: { lastLogin: new Date(), updatedAt: new Date() } }
  );

  // Create session token
  const token = jwt.sign(
    { adminId: admin._id, username: admin.username, role: admin.role },
    JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  // Store session in database
  const sessionsCollection = db.collection<AdminSession>("admin_sessions");
  await sessionsCollection.insertOne({
    adminId: admin._id!.toString(),
    token,
    expiresAt: new Date(Date.now() + SESSION_DURATION),
    createdAt: new Date(),
  });

  return {
    admin: {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    },
    token,
  };
}

export async function verifyAdminToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const db = await getDatabase();
    const sessionsCollection = db.collection<AdminSession>("admin_sessions");

    // Check if session exists and is not expired
    const session = await sessionsCollection.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return null;
    }

    const adminsCollection = db.collection<AdminUser>("admins");
    const admin = await adminsCollection.findOne({
      username: decoded.username,
    });

    if (!admin) {
      return null;
    }

    return {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };
  } catch (error) {
    return null;
  }
}

export async function logoutAdmin(token: string) {
  const db = await getDatabase();
  const sessionsCollection = db.collection<AdminSession>("admin_sessions");

  await sessionsCollection.deleteOne({ token });
}

export async function getAdminById(id: string) {
  const db = await getDatabase();
  const collection = db.collection<AdminUser>("admins");

  const admin = await collection.findOne({ _id: id });
  if (!admin) return null;

  return {
    _id: admin._id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    createdAt: admin.createdAt,
    lastLogin: admin.lastLogin,
  };
}
