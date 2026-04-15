import jwt from 'jsonwebtoken';

// ✅ Verify user
export const verifyUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Support both "Bearer <token>" and just "<token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader;

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const secret = process.env.JWT_SECRET || "secretkey";
    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    next();

  } catch (error) {
    console.error("JWT Verification Error:", error.message);
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