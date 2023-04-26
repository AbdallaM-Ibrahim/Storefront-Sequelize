CREATE TABLE order_products(
  order_id INT NOT NULL, 
  product_id INT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  PRIMARY KEY (order_id, product_id)
);