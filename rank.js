const path = require('path')
const fs = require('fs')
const jsonData = require('./data/1573574713147.json')
const { createHeap, findMaxPrev } = require('./sortPrev')

const target = Array(1000).fill({ count: 0 })

function compareVal(a) {
  return Number(a.count)
}
createHeap(target, compareVal)

jsonData.forEach(item => {
  findMaxPrev(item, target, compareVal)
})

target.sort((a, b) => b.count - a.count)

fs.writeFileSync('./result.json', JSON.stringify(target))

let mdText = '# 光谷社区排行\n'

target.forEach(item => {
  mdText += `- 【${item.count}】【${item.time}】 [${item.title}](${item.link}) \n`
})

fs.writeFileSync('./result.md', mdText)
