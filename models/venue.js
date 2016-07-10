'use strict';

module.exports = function(sequelize, DataTypes) {
  var venue = sequelize.define('venue', {
    name: DataTypes.STRING
  }, {
    updatedAt: 'updated',
    createdAt: 'created'
  });
  return venue;
};