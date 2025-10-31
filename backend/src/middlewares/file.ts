import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

// Создаем директорию если не существует
const uploadDir = join(
    __dirname,
    process.env.UPLOAD_PATH_TEMP
        ? `../public/${process.env.UPLOAD_PATH_TEMP}`
        : '../public'
)

if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(
            null, uploadDir
        )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExtension = file.originalname.split('.').pop()
        const fileName = `${uniqueSuffix}.${fileExtension}`
        cb(null, fileName)
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    _file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(_file.mimetype)) {
        return cb(null, false)
    }
    // Проверка минимального размера файла (2MB)
    const minFileSize = 2 * 1024 // 2kB в байтах
    if (_file.size < minFileSize) {
        return cb(null, false)
    }

    return cb(null, true)
}

export default multer({ 
    storage, 
    fileFilter, 
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB максимум
    }
})
