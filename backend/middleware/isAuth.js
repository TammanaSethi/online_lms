import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // 🔹 no token
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    // 🔹 verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 attach userId
    req.userId = decoded.userId || decoded.id;

    if (!req.userId) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default isAuth;