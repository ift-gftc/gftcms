import test from 'ava'
import { hello } from '.'

test('return hello', t => {
  t.is(hello(), 'HELLO')
})
