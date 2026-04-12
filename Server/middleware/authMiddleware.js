import jwt from 'jsonwebtoken';

// ✅ Verify user
export const verifyUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    req.user = decoded; // attach user data
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


// ✅ Admin only middleware
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied (Admin only)' });
  }
  next();
};