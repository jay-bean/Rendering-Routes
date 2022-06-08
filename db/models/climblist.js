'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClimbList = sequelize.define('ClimbList', {
    userId: {
      allowNull: false,
      references: {
        model: 'Users'
      },
      type: DataTypes.INTEGER
    },
    routeId: {
      allowNull: false,
      references: {
        model: 'Routes'
      },
      type: DataTypes.INTEGER
    },
    haveClimbed: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  }, {});
  ClimbList.associate = function(models) {
    ClimbList.belongsTo(models.User, {foreignKey: 'userId'})
    ClimbList.belongsTo(models.Route, {foreignKey: 'routeId'})
  };
  return ClimbList;
};
