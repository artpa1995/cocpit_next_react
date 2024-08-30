/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE', 
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'clients',
          key: 'id',
        },
        onDelete: 'CASCADE', 
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'services',
          key: 'id',
        },
        onDelete: 'CASCADE', 
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      ltv: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('bookings');
  }
};


