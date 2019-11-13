import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.DECIMAL,
        deleted_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
  }
}
export default Plan;
