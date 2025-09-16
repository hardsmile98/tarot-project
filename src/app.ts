import express, { Router } from 'express'
import cors from 'cors'
import { config, logger } from '@/shared'
import { setBotWebhook, getBotUpdates } from './bot'
import { apiRouter as mainApiRouter } from './api'

const apiRouter: Router = Router().use(
  mainApiRouter
)

const { PORT } = config

const app = express()

app.use(cors())

app.use(express.json({
  limit: '1mb'
}))

app.use(express.urlencoded({
  extended: true,
  limit: '1mb'
}))

app.post('/bot/:token', getBotUpdates)

app.use('/api', apiRouter)

app.listen(PORT, () => {
  logger.info(`Server started on ${PORT} port`)
})

const setupApp = async (): Promise<void> => {
  const isWebhookSeted = await setBotWebhook()

  if (isWebhookSeted) {
    logger.info('Webhook seted:', isWebhookSeted)
  }
}

void setupApp()
