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
}

export default new MatriculationController();
