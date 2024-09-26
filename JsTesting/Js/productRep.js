
const productList = document.getElementById('products');
let allProducts = [];
let filteredProducts = [];
let currentSort = '';
const baseUrl = "https://dummyjson.com/products";
const baseCategoryUrl = "https://api.escuelajs.co/api/v1/categories";

function fetchProducts() {
    $.getJSON(baseUrl, function (json) {
        allProducts = json.products;
        filteredProducts = [...allProducts]; 
        console.log(allProducts);
        displayProducts(filteredProducts);  
    });
}
function displayProducts(products) {
    productList.innerHTML = '';

    $.each(products, function(index, product) {
        addProduct(product);
    });
}
function addProduct(product){
    const productDiv = document.createElement('div');
    productDiv.classList.add('card');
    productDiv.innerHTML = `
        
        <img src="${product.images[0]}" alt="${product.name}" class="imgBx">
        <div class="contentBx">
        <h2 >${product.title}</h2>
            <p class="content__text">Ціна: $${product.price}</p>
            <p class="content__text">${product.category}</p>
            <p class="content__text">${product.description}</p>
        </div>
    `;
    productList.appendChild(productDiv);
}

function filterProducts(searchText) {
    searchText = searchText.toLowerCase();

    filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchText)
    );

    if (currentSort) {
        sortProducts(currentSort);
    } else {
        displayProducts(filteredProducts);
    }
}

function filterByCategory(category) {
    if (category === 'all') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }
    displayProducts(filteredProducts);
}

function fetchCategories() {
    $.getJSON(baseCategoryUrl, function (categories) {
        const categoryDropdown = $('#category-filter');
        categories.forEach(category => {
            categoryDropdown.append(`<option value="${category.name}">${category.name}</option>`);
        });
    });
}
function sortProducts(criteria) {
    currentSort = criteria;
    let sortedProducts = [...filteredProducts];  

    switch (criteria) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            break;
    }

    displayProducts(sortedProducts);  
}

$('#sort').on('change', function() {
    const selectedSort = $(this).val();  
    sortProducts(selectedSort);
});
$('#search').on('input', function() {
    const searchText = $(this).val();
    filterProducts(searchText);
});
$('#category-filter').on('change', function() {
    const selectedCategory = $(this).val();
    filterByCategory(selectedCategory);
});
fetchProducts();
fetchCategories();
