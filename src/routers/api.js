"use strict";

const express = require('express');

const invitesRoute = require('./invites');
const membersRoute = require('./members');
const inviteCandidates = require('./invite-candidate');

const apiRouter = express.Router();

apiRouter.use(invitesRoute);
apiRouter.use(membersRoute);
apiRouter.use(inviteCandidates);

module.exports = apiRouter;