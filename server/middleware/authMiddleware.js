const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token required to access this resource",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "herbtrace_super_secret_jwt_key_2026");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User account no longer exists" });
    }

    if (user.status === "pending" && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Your registration is pending approval by the Admin. Access will be unlocked once approved.",
        status: user.status,
      });
    }

    if (user.status === "suspended" || user.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: `Your account is ${user.status}. Please contact the system administrator.`,
        status: user.status,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session token. Please log in again.",
    });
  }
};

module.exports = { protect };
