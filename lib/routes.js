'use strict';
const JoiRouter = require("koa-joi-router");
const issues = require('./api/issues');
const revisions = require('./api/revisions');

const Joi = JoiRouter.Joi;
const router = new JoiRouter();

const issueValidation = {
    validate: {
        type: "json",
        body: {
            title: Joi.string()
                .max(255)
                .required(),
            description: Joi.string()
                .max(255)
                .required()
        }
    }
};

router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));
router.get('/issues/:id', issues.get);
router.get('/issues', issues.getAll);
router.get('/issues/:id/revisions', revisions.getAllByAnIssue);
router.get('/issues/:id/compare/:revisionA/:revisionB', revisions.compare);
router.post('/issues',issueValidation,issues.post);
router.put('/issues/:id',issueValidation,issues.put);

module.exports = router;
