const chalk = require('chalk')
const cheerio = require('cheerio')
const async = require('async')
const fs = require('fs')
const path = require('path')
const request = require('request-promise')

const baseUrl = 'http://www.guanggoo.com'

const getTargetUrl = page => `http://www.guanggoo.com/?p=${page}`

const requestHeaders = {}
const endP = 1032

async function getPageData(p, cb, res) {
  try {
    const html = await request(getTargetUrl(p), {
      headers: requestHeaders,
    })
    const $ = cheerio.load(html)
    $('.topic-item').each(function() {
      const title =
        $(this)
          .find('.title')
          .text()
          .trim() || '0'
      const link =
        baseUrl +
        ($(this)
          .find('.title')
          .children('a')
          .attr('href')
          .trim() || '')
      const count =
        $(this)
          .find('.count')
          .text()
          .trim() || '0'
      const time =
        $(this)
          .find('.last-touched')
          .text()
          .trim() || '0'
      const ret = { title, count, time, link }
      res.push(ret)
      if (res.length % (50 * 36) === 0) {
        fs.writeFileSync(path.resolve(__dirname, 'data', `${Date.now()}.json`), JSON.stringify(res))
      }
    })
  } catch (e) {
  } finally {
    console.log('---> ', p)
    if (p === endP) {
      fs.writeFileSync(path.resolve(__dirname, 'data', `${Date.now()}.json`), JSON.stringify(res))
    }
    cb()
  }
}

const pageArr = []

for (let i = 1; i <= endP; i++) {
  pageArr.push(i)
}

const res = []
;(async () => {
  await async.eachLimit(
    pageArr,
    3,
    (p, cb) => {
      getPageData(p, cb, res)
    },
    err => {
      if (err) throw err
      console.log('finished')
    }
  )
})()
