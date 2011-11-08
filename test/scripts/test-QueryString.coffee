do (require, exports) ->
  QueryString = require('serialization/QueryString')

  exports['serialization/QueryString'] =

    stringify: (test) ->
      test.strictEqual(QueryString.stringify(
          name: null
        ), 'name')
      test.strictEqual(QueryString.stringify(
          name: 'Freds'
        ), 'name=Freds')
      test.strictEqual(QueryString.stringify(
          name: 'Freds'
          age: 22
        ), 'name=Freds&age=22')
      test.strictEqual(QueryString.stringify(
          name: ['Freds', 'Freddy']
          age: 22
        ), 'name=Freds&name=Freddy&age=22')
      test.done()

    parse: (test) ->
      test.deepEqual('name', QueryString.stringify(
          name: null
        ))
      test.deepEqual('name=Freds', QueryString.stringify(
          name: 'Freds'
        ))
      test.deepEqual('name=Freds&age=22', QueryString.stringify(
          name: 'Freds'
          age: 22
        ))
      test.deepEqual('name=Freds&name=Freddy&age=22', QueryString.stringify(
          name: ['Freds', 'Freddy']
          age: 22
        ))
      test.done()

  console.log arguments.callee
