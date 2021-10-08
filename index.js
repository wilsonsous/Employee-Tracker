const mysql = require('mysql');
const inquirer = require('inquirer');
// const express = require('express');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: '',
  database: 'companySQL_db',
});


const runSearch = () => {
  inquirer
  .prompt({
    name: "action",
    type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "List All Employees By Department",
          "List All Employees By Manager",
          "List All Roles",
          "List All Departments",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
          "Exit",
      ],
    })


    .then((answer) => {
      switch (answer.action) {
        case 'View All Employees':
          viewAllEmployees();
          break;

        case 'List All Employees By Department':
          viewAllEmployeesDepartment();
          break;

        case 'List All Employees By Manager':
          viewAllEmployeesManager();
          break;

        case 'List All Roles':
          viewAllRoles();
          break;

        case 'List All Departments':
          viewAllDepartments();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'Update Employee Role':
          updateEmployee();
          break;
        case 'Exit':
          exit();
          break;

      }
    });
};

function viewAllEmployees() {
    connection.query(
      "SELECT employee.first_name, employee.last_name, role.title, role.salary, concat(manager.first_name, ' ', manager.last_name) as manager FROM employee INNER JOIN role ON employee.role_id = role.id LEFT OUTER JOIN employee as manager on employee.manager_id = manager.id"//
      ,(err, data) => {
      if (err) throw err;
      console.log("HERE'S THE CURRENT EMPLOYEE DIRECTORY:");
      console.table(data);
      nextStep();
    });
  }
  
  function viewAllRoles() {
      connection.query("SELECT * FROM role", function (err, data) {
        if (err) throw err;
        console.log("HERE'S THE CURRENT ROLE DIRECTORY:");
        console.table(data);
        nextStep();
      });
    }
  
    function viewAllDepartments() {
      connection.query("SELECT * FROM department", function (err, data) {
        if (err) throw err;
        console.log("HERE'S THE CURRENT DEPARTMENT DIRECTORY:");
        console.table(data);
        nextStep();
      });
    }

function nextStep() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'Please select the following:',
      choices: ["Main Menu", "Exit"],
    })
    .then((answer) => {
        switch (answer.action) {
            case "Main Menu":
              runSearch();
              break;
    
            case "Exit":
              exit();
              break;
      }
    });
};

function viewAllEmployeesDepartment() {
    let query =
      "SELECT employee.id, employee.first_name, employee.last_name, department.name FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id";
    connection.query(query, function (err, data) {
      if (err) throw err;
      console.log("HERE'S THE CURRENT EMPLOYEE DIRECTORY BY DEPARTMENT:");
      console.table(data);
      nextStep();
    });
  }
  
  function viewAllEmployeesManager() {
    let query =
      "SELECT employee.id, concat(employee.first_name, ' ',employee.last_name) as 'Employee Name', concat(manager.first_name, ' ', manager.last_name) as 'Managers Name' FROM employee LEFT OUTER JOIN employee as manager on employee.manager_id = manager.id";
  
    connection.query(query, function (err, data) {
      if (err) throw err;
      console.log("HERE'S THE LISTING OF THE EMPLOYEES MANAGERS:");
      console.table(data);
      nextStep();
    });
  }
  
  function addDepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "Please enter the departments name?",
          name: "name",
        },
      ])
      .then((response) => {
        connection.query(
          "INSERT INTO department (name) values (?)",
          [response.name],
          (err, data) => {
            if (err) throw err;
            if (data.affectedRows > 0) {
              console.log("Department added successfully!");
            }
            nextStep();
          }
        );
      });
  }
  
  function addRole() {
    connection.query("Select id, name from department", (err, data) => {
      if (err) throw err;
      let departmentArray = data.map((department) => {
        return {
          name: department.name,
          value: department.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "input",
            message: "Please enter the role's title",
            name: "roleTitle",
          },
          {
            type: "number",
            message: "Please enter the role's salary",
            name: "salary",
          },
          {
            type: "list",
            message: "Please enter what department the role is in",
            name: "department",
            choices: departmentArray,
          },
        ])
        .then((response) => {
          connection.query(
            "INSERT INTO Role (title, salary, department_id) values (?,?,?)",
            [response.roleTitle, response.salary, response.department],
            (err, data) => {
              if (err) throw err;
              if (data.affectedRows > 0) {
                console.log("Role added successfully!");
              }
              nextStep();
            }
          );
        });
    });
  }
  
  function addEmployee() {
    connection.query("Select id, title from role", (err, data) => {
      if (err) throw err;
      const rolesArray = data.map((role) => {
        return { name: role.title, value: role.id };
      });
  
      connection.query(
        "Select id, first_name, last_name from employee",
        (err, data) => {
          if (err) throw err;
          let managersArray = data.map((employee) => {
            return {
              name: employee.first_name + " " + employee.last_name,
              value: employee.id,
            };
          });
          managersArray.push({ name: "none", value: null });
          inquirer
            .prompt([
              {
                type: "input",
                message: "Please enter employee's first name",
                name: "first_name",
              },
              {
                type: "input",
                message: "Please enter employee's last name",
                name: "last_name",
              },
              {
                type: "list",
                message: "Please enter employee's role",
                name: "role_id",
                choices: rolesArray,
              },
              {
                type: "list",
                message: "Please enter employee's manager",
                name: "manager_id",
                choices: managersArray,
              },
            ])
            .then((response) => {
              let managerID;
              if (response.manager_id !== null && response.manager_id !== "") {
                managerID = response.manager_id;
              } else {
                managerID = null;
              }
  
              connection.query(
                "INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)",
                [
                  response.first_name,
                  response.last_name,
                  response.role_id,
                  managerID,
                ],
                (err, data) => {
                  if (err) throw err;
                  if (data.affectedRows > 0) {
                    console.log("Employee added successfully!");
                  }
                  nextStep();
                }
              );
            });
        }
      );
    });
  }
  
  function updateEmployee() {
    connection.query(
      "Select id, first_name, last_name from employee",
      (err, data) => {
        if (err) throw err;
        let employeeArray = data.map((employee) => {
          return {
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
          };
        });
  
        connection.query("Select id, title from role", (err, data) => {
          if (err) throw err;
          const rolesArray = data.map((role) => {
            return { name: role.title, value: role.id };
          });
  
          inquirer
            .prompt([
              {
                type: "list",
                message: "Please select the employee to update",
                name: "employee_id",
                choices: employeeArray,
              },
              {
                type: "list",
                message: "Please select the new role for the employee",
                name: "role_id",
                choices: rolesArray,
              },
            ])
            .then((response) => {
              connection.query(
                "UPDATE employee set employee.role_id = ? WHERE employee.id = ?",
                [response.role_id, response.employee_id],
                (err, data) => {
                  if (err) throw err;
                  if (data.affectedRows > 0) {
                    console.log("Employee updated successfully!");
                  }
                  nextStep();
                }
              );
            });
        });
      }
    );
  }
  
  function exit() {
    connection.end();
  }
  
  connection.connect((err) => {
    if (err) throw err;
    console.log("MySQl connected...")
    console.log(`connected as id ${connection.threadId}`);
    runSearch();
  });