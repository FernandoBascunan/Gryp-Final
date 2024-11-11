CREATE TABLE users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50),
    rut VARCHAR(50),
    email VARCHAR(50),
    phone VARCHAR(50),
    region VARCHAR(50),
    commune VARCHAR(50),
    password VARCHAR(50)
);

CREATE TABLE waiter (
    waiterID INT AUTO_INCREMENT PRIMARY KEY,
    waiterName VARCHAR(50),
    wRut VARCHAR(9),
    wPhone VARCHAR(20)
);

CREATE TABLE workers (
    userID INT,
    waiterID INT,
    PRIMARY KEY (userID, waiterID),
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    FOREIGN KEY (waiterID) REFERENCES waiter(waiterID) ON DELETE CASCADE
);

CREATE TABLE tables (
    tableID INT AUTO_INCREMENT PRIMARY KEY,
    tableStatus BOOLEAN
);

CREATE TABLE orders (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    waiterID INT,
    tableID INT,
    FOREIGN KEY (waiterID) REFERENCES waiter(waiterID) ON DELETE SET NULL,
    FOREIGN KEY (tableID) REFERENCES tables(tableID) ON DELETE SET NULL
);

CREATE TABLE menu (
    menuID INT AUTO_INCREMENT PRIMARY KEY,
    dishName VARCHAR(50),
    dishStatus BOOLEAN
);

CREATE TABLE orderContent (
    orderID INT,
    menuID INT,
    PRIMARY KEY (orderID, menuID),
    FOREIGN KEY (orderID) REFERENCES orders(orderID) ON DELETE CASCADE,
    FOREIGN KEY (menuID) REFERENCES menu(menuID) ON DELETE CASCADE
);

CREATE TABLE storage (
    productID INT AUTO_INCREMENT PRIMARY KEY,
    productType VARCHAR(50),
    loc VARCHAR(50),
    productName VARCHAR(50),
    amount BIGINT,
    unit VARCHAR(3)
);

CREATE TABLE recipe (
    menuID INT,
    productID INT,
    PRIMARY KEY (menuID, productID),
    FOREIGN KEY (menuID) REFERENCES menu(menuID) ON DELETE CASCADE,
    FOREIGN KEY (productID) REFERENCES storage(productID) ON DELETE CASCADE
);
