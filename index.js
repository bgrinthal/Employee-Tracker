const inquirer = require('inquirer');
const { end, connect, off } = require('./db/connection');
const { connection } = require('./db/index');
const db = require("./db/index");

// Import console table for logging information on screen in table format
require("console.table");

// Call startup function
init();

// main initial functions questions
function init() {
    inquirer
        .prompt(
            questions = ([
                {
                    type: 'list',
                    name: 'start',
                    message: 'Please choose an option: ',
                    choices: [
                        "View all departments",
                        "View all roles",
                        "View all employees",
                        "Add a department",
                        "Add a role",
                        "Add an employee",
                        "Update an employee role",
                        "Remove an emplyee",
                        "Remove a role",
                        "Remove a department",
                        "Quit"
                    ]
                },
            ])

        )
        .then((answer) => {
            if (answer.start === "View all departments") {
                viewDept();
            } else if (answer.start === "View all roles") {
                viewRo();
            } else if (answer.start === "View all employees") {
                viewEmp();
            } else if (answer.start === "Add a department") {
                addDept();
            } else if (answer.start === "Add a role") {
                addRo();
            } else if (answer.start === "Add an employee") {
                addEmp();
            } else if (answer.start === "Update an employee role") {
                updateEmpRole();
            } else if (answer.start === "Remove an emplyee") {
                removeEmployee();
            } else if (answer.start === "Remove a role") {
                removeRole();
            } else if (answer.start === "Remove a department") {
                removeDepartment();
            } else {
                exit();
            }
        });
}

// function to view all current employees
function viewEmp() {
    // calls method that to run proper mysql commands
    db.viewEmployees()
        .then(([result]) => {
            console.table(result)
            init();
        })
}

// function to view all current roles
function viewRo() {
    db.viewRoles()
        .then(([result]) => {
            console.table(result);
        })
        .then(() => {
            init();
        })
};

// function to view all current departments
function viewDept() {
    db.viewDepartments()
        .then(([result]) => {
            console.table(result);
        })
        .then(() => {
            init();
        })
};

// function to add new department
function addDept() {
    inquirer
        .prompt(
            ([
                {
                    type: 'input',
                    name: 'department',
                    message: 'What department would you like to add?',
                },
            ])
        )
        .then(({ department }) => {
            // calls method to run propper mysql commands
            db.addDepartment(department)
            console.log(`Added ${department} department!`)
            init();
        })
}

// Function to add new role
function addRo() {
    let departments = []
    // Cycles through existing departments and stores them in array
    connection.query(`SELECT * FROM department`, (err, data) => {
        if (err) throw err;

        for (let i = 0; i < data.length; i++) {
            departments.push(data[i].name)
        }
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What role would you like to add?',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary for this role?',
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'What department does this role belong to?',
                    choices: departments
                }
            ]).then(({ title, salary, department_id }) => {
                // gets numberic index/id form input
                let index = departments.indexOf(department_id) + 1;
                // calls method to run proper mysql commands
                db.addRole(title, salary, index);
                console.log(`Added ${title} role!`);
                init();
            })
    })
}

// function to add a new employee
function addEmp() {
    let managers = [];
    let roles = [];

    // used to cycle through existing employee and roles and store them in array
    connection.query(`SELECT * FROM role`, function (err, data) {
        if (err) throw err;
        // console.log(data)

        for (let i = 0; i < data.length; i++) {
            roles.push(data[i].title);
        }

        connection.query(`SELECT first_name, last_name FROM employee`, function (err, data) {
            if (err) throw err;

            for (let i = 0; i < data.length; i++) {
                managers.push(data[i].first_name);
            }

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'Please enter your last name',
                    },
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'Please enter your first name',
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'What role does this employee belong to?',
                        choices: roles
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: "Who is their manager?",
                        choices: ['none'].concat(managers)
                    }
                ]).then(({ first_name, last_name, role_id, manager_id }) => {
                    let mngrIndex;
                    //gets numeric index/id for input
                    let roleIndex = roles.indexOf(role_id) + 1;
                    //Checks if emplpyee has no manager
                    if(manager_id === 'none'){
                        //calls method to run mysql
                        db.addEmployee(first_name, last_name, roleIndex, 0);
                        console.log(`Added employee ${first_name} ${last_name}!`)
                    } else {
                        mngrIndex = managers.indexOf(manager_id) + 1;
                        //calls method to run mysql
                        db.addEmployee(first_name, last_name, roleIndex, mngrIndex);
                        console.log(`Added employee ${first_name} ${last_name}!`)
                    }
                    viewEmp();
                })
        })
    })
}

// function to update existing employees role
function updateEmpRole() {
    let employees = [];
    let roles = [];
    // used to cycle through existing employee and roles and store them in array
    connection.query(`SELECT * FROM role`, function (err, data) {
        if (err) throw err;

        for (let i = 0; i < data.length; i++) {
            roles.push(data[i].title);
        }

        connection.query(`SELECT * FROM employee`, function (err, data) {
            if (err) throw err;

            for (let i = 0; i < data.length; i++) {
                employees.push(data[i].first_name);
            }

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee_id',
                        message: 'Whose role needs to be updated?',
                        choices: employees
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'What is the new role?',
                        choices: roles
                    }
                ]).then(({ employee_id, role_id }) => {
                    //gets numeric index/id for input
                    let empIndex = employees.indexOf(employee_id);
                    let roleIndex = roles.indexOf(role_id);
                    //calls method to run mysql
                    db.updateEmployeeRole(empIndex, roleIndex);
                    console.log(`Employee role updated!`)
                    init();
                })

        })
    })
}

// Function to delete an Employee
function removeEmployee() {

    connection.query(`SELECT employee.id, employee.first_name, employee.last_name FROM employee`, (error, response) => {
        if (error) throw error;
        let employeeNamesArray = [];
        response.forEach((employee) => { employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`); });

        inquirer
            .prompt([
                {
                    name: 'chosenEmployee',
                    type: 'list',
                    message: 'Which employee would you like to remove?',
                    choices: employeeNamesArray
                }
            ])
            .then((answer) => {
                let employeeId;

                response.forEach((employee) => {
                    if (
                        answer.chosenEmployee ===
                        `${employee.first_name} ${employee.last_name}`
                    ) {
                        employeeId = employee.id;
                    }
                });

                connection.query(`DELETE FROM employee WHERE employee.id = ?`, [employeeId], (error) => {
                    if (error) throw error;
                    console.log(`Employee Successfully Removed!`);
                    viewEmp();
                });
            });
    });
};

// Function to delete a Role
function removeRole() {

    connection.query(`SELECT role.id, role.title FROM role`, (error, response) => {
        if (error) throw error;
        let roleNamesArray = [];
        response.forEach((role) => { roleNamesArray.push(role.title); });

        inquirer
            .prompt([
                {
                    name: 'chosenRole',
                    type: 'list',
                    message: 'Which role would you like to remove?',
                    choices: roleNamesArray
                }
            ])
            .then((answer) => {
                let roleId;

                response.forEach((role) => {
                    if (answer.chosenRole === role.title) {
                        roleId = role.id;
                    }
                });

                connection.query(`DELETE FROM role WHERE role.id = ?`, [roleId], (error) => {
                    if (error) throw error;
                    console.log(`Role Successfully Removed`);
                    viewRo();
                });
            });
    });
};

// Function to delete a Department
function removeDepartment() {
    connection.query(`SELECT department.id, department.name FROM department`, (error, response) => {
        if (error) throw error;
        let departmentNamesArray = [];
        response.forEach((department) => { departmentNamesArray.push(department.name); });

        inquirer
            .prompt([
                {
                    name: 'chosenDept',
                    type: 'list',
                    message: 'Which department would you like to remove?',
                    choices: departmentNamesArray
                }
            ])
            .then((answer) => {
                let departmentId;

                response.forEach((department) => {
                    if (answer.chosenDept === department.name) {
                        departmentId = department.id;
                    }
                });

                connection.query(`DELETE FROM department WHERE department.id = ?`, [departmentId], (error) => {
                    if (error) throw error;
                    console.log(`Department Successfully Removed`);
                    viewDept();
                });
            });
    });
};

// function to exit application
function exit() {
    connection.end()
};


