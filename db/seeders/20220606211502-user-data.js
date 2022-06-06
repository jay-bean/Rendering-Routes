'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      { username: 'coolguy48', password: 'superSecretPassword48!', email: 'coolGuy48@gmail.com', biography: "Hey yall! I'm your super cool guy, 'coolGuy48'! I'm the best climber in town and everyone knows it!", createdAt: new Date(), updatedAt: new Date()  }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
