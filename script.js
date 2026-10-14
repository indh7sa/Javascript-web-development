
let inventory = [
    { id: 1, name: "Laptop", price: 800 },
    { id: 2, name: "Mouse", price: 25 },
    { id: 3, name: "Monitor", price: 150 }
];

let nextId = 4;

const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const priceFilter = document.getElementById("priceFilter");
const message = document.getElementById("message");

// Assign category based on price
function getCategory(price) {
    if (price < 50) {
        return "Budget";
    } else if (price < 200) {
        return "Standard";
    } else {
        return "Premium";
    }
}

// Calculate total inventory value
const calculateTotal = (products) => {
    let total = 0;

    products.forEach(product => {
        total += product.price;
    });

    return total;
};

// Update dashboard statistics
function updateStatistics() {
    document.getElementById("totalProducts").textContent =
        inventory.length;

    document.getElementById("totalValue").textContent =
        "$" + calculateTotal(inventory).toFixed(2);

    const affordable = inventory.filter(
        product => product.price < 200
    );

    document.getElementById("affordableCount").textContent =
        affordable.length;
}

// Display products in the table
function displayProducts() {
    productList.innerHTML = "";

    let filteredProducts = inventory;

    if (priceFilter.value === "affordable") {
        filteredProducts = inventory.filter(
            product => product.price < 200
        );
    } else if (priceFilter.value === "premium") {
        filteredProducts = inventory.filter(
            product => product.price >= 200
        );
    }

    filteredProducts.forEach(product => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;

        const priceCell = document.createElement("td");
        priceCell.textContent = "$" + product.price.toFixed(2);

        const categoryCell = document.createElement("td");
        categoryCell.textContent = getCategory(product.price);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function () {
            inventory = inventory.filter(
                item => item.id !== product.id
            );

            updateDashboard();
            message.textContent = "Product deleted successfully.";
        });

        actionCell.appendChild(deleteButton);

        row.append(nameCell, priceCell, categoryCell, actionCell);
        productList.appendChild(row);
    });

    // Generate formatted report using map()
    const reports = filteredProducts.map(
        product =>
            `${product.name.toUpperCase()}: $${product.price.toFixed(2)}`
    );

    const reportList = document.getElementById("reportList");
    reportList.innerHTML = "";

    reports.forEach(report => {
        const item = document.createElement("li");
        item.textContent = report;
        reportList.appendChild(item);
    });
}

// Refresh the entire dashboard
function updateDashboard() {
    updateStatistics();
    displayProducts();
}

// Handle new product submission
productForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("productName");
    const priceInput = document.getElementById("productPrice");

    const name = nameInput.value.trim();
    const price = Number(priceInput.value);

    if (name === "") {
        message.textContent = "Please enter a product name.";
        return;
    }

    if (!Number.isFinite(price) || price <= 0) {
        message.textContent = "Enter a valid price greater than zero.";
        return;
    }

    inventory.push({
        id: nextId++,
        name: name,
        price: price
    });

    productForm.reset();
    message.textContent = "Product added successfully!";

    updateDashboard();
});

priceFilter.addEventListener("change", displayProducts);

// Initial dashboard display
updateDashboard();
