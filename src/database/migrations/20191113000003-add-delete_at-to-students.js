module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('students', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('students', 'deleted_at');
  },
};
