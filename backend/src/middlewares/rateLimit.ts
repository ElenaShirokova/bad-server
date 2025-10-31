import rateLimit from 'express-rate-limit'

// Базовый лимитер для всех запросов
export const generalRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  limit: 49, // максимум 49 запросов с одного IP за окно
  message: {
    error: 'Слишком много запросов с этого IP, попробуйте позже',
    retryAfter: '10 минут'
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})
