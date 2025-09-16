import { Router } from 'express'
import { tokenRouter } from './modules'

const apiRouter = Router()

apiRouter.use(
  tokenRouter
)

export { apiRouter }
