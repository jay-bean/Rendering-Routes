'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(25)
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING.BINARY
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    biography: {
      type: DataTypes.STRING(150)
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.Route, {
      through: 'ClimbList',
      foreignKey: 'userId',
      otherKey: 'routeId'
    });
    User.hasMany(models.Route, {
      foreignKey: 'userId'
    })
    User.hasMany(models.Crag, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Review, {
      foreignKey: 'userId'
    });
  };
  return User;
};
