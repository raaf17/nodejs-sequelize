'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('members', [
      {
        name: `Soekarno`,
        gender: `Male`,
        contact: `081212111222`,
        address: `Blitar`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: `Soeharto`,
        gender: `Male`,
        contact: `081212111223`,
        address: `Indonesia`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: `B.J. Habibi`,
        gender: `Male`,
        contact: `081212111224`,
        address: `Sulawesi`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('members', null, {});
  }
};
