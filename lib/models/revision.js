'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');

module.exports  = sequelize.define('revision', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  issue:Sequelize.JSON,
  issueId: Sequelize.INTEGER,
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  tableName: 'revisions'
});

