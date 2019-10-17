import Sequelize, { Model } from 'sequelize';

class Matriculation extends Model {
  static init(sequelize) {
    super.init(
      {
        price: Sequelize.STRING,
        end_date: Sequelize.DATE,
        start_date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // relacionamentos
  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Student, { foreignKey: 'plan_id', as: 'plan' });
  }
}
export default Matriculation;
