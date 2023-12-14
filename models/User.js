import { Schema, model } from 'mongoose'
import { createHash } from 'crypto'
export var hash = password => password ? createHash('sha256').update(password).digest('hex') : ''
export default model('user', new Schema({
  username: { type: String, required: true },
  name: { type: String, },
  password: { type: String, required: true },
}).pre('save', function (next) {
  this.password = hash(this.password)
  next()
}))