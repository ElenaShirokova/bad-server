import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const storage = multer.memoryStorage()

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    // Проверка типа
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }
    return cb(null, true)
}

export default multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // Максимум 10MB
    }
})
