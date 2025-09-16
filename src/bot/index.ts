import { type Request, type Response } from 'express'
import { config, logger, request, TELEGRAM_API_URL } from '@/shared'
import { Updates } from './handlers'

const setBotWebhook = async (): Promise<boolean> => {
  try {
    const { TELEGRAM_BOT_TOKEN, WEBHOOK_BOT_URL } = config

    await request({
      url: `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook`
    })

    const result = await request({
      url: `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${WEBHOOK_BOT_URL}/${TELEGRAM_BOT_TOKEN}`
    })

    return result.status === 200
  } catch (e) {
    return false
  }
}

const getBotUpdates = async (request: Request, response: Response): Promise<void> => {
  const { token } = request.params

  const { body } = request

  if (!body) {
    response.status(200).send(true)

    return
  }

  if (token !== config.TELEGRAM_BOT_TOKEN) {
    logger.warn('Token in getBotUpdates not match')

    response.status(200).send(true)

    return
  }

  body.token = token

  try {
    await Updates.proccess(body)
  } catch (error) {
    logger.error('Error in proccessUpdates', error)
  }

  response.status(200).send(true)
}

export { setBotWebhook, getBotUpdates }
