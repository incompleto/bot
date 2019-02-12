const anchorme = require("anchorme").default

const createUtils = () => {

  const extractDescription = (text, ...arrays) => {
    if (!text) {
      return
    }

    let data = concatArrayOfArrays(arrays)

    return text.split(' ').filter((word) => {
      if (data && !data.includes(word)) {
        return word
      }
    }).join(' ')
  }

  const extractTags = (text) => {
    if (!text) {
      return []
    }


    const REGEXP_TAGS = /#(\w+)/gi
    const REGEXP_TAG = /#(\w+)/

    let matches = text.match(REGEXP_TAGS)
    let tags = []

    if (matches && matches.length) {
      matches.forEach((m) => {
        let tag = m.match(REGEXP_TAG)
        tags.push(tag[1] || tag[2])
      })
    }

    return tags
  }

  const extractURLS = (text) => {
    if (!text) {
      return []
    }
  
    return pluck(anchorme(text, { list: true }), 'raw')
  }

  const concatArrayOfArrays = (args) => {
    return args.reduce((acc, val) => [...acc, ...val])
  }

  const pluck = (array, key) => {
    return array.map(o => o[key])
  }

  const prependHashtags = (tags) => {
    return tags && tags.length ? tags.map((t) => { return '#' + t }) : []
  }
  
  return {
    concatArrayOfArrays,
    extractDescription,
    extractTags,
    extractURLS,
    pluck,
    prependHashtags
  }
}

module.exports = createUtils()