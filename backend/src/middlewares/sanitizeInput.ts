import { NextFunction, Request, Response } from 'express'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const { window } = new JSDOM('')
const domPurify = DOMPurify(window)

const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = domPurify.sanitize(req.body[key]);
      }
    });
  }
  next();
};

export default sanitizeInput