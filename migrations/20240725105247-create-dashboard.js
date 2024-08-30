'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dashboard', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      life_time_value: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      projected_income_current_year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      current_year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      current_number_of_clients: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      current_number_of_prospects: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      average_rate: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      new_clients_per_year_to_reach_target: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sustainable_income: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      target_income: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      maximum_clients: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      coaching_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      who_pays_for_foaching: {
        type: Sequelize.ENUM('Individuals', 'Businesses'),
        allowNull: true,
      },
      services: {
        type: Sequelize.INTEGER,
        references: {
          model: 'services',
          key: 'id',
        },
        allowNull: true,
      },
      skill_workable_actions: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      skill_internal_experience: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      skill_systems: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      skill_culture: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      coaching_practice_status: {
        type: Sequelize.INTEGER,
        allowNull: true, 
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dashboard');
  }
};
