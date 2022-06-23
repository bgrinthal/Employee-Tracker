const inquirer = require('inquirer');
const db = require("./db/connection");
const path = require('path');
const fs = require('fs');

// Creates a function to initialize app
function init() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'start',
                message: 'Please select an option:',
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a role",
                    "Add an employee",
                    "Update an employee role",
                ]
            }
        ])
        .then((answer) => {
            console.log(answer.start);
            if (answer.start === "View all departments") {
                viewDepartments();
            } else if (answer.start === "View all roles") {
                viewRoles();
            } else if (answer.start === "View all employees") {
                viewEmployees();
            } else if (answer.start === "Add a role") {
                addRole();
            } else if (answer.start === "Add an employee") {
                addEmployee();
            } else if (answer.start === "Update an employee role") {
                updateEmployee();
            }
        });
}

init();

function viewEmployees() {
    return db.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(e2.first_name, ' ' , e2.last_name) AS manager
        FROM employee 
        LEFT JOIN role ON role.id = employee.role_id 
        LEFT JOIN department ON department.id = role.department_id
        LEFT JOIN employee AS e2 ON e2.id = employee.manager_id`
    );
};