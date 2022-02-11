'use strict';

const Koa = require('koa');
const app = new Koa();
const router = require('./lib/routes');
const userMiddleware = require('./lib/middlewares/authMiddleware');
const PORT = 8080;

app.use(require('koa-bodyparser')());
app.use(userMiddleware);
app.use(router.middleware());


app.listen(PORT);
console.log('Listening on http://localhost:%s/', PORT);
