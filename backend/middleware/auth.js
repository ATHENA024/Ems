const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const header = req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const sectionAdminOrAdminOnly = (req, res, next) => {
  if (!['admin', 'section_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Section admin or admin access required' });
  }
  next();
};

const hasPermission = (...perms) => {
  return (req, res, next) => {
    if (req.user.role === 'admin') return next();
    const userPerms = req.user.permissions || [];
    const has = perms.some(p => userPerms.includes(p));
    if (!has) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { auth, adminOnly, sectionAdminOrAdminOnly, hasPermission };
