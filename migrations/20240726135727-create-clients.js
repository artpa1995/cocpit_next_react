/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('clients', {
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
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      source: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      source_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ltv: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      estimated_salary: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      intention: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      agreed_meetings: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      agreed_meetings_frequency: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      billing_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      positive_impression: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      how_well_do_they_know_you: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      combined_network_rank: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      days_since_last_contact: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pronouns: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      time_zone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
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
    await queryInterface.dropTable('clients');
  }
};


