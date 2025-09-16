import { google } from 'googleapis'
import fs from 'fs'
import { config, logger } from '../libs'

const credentials = JSON.parse(fs.readFileSync('google-sheets.json', 'utf8'))

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

class GoogleSheetsService {
  static async sendDataToGoogleSheets ({
    gclid,
    siteUrl
  }: {
    gclid: string
    siteUrl: string
  }) {
    try {
      const data = [
        gclid, new Date().toISOString()
      ]

      const sheets = google.sheets({ version: 'v4', auth })

      await sheets.spreadsheets.values.append({
        spreadsheetId: config.GOOGLE_SHEET_ID,
        range: `${siteUrl}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: [data] }
      })

      return true
    } catch (error) {
      logger.error('Error in send data to google sheets:', error)

      return false
    }
  }
}

export { GoogleSheetsService }
