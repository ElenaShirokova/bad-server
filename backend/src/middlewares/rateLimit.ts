import rateLimit from 'express-rate-limit'

// Базовый лимитер для всех запросов
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  limit: 10, // максимум 100 запросов с одного IP за окно
  message: {
    error: 'Слишком много запросов с этого IP, попробуйте позже',
    retryAfter: '15 минут'
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

// Строгий лимитер для авторизации
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  limit: 5, // максимум 5 попыток входа
  message: {
    error: 'Слишком много попыток входа, попробуйте позже',
    retryAfter: '15 минут'
  },
  skipSuccessfulRequests: true, // не считать успешные запросы
})

// Лимитер для регистрации
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  limit: 3, // максимум 3 регистрации с одного IP в час
  message: {
    error: 'Слишком много попыток регистрации, попробуйте позже',
    retryAfter: '1 час'
  }
})

// Лимитер для загрузки файлов
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  limit: 10, // максимум 10 загрузок файлов
  message: {
    error: 'Слишком много загрузок файлов, попробуйте позже',
    retryAfter: '1 час'
  }
})

// Лимитер для создания заказов
export const orderRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  limit: 20, // максимум 20 заказов
  message: {
    error: 'Слишком много заказов, попробуйте позже',
    retryAfter: '1 час'
  }
})