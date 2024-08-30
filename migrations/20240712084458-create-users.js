/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
        unique: true,
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      password: {
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
      google_id: {
        type: Sequelize.STRING,
        allowNull: true,
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
        unique: true,
      },
      start_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      week_days: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      currency: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('users');
  }
};


