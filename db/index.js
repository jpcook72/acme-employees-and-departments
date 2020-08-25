const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme-employees-and-departments', {
    logging: false
});
const faker = require('faker');

const Employee = db.define('employees', {
    name: STRING
});

const Department = db.define('departments', {
    name: STRING
})
 
Department.hasMany(Employee, {as: 'departmentId'});

const syncAndSeed = async () => {
    await db.sync({force: true});
    let deptArr = [];
    let empArr = [];
    for(let x = 1; x <= 5; x++) {
        deptArr.push(Department.create({
            name: faker.commerce.department()
        }))
    }
    await Promise.all(deptArr);
    for(let x = 1; x <= 50; x++) {
        empArr.push(Employee.create({
            name: faker.name.firstName(),
            departmentId: (Math.floor(Math.random() * 5) + 1)
        }));
    }
    await Promise.all(empArr);
}

module.exports = {
    db,
    models: {
        Employee,
        Department
    },
    syncAndSeed
}