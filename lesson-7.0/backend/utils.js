'use strict'

const Utils = {}
module.exports = Utils

Utils.randomColor = () => {
  return `rgb(${parseInt(Math.random()*300)}, 0, ${parseInt(Math.random()*200)})`
}

Utils.dbDate = (date) => {
  const d = date || new Date()

  const F = d.getUTCFullYear()
  const M = d.getUTCMonth()
  const D = d.getUTCDate()
  const H = d.getUTCHours()
  const Min = d.getUTCMinutes()
  const S = d.getUTCSeconds()

  return `${F}-${M}-${D} ${H}:${Min}:${S}`
}
