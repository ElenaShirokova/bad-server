import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'
import { fileTypeFromBuffer } from 'file-type'
import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import { join } from 'path'

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

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

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    const minFileSize = 2 * 1024 // 2kB в байтах
    if (req.file.size < minFileSize) {
        return next(new BadRequestError('Файл не загружен: Минимальный размер загружаемого файла 2кВ'))
    }
    try {
        const fileType = await fileTypeFromBuffer(req.file.buffer)
        if (!fileType || !types.includes(fileType.mime)) {
            return next(new BadRequestError('Содержимое файла не соответствует разрешенным типам'))
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExtension = req.file.originalname.split('.').pop()
        const fileName = `${uniqueSuffix}.${fileExtension}`
        const filePath = join(uploadDir, fileName)
        await writeFile(filePath, req.file.buffer)
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName: fileName,
            originalName: req.file.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
