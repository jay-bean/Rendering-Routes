'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    title: {
      allowNull: false,
      type: DataTypes.STRING(64)
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    rating: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
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
    }
  }, {});
  Review.associate = function(models) {
    // associations can be defined here
  };
  return Review;
};
