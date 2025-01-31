const Teacher = require('../model/teacherModel');

exports.getAllTeacher = async (req, res,next) => {
    try {
        const teachers = await Teacher.findAll();
        res.json(teachers);
    } catch(err) {
        next(err);
    }
};