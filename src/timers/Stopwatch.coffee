_clone = require('utils/ObjectUtil').clone
_padRight = require('utils/StringUtil').padRight
_storage = {}

module.exports = Stopwatch =

    start:(name)->
        if (name of _storage)?
            date = _storage[name]
        else
            date = _storage[name] = {}
            date.counter = 0
            date.total = 0
        date._startAt = (new Date()).getTime()
        return

    stop:(name)->
        date = _storage[name]
        if date?._startAt?
            date.counter++
            date.total += (new Date()).getTime() - date._startAt
            date.average = date.total / date.counter
            delete date._startAt
        return

    toObject:(name)->
        _clone(_storage[name])

    toString:(name = null)->
        if name?
            @_toString(name, 0)
        else
            max = 'name'.length
            max = Math.max max, name.length for name of _storage
            rows = []
            rows.push @_toString name, max for name of _storage
            rows.join('\n')
    _toString:(name, max)->
        date = _storage[name]
        "#{ _padRight name, max, ' ' } : #{ date.total }(ms) / #{ date.counter } = #{ date.average }(ms)"
