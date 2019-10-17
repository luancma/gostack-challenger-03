import * as Yup from 'yup';
import Matriculation from '../models/Matriculation';
import Plan from '../models/Plan';
import Student from '../models/Student';

class MatriculationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Student or Plan is not valid' });
    }
    const { student_id, plan_id, start_date, end_date } = req.body;

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

    const price = plan.price * plan.duration;

    return res.json({
      plan_id,
      student_id,
      start_date,
      end_date,
      price,
    });
  }
}

export default new MatriculationController();
