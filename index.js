const inquirer = require('inquirer');
const { end, connect } = require('./db/connection');
const { connection } = require('./db/index');
// Optional: import asciiart-logo
// import your database module
const db = require("./db/index");

// Import console table for logging information on screen in table format
require("console.table");

// Call startup function
init();

// function: start up
//    optional: display logo text, load main prompts using asciiart-logo
//    call function to the main prompt for questions


// function - main prompt for questions
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
            } else {
                exit();
            }
        });
}

// - Prompt with the list of choices
// - In .then callback, check user's response with the switch-case statement.
//    call the appropriate function depending on what the user chose
//      - in case of view employees, call the view employees function
//      - in case of add employee, call the add employee function
//      - in case of update employee's role, call the update employee role function
//      - in case of view departments, call the view departments function
//      - in case of add department, call the add department function
//      - in case of view roles, call the view roles function
//      - in case of add role, call the add role function
//      - in default, call function to quit
//
// OPTIONAL:
//      - in case of update employee's manager, call the update employee manager function
//      - in case of view employees by manager, call the view employees by manager function
//      - in case of view employees by department, call the view employees by department function
//      - in case of view utilized budget by department, call the function to view utilized budget by department
//      - in case of remove department, call the remove department function
//      - in case of remove role, call the remove role function
//      - in case of remve employee, call the remove employee function
//      - in default, call function to quit

// function - View all employees
function viewEmp() {
    // 1. call find all employees method on database connection - db.method
    db.viewEmployees()
        .then(([result]) => {
            console.table(result)
            init();
        })
    //    in .then callback, display returned data with console table method
    // 2. call function to load main prompt for questions
    //
}

// function - View all roles
function viewRo() {
    db.viewRoles()
        .then(([result]) => {
            console.table(result);
        })
        .then(() => {
            init();
        })
};
// 1. call find all roles method on database connection
//    in .then callback, dispalay returned data with console table
// 2. call function to load main prompt for questons
//

// function - View all deparments
function viewDept() {
    db.viewDepartments()
        .then(([result]) => {
            console.table(result);
        })
        .then(() => {
            init();
        })
};

// Add a department
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
            db.addDepartment(department)
            console.log(`Added ${department} department!`)
            init();
        })
}

function addRo() {
    let departments = []

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
                let index = departments.indexOf(department_id);
                db.addRole(title, salary, index);
                console.log(`Added ${title} role!`);
                init();
            })
    })
}

// function to add a new employee
function addEmp() {
    let employees = [];
    let roles = [];

    // used to cycle through existing emplotee and roles and store them in array
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
                        choices: ['none'].concat(employees)
                    }
                ]).then(({ first_name, last_name, role_id, manager_id }) => {
                    //gets numeric index/id for input
                    let mngrIndex = employees.indexOf(manager_id);
                    let roleIndex = roles.indexOf(role_id);
                    //calls function to run mysql
                    db.addEmployee(first_name, last_name, roleIndex, mngrIndex);
                    console.log(`Added employee ${first_name} ${last_name}!`)
                    init();
                })

        })
    })
}

// function - Update an employee's role
function updateEmpRole() {
    let employees = [];
    let roles = [];

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
                    let empIndex = employees.indexOf(employee_id);
                    let roleIndex = roles.indexOf(role_id);
                    db.updateEmployeeRole(empIndex, roleIndex);
                    console.log(`Employee role updated!`)
                    init();
                })

        })
    })
}
//  1. call function to find all employees on database connection
//      - in .then callback, take first name, last name, and id from the returned database data and create an array
//        of new employee objects with .map().
//      - new objects have two properties, name and value
//        name consists of first name and last name from the returned database data
//        value has id from the returned database data
//  2. prompt the list of choices from the new array of employee objects
//      - in .then callback, store employee id to a variable from the returned user choice
//  3. call function to find all roles on database connection
//      - in .then callback, create a new array of new role objects using .map on the returned database role data
//      - for the new role objects, assign title from returned database data to the name property and assign id to the value property
//  4. prompt user with the list of choices from the new array of new role objects
//      - in .then callback, assign returned user choice to a role id variable
//  5. call function to update employee role, passing employee id variable and role id variable as input arguments
//  6. call fucntion to load main prompt of questions


// function - Exit the application
function exit() {
    connection.end()
};


