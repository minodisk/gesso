__R_ISO_8601 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d*))?Z$/
__padLeft = require('utils/StringUtil').padLeft

module.exports = DateFormat =

  stringifyJSON: (date) ->
    "#{date.getUTCFullYear()}
-#{__padLeft(date.getUTCMonth() + 1, 2, '0')}
-#{__padLeft(date.getUTCDate(), 2, '0')}
T#{__padLeft(date.getUTCHours(), 2, '0')}
:#{__padLeft(date.getUTCMinutes(), 2, '0')}
:#{__padLeft(date.getUTCSeconds(), 2, '0')}
.#{__padLeft(date.getUTCMilliseconds(), 3, '0')}Z"

  parseJSON: (dateString) ->
    if typeof dateString is 'string'
      r = __R_ISO_8601.exec(dateString)
      if r?
        return new Date(Date.UTC(+r[1], +r[2] - 1, +r[3], +r[4], +r[5], +r[6], +r[7]))
    dateString

  reviveJSON: (key, value) ->
    DateFormat.parseJSON(value)
