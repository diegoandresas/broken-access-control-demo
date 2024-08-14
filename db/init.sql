CREATE DATABASE demo_db;
USE demo_db;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    email VARCHAR(50)
);

INSERT INTO users (name, email) VALUES
('Juan Perez', 'juan.perez@example.com'),
('Maria Gomez', 'maria.gomez@example.com');
