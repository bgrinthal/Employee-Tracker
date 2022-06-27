

/*
  REMOVE COMMENTS BEFORE SUBMITTING YOUR HOMEWORK
*/

// Import inquirer
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
                        "Add an employee role",
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
            } else if (answer.start === "Update an employees role") {
                updateEmployeeRole();
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
//  1. call find all departments method on database connnection
//      in .then call back, display returned data with console table
//  2. call function to load main prompt for questions
//

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
//  1. prompt user for the name of the department
//      in .then callback, call create department method on database connection, passing the returned data as input argument
//  2. call function to load main prompt for questions
//

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

//  **prompt for user to enter the role, the salary, and what department the role belongs to
//  1. call find all departments method on database connection to get array of existing department records
//      in .then call back, create array of objects with names and ids from returned data with .map() method
// CHOICES: [{ NAME, VALUE}, [{ NAME, VALUE}, ...]     id is inside VALUE (value of id) (good inquierer npm docs)->first link->repository
//  2. prompt user for title, salary, and department choosing from the list of departmernts created above
//      in .then callback, call funcon to create role on database connection, passing returned data from prompt as input argument
//  3. call function to load main prompt for questions
//

// function - Add a new employee
// function addEmp() {
//     let employees = [];
//     let roles = [];

//     connection.query(`SELECT * FROM role`, (err, data) => {
//         if (err) throw err;

//         for (let i = 0; i < data.length; i++) {
//             roles.push(data[i].title)
//         }
//         connection.query(`SELECT * FROM employee`), (err, data) => {
//             if (err) throw err;

//             for (let i = 0; i < data.length; i++) {
//                 employees.push(data[i].first_name)
//             }
//         }
//         inquirer
//             .prompt([
//                 {
//                     type: 'input',
//                     name: 'last_name',
//                     message: 'Please enter your last name',
//                 },
//                 {
//                     type: 'input',
//                     name: 'first_name',
//                     message: 'Please enter your first name',
//                 },
//                 {
//                     type: 'list',
//                     name: 'role_id',
//                     message: 'What role does this employee belong to?',
//                     choices: roles
//                 },
//                 {
//                     type: 'list',
//                     name: 'manager_id',
//                     message: "Who is their manager?",
//                     choices: ['none'].concat(employees)
//                 }
//             ]).then(({ first_name, last_name, role_id, manager_id }) => {
//                 console.log(first_name, last_name, role_id, manager_id)
//                 // let queryText = `INSERT INTO employee (first_name, last_name, role_id`;
//                 let mngrIndex = employees.indexOf(manager_id);
//                 let roleIndex = roles.indexOf(role_id)
//                 db.addEmployee(first_name, last_name, roleIndex, mngrIndex)
//                 // if (manager_id != 'none') {
//                 //     queryText += `, manager_id) VALUES ('${first_name}', '${last_name}', ${roles.indexOf(role_id)}, ${employees.indexOf(manager_id) + 1})`
//                 // } else {
//                 //     queryText += `) VALUES ('${first_name}', '${last_name}', ${roles.indexOf(role_id) + 1})`
//                 // }
//                 // console.log(queryText)

//                 // connection.query(queryText, function (err, data) {
//                 //     if (err) throw err;

//                 //     init();
//                 // })
//             })
//     }
//     )}

//  1. prompt for first_name and last_name
//      in .then callback, store the first namd and the last name to variables,
//  2. call function to find all roles on database connection to get all existing roles
//      in .then callback, create array of role objects with id and title from returned array of role data with .map()
//  3. prompt user for the role for the employee choosing from a list (array) of role objecs
//      in .then callback, store the role id to a variable,
//  4. call function to find all employees on database connection
//      in .then callback, create array of managers with id, first name, last name from the returned data with .map()
//  5. prompt user for the manager from a list from the array of managers
//      in .then callback, create an employee object with variables for first name, last name, role id, manager id
//  6. call function to create employee on database connection, passing the employee object as input argument
//      in .then callback, call function to load main prompt for questions

function addEmp() {
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
                    let mngrIndex = employees.indexOf(manager_id);
                    let roleIndex = roles.indexOf(role_id);
                    db.addEmployee(first_name, last_name, roleIndex, mngrIndex);
                    console.log(`Added employee ${first_name} ${last_name}!`)
                    init();
                })

        })
    })
}

// function - Update an employee's role
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


