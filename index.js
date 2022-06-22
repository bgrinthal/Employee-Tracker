const inquirer = require('inquirer');
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
        .then((data) => {
            generateMarkdown(data);
            writeToFile(data);
        });
}

init();