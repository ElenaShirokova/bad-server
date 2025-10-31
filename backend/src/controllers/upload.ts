import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'

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
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName: req.file.filename,
            originalName: req.file.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
