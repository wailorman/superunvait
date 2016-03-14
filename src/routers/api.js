"use strict";

const express = require('express');

const invitesRoute = require('./invites');
const membersRoute = require('./members');

const apiRouter = express.Router();

apiRouter.use(invitesRoute);
apiRouter.use(membersRoute);

module.exports = apiRouter;