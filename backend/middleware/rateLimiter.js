const rateLimits = new Map();

const windowMs = 15 * 60 * 1000; // 15 minutes
const maxAttempts = 20; // 20 requests per IP per window

const authRateLimiter = (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const record = rateLimits.get(key) || { count: 0, reset: now + windowMs };

  if (now > record.reset) {
    record.count = 0;
    record.reset = now + windowMs;
  }

  record.count += 1;
  rateLimits.set(key, record);

  if (record.count > maxAttempts) {
    return res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  }

  res.setHeader("X-RateLimit-Limit", maxAttempts);
  res.setHeader(
    "X-RateLimit-Remaining",
    Math.max(0, maxAttempts - record.count),
  );
  res.setHeader("X-RateLimit-Reset", Math.ceil(record.reset / 1000));

  next();
};

module.exports = authRateLimiter;
