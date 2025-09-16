import { TokenModel } from '@/shared'
import { type Request, type Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

class TokenController {
  static async generateToken (req: Request, res: Response) {
    try {
      const { gclid, utm, site } = req.body

      if (!gclid && !site) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: ReasonPhrases.BAD_REQUEST
        })

        return
      }

      const token = await TokenModel.generateToken({
        gclid: gclid as string,
        utm: utm as string ?? '',
        siteUrl: site as string
      })

      if (!token) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: ReasonPhrases.INTERNAL_SERVER_ERROR
        })

        return
      }

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: ReasonPhrases.OK,
        token
      })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  }
}

export { TokenController }
