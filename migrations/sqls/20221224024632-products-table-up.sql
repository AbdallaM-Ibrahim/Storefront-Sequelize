CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price REAL NOT NULL,
  category VARCHAR(255),
  PRIMARY KEY (id)
);