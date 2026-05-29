import { v4 as uuidv4 } from 'uuid';

export const requestId = (req, res, next) => {
  const id = req.headers['x-request-id'] || uuidv4();
  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
};
