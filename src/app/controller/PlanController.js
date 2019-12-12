import * as Yup from 'yup';
import Plan from '../models/Plan';
import User from '../models/User';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(403).json({
        error: 'This user does not have authorization',
      });
    }

    const alreadyExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (alreadyExists) {
      return res.status(400).json({
        error: 'Plan already exists',
      });
    }

    const planDetails = await Plan.create(req.body);

    return res.json(planDetails);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'The ID is not valid' });
    }

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(403).json({
        error: 'This user does not have authorization',
      });
    }

    const findByTitle = await Plan.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'title', 'price', 'duration'],
    });

    if (!findByTitle) {
      return res.status(400).json({ error: 'Plan does not match' });
    }

    const { id, title, duration, price } = findByTitle;

    return res.json({ id, title, duration, price });
  }

  async index(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(403).json({
        error: 'This user does not have authorization',
      });
    }

    const listOfPlans = await Plan.findAll({
      attributes: ['id', 'title', 'price', 'duration'],
    });

    return res.json({ listOfPlans });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({
        error: 'This id is not valid',
      });
    }

    const user = User.findByPk(req.userId);

    if (!user) {
      return res.status(403).json({
        error: 'This user does not have authorization',
      });
    }

    await Plan.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      message: 'Plan deleted',
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({
        error: 'You have to inform the ID',
      });
    }

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(403).json({
        error: 'This user does not have authorization',
      });
    }

    const plan = await Plan.findByPk(req.params.id);

    await plan.update(req.body);

    const { title, price, duration } = plan;

    return res.status(200).json({
      title,
      price,
      duration,
    });
  }
}

export default new StudentController();
