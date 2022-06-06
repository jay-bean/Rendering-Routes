'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Routes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.STRING
      },
      difficulty: {
        allowNull: false,
        type: Sequelize.STRING
      },
      height: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      protection: {
        allowNull: false,
        type: Sequelize.STRING
      },
      userId: {
        allowNull: false,
        references: {
          model: 'Users'
        },
        type: Sequelize.INTEGER
      },
      cragId: {
        allowNull: false,
        references: {
          model: 'Crags'
        },
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Routes');
  }
};
