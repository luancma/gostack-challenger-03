import * as Yup from 'yup';
import { parseISO, isToday, isBefore, addMonths } from 'date-fns';
import Matriculation from '../models/Matriculation';
import Plan from '../models/Plan';
import Student from '../models/Student';

class MatriculationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error!' });
    }

    const { student_id, plan_id, date } = req.body;

    const student = await Student.findOne({
      where: { id: student_id },
    });

    if (!student) {
      return res.status(400).json({ error: 'Student not founded' });
    }

    const plan = await Plan.findOne({
      where: { id: plan_id },
      attributes: ['title', 'price', 'duration'],
    });

    if (!plan) {
      return res.status(400).json({ error: 'Plan not founded' });
    }

    const start_date = parseISO(date);

    if (isBefore(start_date, new Date()) && !isToday(start_date)) {
      return res.status(400).json({
        error: 'This date has passed',
      });
    }

    const end_date = addMonths(start_date, plan.duration);

    const price = plan.price * plan.duration;

    const matriculation = await Matriculation.create({
      plan_id,
      student_id,
      start_date,
      end_date,
      price,
    });

    return res.json(matriculation);
  }

  async index(req, res) {
    const listOfMatriculation = await Matriculation.findAll({
      attributes: [
        'id',
        'student_id',
        'plan_id',
        'price',
        'start_date',
        'end_date',
        'canceled_at',
      ],
    });

    return res.json(listOfMatriculation);
  }

  async update(req, res) {
    const validateMatriculation = await Matriculation.findOne({
      where: { id: req.params.id },
    });

    if (!validateMatriculation) {
      return res.status(400).json({
        error: 'Matriculation is not valid',
      });
    }

    const { plan_id, student_id } = req.body;

    const plan = await Plan.findByPk(plan_id);

    const student = await Student.findByPk(student_id);

    if (!plan || !student) {
      return res.status(400).json({
        error: 'Plan or student is not valid',
      });
    }

    const price = plan.duration * plan.price;

    const end_date = addMonths(validateMatriculation.start_date, plan.duration);

    let newMatriculation;

    await Matriculation.update(
      {
        price,
        end_date,
        student_id,
        plan_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then(async () => {
      newMatriculation = await Matriculation.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'price'],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['email', 'name'],
          },
          {
            model: Plan,
            as: 'plan',
            attributes: ['title', 'duration', 'price'],
          },
        ],
      });
    });

    return res.json({ newMatriculation });
  }
}

export default new MatriculationController();
