'use strict';

const respond = require('./responses');
const Issue = require('../models/issue');
const Revision = require('../models/revision');
const Change = require('../models/change');


const Revisions = {};


Revisions.compare= async context=>{
    const {id,revisionA,revisionB} = context.params;

    const lastChanges = await Change.findAll({
        where:{
            revisionId: revisionB
        }
    });
    
    const allRevisionInRange= await Revision.findAll({
        where: {
            $and: {
                id: {
                    $gte: revisionA,
                    $lte: revisionB
                },
                issueId: {
                    $eq: id
                }
            }
        },
        order: [
            ['id', 'DESC']
        ]
    });
    const firstRevision = allRevisionInRange[allRevisionInRange.length-1];
    const lastRevision = allRevisionInRange[0];

    const allChangesBetween= await Change.findAll({
        where: {
            $and: {
                revisionId: {
                    $gte: revisionA,
                    $lte: revisionB
                }
            }
        }
    });
    respond.success(context,{
        issue:{
            before: JSON.parse(firstRevision.issue),
            after: applyChangesToIssue(JSON.parse(lastRevision.issue),lastChanges)
        },
        changes: getConvertedChanges(allChangesBetween),
        revisions: allRevisionInRange.map(rev =>getFormatedRevision(rev,allChangesBetween,false))
    })
}

Revisions.getAllByAnIssue = async context =>{
    //Loading like this isn't good and must be loaded by eager loading.
    const issue = await Issue.findById(context.params.id,{ attributes: ['id', 'title', 'description'] });
    const revisionsOfIssue = await Revision.findAll({
        where:{
        issueId:issue.id}});
    
    const revsionIds = revisionsOfIssue.map(revision =>revision.id);
    const changes = await Change.findAll({
        where:{
            revisionId: revsionIds
        }
    });
    const revisions = revisionsOfIssue.map(rev =>getFormatedRevision(rev,changes));
    respond.success(context,{
        revisions
    });
}

const getFormatedRevision=(revision,changes,hasIssue=true)=>{
    let obj={};
    if(hasIssue){
    obj = {
         issue:JSON.parse(revision.issue),
        changes: getConvertedChanges(changes.filter(change => change.revisionId === revision.id))
        ,
        updateAt : revision.updated_at,
        id : revision.id
    }}
    else{
        obj = {
           changes: getConvertedChanges(changes.filter(change => change.revisionId === revision.id))
           ,
           updateAt : revision.updated_at,
           id : revision.id
       }   
    }
    return obj;
}

const getConvertedChanges=(changes)=>(
     changes.reduce((acc,cur)=>({
                ...acc,[cur.title] : cur.description
            }),{}));


function applyChangesToIssue(oldIssue,changes){
    changes.forEach(item => {
        oldIssue[item.title] = item.description;
    });
    return oldIssue;
}


module.exports = Revisions;