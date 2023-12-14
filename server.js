import 'dotenv/config.js'
import user from './models/User.js'
import express from 'express'
import { connect } from 'mongoose'
var { log, error } = console
await connect(process.env.dburi)
/**user find filter that returns all users or optionally specific users via comma separated ids*/
var id_filter = request => request.params?.id ? { _id: { $in: request.params.id.split(',') } } : {}
var { href, port } = new URL('http://localhost:' + (process.env.port || 1111))
express().use(express.json())
  // find users, filter out passwords and send response if no error or else pass error to next
  .get('/:id?', (req, res, next) => user.find(id_filter(req), { password: 0 }).exec().then(o => o[0] ? res.status(200).send(o) : res.sendStatus(404), next))
  // adds users and send response if no error or else pass error to next
  .post('/', (req, res, next) => new user(req.body).save().then(o => res.status(201).send(o), next))
  // update users via req.body and send response if no error or else pass error to next
  .put('/:id?', (req, res, next) => user.findOneAndUpdate(id_filter(req), { $set: [req.body].flat()[0] }).then(o => res.sendStatus(200), next))
  // delete users by id and send response if no error or else pass error to next
  .delete('/:id?', (req, res, next) => user.findOneAndDelete(id_filter(req)).then(o => res.sendStatus(200), next))
  // default error handler
  .use((err, req, res, next) => (res.sendStatus(500), error(err.message)))
  .listen(port, () => log(href))
