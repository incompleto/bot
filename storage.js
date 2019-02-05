const getUrls = require('get-urls')
const Airtable = require('airtable')

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_ENDPOINT = process.env.AIRTABLE_ENDPOINT
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_NAME
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE

Airtable.configure({
  endpointUrl: AIRTABLE_ENDPOINT,
  apiKey: AIRTABLE_API_KEY
})

let base = new Airtable({ AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)

const createStorage = () => {
 
  const storeURL = ({ group, username, url }, callback) => {
    base(AIRTABLE_TABLE).create({ group, username, url }, callback)
  }
  
  return {
    storeURL
  }
}

module.exports = createStorage()