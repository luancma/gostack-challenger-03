import * as Yup from 'yup';
import Plan from '../models/Plan';

class StudentController {
  async store(req, res) {
    // Validation with YUP
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // ///////////

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
    // Validation with YUP
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'The ID is not valid' });
    }
    // ///////////
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
    const listOfPlans = await Plan.findAll({
      attributes: ['id', 'title', 'price', 'duration'],
    });

    return res.json({ listOfPlans });
  }
}

export default new StudentController();
