import jwt from 'jsonwebtoken'
const jwtAuthMiddleware = (req, res, next) => {
  // first check request headers hash authorization or not 
  const authorization = req.headers.authorization
  console.log(authorization)
  if (!authorization) return res.status(401).json({ error: 'Token Not Found' });

  //extract to jwt token from the request headers
  const token = req.headers.authorization;
  console.log(token)
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    // verify the jwt token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded);
    //Attach user information to tht request objects

    req.user = decoded;
    console.log(req.user);
    next();
  }
  catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Function to genertated JWT Token 
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 3000 });
};

const adminOnly = (req, res, next) => {
  console.log(req.user.role);
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: " user does not Admin  role " });
  }
  next();
};
export { jwtAuthMiddleware, generateToken, adminOnly }
