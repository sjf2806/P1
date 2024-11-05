document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const itemsList = document.getElementById('items-list');
    const addItemButton = document.getElementById('add-item-button');

    const categoryIcons = {
        meats: 'meatsIcon.png',
        vegetables: 'vegetablesIcon.png',
        dairy: 'dairyIcon.png',
        fruits: 'fruitsIcon.png',
        frozen: 'frozenIcon.png'
    };

    function loadItemsFromLocalStorage() {
        const savedItems = JSON.parse(localStorage.getItem('yourStock')) || [];
        savedItems.forEach(item => addItemToDOM(item));
    }

    function saveItemsToLocalStorage() {
        const items = Array.from(document.querySelectorAll('#items-list .sub-item')).map(item => {
            return {
                category: item.getAttribute('data-category'),
                itemName: item.querySelector('p').textContent,
                quantity: parseInt(item.querySelector('.item-count').textContent),
                allergen: item.querySelector('.allergens') ? item.querySelector('.allergens').textContent.split(': ')[1] : ''
            };
        });
        localStorage.setItem('yourStock', JSON.stringify(items));
    }

    function addItemToDOM({ category, itemName, quantity, allergen }) {
        const newItem = document.createElement('div');
        newItem.classList.add('sub-item');
        newItem.setAttribute('data-category', category);

        const iconSrc = categoryIcons[category];
        const allergenText = allergen ? `<p class="allergens">Contains: ${allergen}</p>` : '';

        newItem.innerHTML = `
            <img src="${iconSrc}" alt="${category} icon" />
            <p>${itemName}</p>
            <button class="reduce-button">-</button>
            <span class="item-count">${quantity}</span>
            <button class="add-button">+</button>
            ${allergenText}
        `;

        itemsList.appendChild(newItem);
        const addButton = newItem.querySelector('.add-button');
        const reduceButton = newItem.querySelector('.reduce-button');
        const itemCount = newItem.querySelector('.item-count');

        addButton.addEventListener('click', () => {
            let count = parseInt(itemCount.textContent);
            itemCount.textContent = ++count;
            saveItemsToLocalStorage();
        });

        reduceButton.addEventListener('click', () => {
            let count = parseInt(itemCount.textContent);
            if (count > 1) {
                itemCount.textContent = --count;
            } else {
                newItem.remove();
            }
            saveItemsToLocalStorage();
        });
        saveItemsToLocalStorage();
    }

    addItemButton.addEventListener('click', () => {
        const category = document.getElementById('category-select').value;
        const itemName = document.getElementById('item-input').value.trim();
        const quantity = parseInt(document.getElementById('quantity-input').value, 10);
        const allergen = document.getElementById('allergen-select').value;

        if (itemName && quantity > 0) {
            if (allergen === 'peanuts') {
                const proceed = confirm("You or someone you're sharing your space with has a peanut allergy. Would you like to proceed?");
                if (!proceed) return;
            }

            const itemData = { category, itemName, quantity, allergen };
            addItemToDOM(itemData);

            document.getElementById('item-input').value = '';
            document.getElementById('quantity-input').value = '1';
            document.getElementById('allergen-select').value = '';
        } else {
            alert('Please enter a valid item name and quantity.');
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const allItems = document.querySelectorAll('#items-list .sub-item, #refrigerator-items-list .sub-item');
            allItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    loadItemsFromLocalStorage();
});
