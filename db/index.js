const connection = require("./connection");

// class for database or database access object
class DB {
    //  constructor function w/ instant variable
    constructor(connection) {
        this.connection = connection
    }
    //  method to find all employees using mysql commands
    viewEmployees() {
        return this.connection.promise().query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(emp.first_name, ' ' , emp.last_name) AS manager
            FROM employee 
            LEFT JOIN role ON role.id = employee.role_id 
            LEFT JOIN department ON department.id = role.department_id
            LEFT JOIN employee AS emp ON emp.id = employee.manager_id`
        );
    } 
    //  method to add new employees using mysql commands
    addEmployee(first_name, last_name, role_id, manager_id) {
        return this.connection.promise().query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ('${first_name}', '${last_name}', '${role_id}', '${manager_id}')`
        );
    }
    
    //  method to update employee roles using mysql commands
    updateEmployeeRole(employeeId, roleId) {
        return this.connection.promise().query(
            `UPDATE employee SET role_id = ${roleId} 
            WHERE id = ${employeeId}`
        );
    }
    //  method to find all roles using mysql commands
    viewRoles() {
        return this.connection.promise().query(
            `SELECT role.id, role.title, role.salary, department.name 
            FROM role 
            LEFT JOIN department ON role.department_id = department.id`
        );
    }
    //  method to add role using mysql commands
    addRole(title, salary, index) {
        return this.connection.promise().query(
            `INSERT INTO role (title, salary, department_id)
            VALUES ('${title}', '${salary}', '${index}')`
        );
    }
    //  method to find all departments using mysql commands
    viewDepartments() {
        return this.connection.promise().query(
            `SELECT department.id, department.name
            FROM department 
            LEFT JOIN role ON role.department_id = department.id 
            LEFT JOIN employee ON employee.role_id = role.id 
            GROUP BY department.id, department.name`
        );
    }
    //  method to add new department using mysql commands
    addDepartment(department) {
        return this.connection.query(
            `INSERT INTO department (name) VALUES ('${department}')`
        );
    }
};

// export
module.exports = new DB(connection);