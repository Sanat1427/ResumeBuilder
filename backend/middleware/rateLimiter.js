const ipRequestTracker = new Map();

/**
 * Custom interview-ready in-memory rate limiter middleware
 */
export const rateLimiter = (limit = 60, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipRequestTracker.has(ip)) {
      ipRequestTracker.set(ip, []);
    }

    const requests = ipRequestTracker.get(ip);
    
    // Clean up timestamps older than the window
    const activeRequests = requests.filter(timestamp => now - timestamp < windowMs);
    
    if (activeRequests.length >= limit) {
      console.warn(`[Rate Limit Exceeded] IP: ${ip} | Request count: ${activeRequests.length}`);
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please wait a moment before trying again."
      });
    }

    // Register active timestamp
    activeRequests.push(now);
    ipRequestTracker.set(ip, activeRequests);

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", limit - activeRequests.length);

    next();
  };
};
