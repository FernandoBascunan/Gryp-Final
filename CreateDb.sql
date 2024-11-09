CREATE TABLE users (
    userID INT PRIMARY KEY,
    userName VARCHAR(50),
    region VARCHAR(50),
    commune VARCHAR(50),
    Phone VARCHAR(20),
    rut VARCHAR(9)
);

CREATE TABLE waiter (
    waiterID INT PRIMARY KEY,
    waiterName VARCHAR(50),
    wRut VARCHAR(9),
    wPhone VARCHAR(20)
);

CREATE TABLE workers (
    userID INT,
    waiterID INT,
    PRIMARY KEY (userID, waiterID),
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (waiterID) REFERENCES waiter(waiterID)
);

CREATE TABLE tables (
    tableID INT PRIMARY KEY,
    tableStatus BOOLEAN
);

CREATE TABLE orders (
    orderID INT PRIMARY KEY,
    waiterID INT,
    tableID INT,
    FOREIGN KEY (waiterID) REFERENCES waiter(waiterID),
    FOREIGN KEY (tableID) REFERENCES tables(tableID)
);

CREATE TABLE menu (
    menuID INT PRIMARY KEY,
    dishName VARCHAR(50),
    dishStatus BOOLEAN
);

CREATE TABLE orderContent (
    orderID INT,
    menuID INT,
    PRIMARY KEY (orderID, menuID),
    FOREIGN KEY (orderID) REFERENCES orders(orderID),
    FOREIGN KEY (menuID) REFERENCES menu(menuID)
);

CREATE TABLE storage (
    productID INT PRIMARY KEY,
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
    FOREIGN KEY (menuID) REFERENCES menu(menuID),
    FOREIGN KEY (productID) REFERENCES storage(productID)
);