'use strict';

const respond = require('./responses');
const Issue = require('../models/issue');
const Revision = require('../models/revision');
const Change = require('../models/change');

const baseUrl = 'http://localhost:8080';
const ISSUE_NOT_FOUND_MESSAGE = 'Issue not found';

const Issues = {};

Issues.get = async (context) => {
  const issue = await Issue.findById(context.params.id);
  if (!issue) {
    respond.badRequest(context, ISSUE_NOT_FOUND_MESSAGE);
    return;
  }
  respond.success(context, { issue });
};

Issues.post = async context => {
  const issueRequest = {
    ...context.request.body,
    created_by: context.state.user.email
  };
  const issue = await Issue.create(issueRequest);
  await Revision.create({
    issueId: issue.id,
    issue:getSummrizedIssue(issue)
  });
  respond.success(context, { issue: issue });

}

Issues.put = async context => {
  const issue = await Issue.findById(context.params.id);
  if (!issue) {
    respond.badRequest(context, ISSUE_NOT_FOUND_MESSAGE);
    return;
  }
  const changedIssue = context.request.body;
  const changes = [];
  //get diffrence between original value and sent data
  for (const [key, value] of Object.entries(changedIssue)) {
    if (value !== issue[key]) {
      changes.push({
        title: key,
        description: value
      })
    }
  }
  
  if (changes.length) {
    await Issue.update({ ...context.request.body, updated_by: context.state.user.email }, {
      where: {
        id: context.params.id
      }
    });
    const revision = await Revision.create({
      issueId: issue.id,
      issue:getSummrizedIssue(issue)
    });
    const changesPromises = changes.map(change=>{
      return Change.create({
        ...change,
        revisionId : revision.id
      })
    });
    await Promise.all(changesPromises).catch(err => console.log(err));  
  }
  respond.success(context, { issue });
}

//Must have paging and don't load all issues
Issues.getAll = async context => {
  const issues = await Issue.findAll({ attributes: ['id', 'title', 'description'] });
  respond.success(context, { issues });
}

const getSummrizedIssue=(issue)=>( {title:issue.title,description:issue.description})

module.exports = Issues;
