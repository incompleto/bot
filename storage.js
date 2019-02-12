const Airtable = require('airtable')

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_ENDPOINT = process.env.AIRTABLE_ENDPOINT
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_NAME
const AIRTABLE_TABLE_URLS = process.env.AIRTABLE_TABLE_URLS
const AIRTABLE_TABLE_IMAGES = process.env.AIRTABLE_TABLE_IMAGES
const AIRTABLE_TABLE_AVATARS = process.env.AIRTABLE_TABLE_AVATARS

Airtable.configure({
  endpointUrl: AIRTABLE_ENDPOINT,
  apiKey: AIRTABLE_API_KEY
})

let base = new Airtable({ AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)

const createStorage = () => {
 
  const storeURL = ({ group, username, comment, url, tags }, callback) => {
    tags = (tags && tags.join(', ')) || ''
    
    console.log('SAVING URL', group, username, url, tags)
    base(AIRTABLE_TABLE_URLS).create({ group, username, comment, url, tags }, callback)
  }
  
  const storeImage = ({ group, username, image, tags }, callback) => {
    base(AIRTABLE_TABLE_IMAGES).create({ group, username, image }, callback)
  }
  
  const storeAvatar = ({ group, username, image, tags }, callback) => {
    base(AIRTABLE_TABLE_AVATARS).create({ group, username, image }, callback)
  }
  
  return {
    storeAvatar,
    storeImage,
    storeURL
  }
}

module.exports = createStorage()