/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('page_data', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      page_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      page_key: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      page_value: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('page_data');
  }
};


