'use strict';
module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    name: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    image: {
      type: DataTypes.STRING
    },
    difficulty: {
      allowNull: false,
      type: DataTypes.STRING
    },
    height: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    protection: {
      allowNull: false,
      type: DataTypes.STRING
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    userId: {
      allowNull: false,
      references: {
        model: 'Users'
      },
      type: DataTypes.INTEGER
    },
    cragId: {
      allowNull: false,
      references: {
        model: 'Crags'
      },
      type: DataTypes.INTEGER
    }
  }, {});
  Route.associate = function(models) {
    // associations can be defined here
    Route.belongsToMany(models.User, {
      through: 'ClimbList',
      foreignKey: 'routeId',
      otherKey: 'userId'
    });
    Route.hasMany(models.Review, {
      foreignKey: 'routeId'
    });
    Route.belongsTo(models.Crag, {
      foreignKey: 'cragId'
    });
    Route.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Route;
};
