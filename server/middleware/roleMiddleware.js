const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    // "farmer" and "collector" can both access collector workflows
    const userRole = req.user.role;
    const allowed = roles.includes(userRole) || (roles.includes("farmer") && userRole === "collector") || req.user.role === "admin";

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${userRole}' is not authorized to access this resource. Requires: [${roles.join(", ")}]`,
      });
    }

    next();
  };
};

module.exports = { authorize };
