import { Router } from 'express'
import { TokenController } from './token.controller'

const tokenRouter = Router()

tokenRouter.post(
  '/generate',
  TokenController.generateToken
)

export { tokenRouter }
