INSERT INTO users (userName, rut, email, phone, region, commune, password)
VALUES ('John Doe', '12345678-9', 'johndoe@example.com', '+56912345678', 'Santiago', 'Santiago Centro', 'password123');


INSERT INTO waiter (waiterName, wRut, wPhone) VALUES
('Waiter 1', '11111111-1', '+56911111111'),
('Waiter 2', '22222222-2', '+56922222222'),
('Waiter 3', '33333333-3', '+56933333333'),
('Waiter 4', '44444444-4', '+56944444444'),
('Waiter 5', '55555555-5', '+56955555555'),
('Waiter 6', '66666666-6', '+56966666666'),
('Waiter 7', '77777777-7', '+56977777777'),
('Waiter 8', '88888888-8', '+56988888888'),
('Waiter 9', '99999999-9', '+56999999999'),
('Waiter 10', '12345678-0', '+56912340000'),
('Waiter 11', '98765432-1', '+56998760000'),
('Waiter 12', '87654321-2', '+56987650000'),
('Waiter 13', '76543210-3', '+56976540000'),
('Waiter 14', '65432109-4', '+56965430000'),
('Waiter 15', '54321098-5', '+56954320000'),
('Waiter 16', '43210987-6', '+56943210000'),
('Waiter 17', '32109876-7', '+56932100000'),
('Waiter 18', '21098765-8', '+56921090000'),
('Waiter 19', '10987654-9', '+56910980000'),
('Waiter 20', '09876543-0', '+56909870000');

INSERT INTO workers (userID, waiterID) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
(1, 11), (1, 12), (1, 13), (1, 14), (1, 15),
(1, 16), (1, 17), (1, 18), (1, 19), (1, 20);


INSERT INTO tables (tableStatus, userID) VALUES
(TRUE, 1), (FALSE, 1), (TRUE, 1), (FALSE, 1), (TRUE, 1),
(FALSE, 1), (TRUE, 1), (FALSE, 1), (TRUE, 1), (FALSE, 1),
(TRUE, 1), (FALSE, 1), (TRUE, 1), (FALSE, 1), (TRUE, 1),
(FALSE, 1), (TRUE, 1), (FALSE, 1), (TRUE, 1), (FALSE, 1);

INSERT INTO orders (waiterID, tableID, userID) VALUES
(1, 1, 1), (2, 2, 1), (3, 3, 1), (4, 4, 1), (5, 5, 1),
(6, 6, 1), (7, 7, 1), (8, 8, 1), (9, 9, 1), (10, 10, 1),
(11, 11, 1), (12, 12, 1), (13, 13, 1), (14, 14, 1), (15, 15, 1),
(16, 16, 1), (17, 17, 1), (18, 18, 1), (19, 19, 1), (20, 20, 1);

INSERT INTO menu (dishName, dishStatus, userID) VALUES
('Dish 1', TRUE, 1), ('Dish 2', FALSE, 1), ('Dish 3', TRUE, 1),
('Dish 4', FALSE, 1), ('Dish 5', TRUE, 1), ('Dish 6', FALSE, 1),
('Dish 7', TRUE, 1), ('Dish 8', FALSE, 1), ('Dish 9', TRUE, 1),
('Dish 10', FALSE, 1), ('Dish 11', TRUE, 1), ('Dish 12', FALSE, 1),
('Dish 13', TRUE, 1), ('Dish 14', FALSE, 1), ('Dish 15', TRUE, 1),
('Dish 16', FALSE, 1), ('Dish 17', TRUE, 1), ('Dish 18', FALSE, 1),
('Dish 19', TRUE, 1), ('Dish 20', FALSE, 1);

INSERT INTO orderContent (orderID, menuID, userID) VALUES
(1, 1, 1), (2, 2, 1), (3, 3, 1), (4, 4, 1), (5, 5, 1),
(6, 6, 1), (7, 7, 1), (8, 8, 1), (9, 9, 1), (10, 10, 1),
(11, 11, 1), (12, 12, 1), (13, 13, 1), (14, 14, 1), (15, 15, 1),
(16, 16, 1), (17, 17, 1), (18, 18, 1), (19, 19, 1), (20, 20, 1);

INSERT INTO storage (productType, loc, productName, amount, unit, userID) VALUES
('Food', 'Pantry', 'Rice', 50, 'kg', 1),
('Drink', 'Fridge', 'Soda', 30, 'l', 1),
('Food', 'Freezer', 'Meat', 20, 'kg', 1),
('Drink', 'Pantry', 'Water', 100, 'l', 1),
('Food', 'Pantry', 'Pasta', 40, 'kg', 1),
('Drink', 'Fridge', 'Juice', 25, 'l', 1),
('Food', 'Freezer', 'Chicken', 15, 'kg', 1),
('Food', 'Pantry', 'Beans', 60, 'kg', 1),
('Food', 'Freezer', 'Fish', 12, 'kg', 1),
('Drink', 'Fridge', 'Beer', 50, 'l', 1),
('Drink', 'Pantry', 'Wine', 20, 'l', 1),
('Food', 'Pantry', 'Flour', 80, 'kg', 1),
('Drink', 'Fridge', 'Milk', 40, 'l', 1),
('Food', 'Freezer', 'Vegetables', 30, 'kg', 1),
('Food', 'Pantry', 'Sugar', 70, 'kg', 1),
('Food', 'Freezer', 'Ice Cream', 20, 'kg', 1),
('Drink', 'Fridge', 'Energy Drink', 15, 'l', 1),
('Food', 'Pantry', 'Salt', 25, 'kg', 1),
('Drink', 'Fridge', 'Tea', 10, 'l', 1),
('Food', 'Pantry', 'Coffee', 5, 'kg', 1);


INSERT INTO recipe (menuID, productID) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 6), (7, 7), (8, 8), (9, 9), (10, 10),
(11, 11), (12, 12), (13, 13), (14, 14), (15, 15),
(16, 16), (17, 17), (18, 18), (19, 19), (20, 20);