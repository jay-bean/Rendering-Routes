'use strict';
module.exports = (sequelize, DataTypes) => {
  const Crag = sequelize.define('Crag', {
    name: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    location: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    image: {
      type: DataTypes.STRING
    },
    userId: {
      allowNull: false,
      references: {
        model: 'Users'
      },
      type: DataTypes.INTEGER
    }
  }, {});
  Crag.associate = function(models) {
    // associations can be defined here
    Crag.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Crag.hasMany(models.Route, {
      foreignKey: 'cragId'
    });
  };
  return Crag;
};
