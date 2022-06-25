/************************************************
  REMOVE ALL COMMENTS BEFORE SUBMITTING YOUR HOMEWORK
*************************************************/

// STEPS
// 1. Declare a class for database methods encapsulating all SQL statements
// 2. Exports the database object instantiated (using "new") from the database class, passing connection object to the class constructor




// As suggested in README.md guideline for this homework, you can choose to use constructor functions or class to develop the functions
//  for SQL statements. Since class gives you cleaner syntax, this pseudo code is assumed that you use class for the implementation of
//  SQL statements. Remember both constructor functions and classes are to be used to create objects.

// HINT: To use promise wrapper, for example:
//  const databaseConnection = mysql.createConnection({...});
//  databaseConnection.promise().query(...);
//
//  - the whole query statement needs to be returned in the same line for the caller to receive the data with promise .then or async/await
//        for example: return databaseConnection.promise().query(...);
//  - all queries that take in parameters need to be prepared statements

// =============
// MAIN PROCESS
// =============
// import database connection from the current db folder
const connection = require("./connection");

// class - for database or database access object
class DB {
    //  1. constructor - takes in database connection as input parameter and assign it to the instant variable
    constructor(connection) {
        this.connection = connection
    }
    //  2. method - find all employees, join with roles and departments to display their roles, salaries, departments, and managers
    viewEmployees() {
        return this.connection.promise().query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(emp.first_name, ' ' , emp.last_name) AS manager
            FROM employee 
            LEFT JOIN role ON role.id = employee.role_id 
            LEFT JOIN department ON department.id = role.department_id
            LEFT JOIN employee AS emp ON emp.id = employee.manager_id`
        );
    } 
    //  3. method - create a new employee - takes employee object as input parameter
    addEmployee(employee) {
        return this.connection.query(
            `INSERT INTO employee SET ?`,
            employee
        );
    }
    //  4. method - update employee's role - takes employee id and role id as input parameters
    updateEmployeeRole(employeeId, roleId) {
        return this.connection.query(
            `UPDATE employee SET role_id = ${roleId} 
            WHERE id = ${employeeId}`
        );
    }
    //  5. method - find all roles - join with departments to diplay department names
    viewRoles() {
        return this.connection.query(
            `SELECT role.id, role.title, role.salary, department.name 
            FROM role 
            LEFT JOIN department ON role.department_id = department.id`
        );
    }
    //  6. method - create a new role - takes in role object as input parameter
    addRole(role) {
        return this.connection.query(
            `INSERT INTO role SET ?`,
            role
        );
    }
    //  7. method - find all departments
    viewDepartments() {
        return this.connection.promise().query(
            `SELECT department.id, department.name
            FROM department 
            LEFT JOIN role ON role.department_id = department.id 
            LEFT JOIN employee ON employee.role_id = role.id 
            GROUP BY department.id, department.name`
        );
    }
    //  8. method - create a new department - takes in department object as input parameter
    addDepartment(department) {
        return this.connection.query(
            `INSERT INTO department SET ?`,
            department
        );
    }
};

module.exports = new DB(connection);

// ================
// OPTIONAL METHODS
// ================

//  - method: Find all employees except the given employee id
//  - method: Find all employees in a given department, join with roles to display role titles
//  - method: Find all employees by manager, join with departments and roles to display titles and department names
//  - method: Find all departments, join with employees and roles and sum up utilized department budget
//  - method: Remove a department
//  - method: Remove a role from the db
//  - method: Update the given employee's manager
//  - method: Remove an employee with the given id

