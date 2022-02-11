'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');

/*
The current version of Sequelize inside package  isn't compatible  with definign this class model
and I prefred to don't update it.Because lastest version of Sequelize work with mySql ver 8.0 .
As I wasn't sure about mySql version , I didn't update it
*/

// const {DataTypes, Model} = require('sequelize');
// class Issue extends Model{}
// Issue.init(
//   {
//     id: {
//       autoIncrement: true,
//       type: DataTypes.INTEGER(10).UNSIGNED,
//       allowNull: false,
//       primaryKey: true
//     },
//     title: {
//       type: DataTypes.STRING(255),
//       allowNull: false
//     },
//     description: {
//       type: DataTypes.STRING(255),
//       allowNull: false
//     },
//     created_by: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//       defaultValue: 'unknown'
//     },
//   }, {
//     sequelize,
//   timestamps: true,
//   updatedAt: 'updated_at',
//   createdAt: 'created_at',
//   tableName: 'revisions'
// }
// );

// module.exports = Issue;

module.exports = sequelize.define('issue', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  title: Sequelize.STRING,
  description: Sequelize.STRING,
  created_by: {
    type: Sequelize.STRING,
    defaultValue: 'unknown'
  },
  updated_by: {
    type: Sequelize.STRING,
    defaultValue: 'unknown'
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  tableName: 'issues'
});


