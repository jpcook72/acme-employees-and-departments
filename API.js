const express = require('express');
const router = express.Router();
const { Employee, Department } = require('./db').models;

router.get('/employees', async (req,res,next) => {    
    try {
        res.send(await Employee.findAll());
    }
    catch (err) {
        next(err);
    }
});

router.get('/departments', async (req,res,next) => {    
    try {
        res.send(await Department.findAll());
    }
    catch (err) {
        next(err);
    }
});

router.put('/employees/:id', async (req,res,next) => {
    try{
        const emp = await Employee.findByPk(req.params.id);
        await emp.update({
            departmentId: null
        });
        res.send(emp);
    }
    catch(err) {
        console.log(err);
    }
});

router.delete('/employees', async (req,res,next) => {    
    try {
        const emp = await Employee.findByPk(req.body.id);
        await emp.destroy();
        res.send('deleted')
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;