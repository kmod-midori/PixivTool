__ = require('./i18n')

date2json = (d)->
  {
    year:d.getFullYear()
    month: d.getMonth()
    day: d.getDate()
    hour: d.getHours()
    minute: d.getMinutes()
  }

module.exports = (tmpl,data)->
  tim = (require 'tinytim').render
  data.date = date2json(new Date(data.created_time))
  data.now = date2json(new Date())

  data.page.curr = data.page.orig + 1

  tmpl = tmpl.replace(
    /{{(tags|tools)\[(.*?)\](?:\|(\d+))?}}/g,
    (match, type, sep, maxlen)->
      if maxlen?
        maxlen = parseInt(maxlen, 10)
      else
        maxlen = Infinity

      data[type]
        .filter((x)->x.length <= maxlen)
        .join(sep)
        .replace('{{', '')
  ).replace(/\?\[(.*?)\]\?/g, (match, str)->
    if data.is_manga
      return str
    else
      return ''
  )

  ret = ""
  warnings = []

  try
    ret = tim tmpl,data
  catch e
    e = e.message
    m2 = e.match /^tim: '(.+?)' not found.*/
    if m2?
      warnings.push __ 'invalid_tag', m2[1]
    else
      warnings.push e

  return {
    result:ret.replace(/[\|\\/:*?"<>]/g, '')
    warnings
  }
