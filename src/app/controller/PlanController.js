import * as Yup from 'yup';
import Plan from '../models/Plan';
import User from '../models/User';

const validate = async id => User.findByPk(id);

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (!validate(req.userId)) {
      return res
        .status(400)
        .json({ error: "You don't have access to do that" });
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

    if (!validate(req.userId)) {
      return res
        .status(400)
        .json({ error: "You don't have access to do that" });
    }

    const findByTitle = await Plan.findOne({
      where: { id: req.params.id, deleted_at: null },
      attributes: ['id', 'title', 'price', 'duration'],
    });

    if (!findByTitle) {
      return res.status(400).json({ error: 'Plan does not match' });
    }

    const { id, title, duration, price } = findByTitle;

    return res.json({ id, title, duration, price });
  }

  async index(req, res) {
    if (!validate(req.userId)) {
      return res
        .status(400)
        .json({ error: "You don't have access to do that" });
    }

    const listOfPlans = await Plan.findAll({
      where: { deleted_at: null },
      order: ['duration'],
      attributes: ['id', 'title', 'price', 'duration'],
    });

    return res.json({ listOfPlans });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'The ID is not valid' });
    }

    if (!validate(req.userId)) {
      return res
        .status(400)
        .json({ error: "You don't have access to do that" });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'The ID is not valid' });
    }

    plan.deleted_at = new Date();

    await plan.save();

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (!validate(req.userId)) {
      return res
        .status(400)
        .json({ error: "You don't have access to do that" });
    }

    const plan = await Plan.findByPk(req.params.id);

    const { title, duration, price } = req.body;

    await plan.update(req.body);

    return res.json({ title, duration, price });
  }
}

export default new PlanController();
