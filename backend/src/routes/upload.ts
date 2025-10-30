import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'
import { uploadRateLimiter } from '../middlewares/rateLimit'

const uploadRouter = Router()
uploadRouter.post('/', fileMiddleware.single('file'), uploadFile)

export default uploadRouter
