import jwt from "jsonwebtoken";
import User from "../models/User.js";

const errorHandler = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return errorHandler(res, 401, "No token provided");
  }

  // Expect format: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return errorHandler(res, 401, "Invalid token format");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // ✅ fixed (was decoded._id)

    // Fetch user from DB
    const user = await User.findById(userId);
    if (!user) {
      return errorHandler(res, 401, "Invalid token");
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return errorHandler(res, 401, "Invalid or expired token");
  }
};

export const verifyUser = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    return errorHandler(res, 403, "Access denied: Users only");
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return errorHandler(res, 403, "Access denied: Admins only");
  }
};

export default verifyToken;
