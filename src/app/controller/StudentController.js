import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    // Validation with YUP
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      name: Yup.string().required(),
      age: Yup.number().required(),
      height: Yup.number().required(),
      weight: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // ///////////
    const alreadyExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (alreadyExists) {
      return res.status(400).json({
        error: 'Student already exists',
      });
    }

    const { id, name, email } = await Student.create(req.body);

    return res.json({ id, name, email });
  }
}

export default new StudentController();
