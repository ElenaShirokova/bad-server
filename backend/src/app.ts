import { errors } from 'celebrate'
import { nestCsrf } from 'ncsrf';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet';
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import { generalRateLimiter } from './middlewares/rateLimit'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

app.set('trust proxy', 1)
app.use(generalRateLimiter)

app.use(helmet())

app.use(cookieParser())
app.use(nestCsrf())

app.use(cors({ origin: process.env.ORIGIN_ALLOW, credentials: true }));

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))
app.use(json())

app.options('*', cors())
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
