'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');

module.exports = sequelize.define('change', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  title: Sequelize.STRING,
  description: Sequelize.STRING,
  revisionId: Sequelize.INTEGER,
},
{
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  tableName: 'changes'
});
