'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('money', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      event_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'event_type',
          key: 'id',
        },
        onDelete: 'CASCADE', 
      },
    
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('money');
  }
};
