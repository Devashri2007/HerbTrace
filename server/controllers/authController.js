const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AuditService = require("../services/auditService");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "herbtrace_super_secret_jwt_key_2026", {
    expiresIn: "7d",
  });
};

/**
 * Register user
 */
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = "farmer",
      phone,
      address,
      state,
      district,
      collectorType,
      govIdRef,
      organization,
      consentGiven,
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    // Role auto-approval rule: Admin can set up direct admin or pre-approved demo roles; public signups default to pending
    const isAutoApproved = role === "admin" || (process.env.AUTO_APPROVE_USERS === "true");
    const status = isAutoApproved ? "approved" : "pending";

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      status,
      phone,
      address,
      state,
      district,
      collectorType: collectorType || "Farmer",
      govIdRef,
      organization,
      consentGiven: consentGiven !== undefined ? consentGiven : true,
    });

    await AuditService.log({
      actorId: user._id,
      actorName: user.name,
      actorRole: user.role,
      action: "USER_REGISTERED",
      entityType: "User",
      entityId: user._id.toString(),
      description: `New ${user.role} registered with status: ${user.status}`,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message:
        status === "approved"
          ? "Account registered successfully"
          : "Registration submitted successfully! Your account is pending admin approval before you can create batches.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        collectorType: user.collectorType,
        district: user.district,
        state: user.state,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);

    await AuditService.log({
      actorId: user._id,
      actorName: user.name,
      actorRole: user.role,
      action: "USER_LOGIN",
      entityType: "User",
      entityId: user._id.toString(),
      description: `User ${user.email} logged in`,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        collectorType: user.collectorType,
        district: user.district,
        state: user.state,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current authenticated user
 */
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = { register, login, getMe };
