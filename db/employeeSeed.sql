USE companySQL_db;
INSERT INTO department (name) values ('General Managemnt'), ('HR'), ('Technology'), ('Marketing'), ('Sales'), ('Accounting');

INSERT INTO role (title, salary, department_id) values 
('Auto Mechanic', 200000, 1),
('Data Scientist', 150000, 1),
('Recruiter', 30000, 2),
('HR Generalist', 75000, 2),
('Product Manager', 110000, 1),
('Software Architect', 165000, 3),
('Software Engineer', 80000, 3),
('UX Designer', 55000, 4),
('Cyber Security', 50000, 4),
('Sales Director', 60000, 5),
('Jr. Sales Consultant', 30000, 5),
('Psychologist', 65000, 6),
('Bookkeeper', 15000, 6),
('Dental Assistant', 45000, 6);


INSERT INTO employee(first_name, last_name, role_id, manager_id) values 
('Jane', 'Doe', 1, null), 
('Tom', 'Ford', 2, 1), 
('Marcus', 'Fralish', 4, 2), 
('Keanu', 'Reeves', 5, 1), 
('Ryan', 'Reynolds', 12, 3), 
('Chris', 'Evans', 6, 4), 
('Tom', 'Holland', 11, 2)