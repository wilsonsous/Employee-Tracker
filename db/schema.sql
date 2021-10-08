DROP DATABASE IF EXISTS companySQL_db;
CREATE DATABASE companySQL_db;
USE companySQL_db;

CREATE TABLE department(
  id INTEGER AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  -- FOREIGN Key (department_id) REFERENCES department(id)
  INDEX dep_ind (department_id),
  CONSTRAINT fk_department
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE CASCADE
);

CREATE TABLE employee(
  id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    -- FOREIGN Key (role_id) REFERENCES role(id),
    INDEX role_ind (role_id),
  CONSTRAINT fk_role
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE CASCADE,
    -- FOREIGN Key (manager_id) REFERENCES employee(id)
    INDEX man_ind (manager_id),
  CONSTRAINT fk_manager
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL,
  PRIMARY KEY (id)
);