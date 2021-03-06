'use strict';

module.exports = function(sequelize, DataTypes) {
  var destination = sequelize.define('destinations', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      organization_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'organizations',
            key: 'id'
        }
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'countries',
            key: 'id'
        }
      },
      address_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'addresses',
            key: 'id'
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      average_rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      review_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },      
      is_visible: {
        allowNull: false,
        defaultValue: true,
        type: DataTypes.BOOLEAN
      },
      is_approved: {
        allowNull: false,
        defaultValue: true,
        type: DataTypes.BOOLEAN
      },
    }, {
    updatedAt: 'updated',
    createdAt: 'created',
    underscored: true
  });
  return destination;
};