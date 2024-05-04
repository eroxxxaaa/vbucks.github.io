$(document).ready(function() {
    $('#countryModal').modal('show');

    // Global variables to store currency and rate
    let globalCurrency = 'USD';
    let globalRate = 1;

    // Function to update prices based on country selection
    window.updatePrices = function() {
        var country = $('#countrySelect').val();

        switch(country) {
            case 'Armenia':
                globalCurrency = 'AMD';
                globalRate = 450; // Example rate: 1 USD = 450 AMD
                break;
            case 'Russia':
                globalCurrency = 'RUB';
                globalRate = 75; // Example rate: 1 USD = 75 RUB
                break;
            case 'USA':
            default:
                globalCurrency = 'USD';
                globalRate = 1;
                break;
        }

        // Update each item's price
        $('.card-text').each(function() {
            var usdPrice = parseFloat($(this).text().substring(1)); // Remove '$' and convert to number
            var localPrice = usdPrice * globalRate;
            $(this).text(`${localPrice.toFixed(2)} ${globalCurrency}`);
        });

        $('#countryModal').modal('hide');
    }

    // Retrieve basket items from sessionStorage if available
    let basketItems = sessionStorage.getItem('basketItems') ? JSON.parse(sessionStorage.getItem('basketItems')) : {};

    // Function to update basket items in the modal
    function updateBasketModal() {
        const basketItemsDiv = $("#basketItems");
        basketItemsDiv.empty(); // Clear previous items

        // Add each item in the basket to the modal
        Object.keys(basketItems).forEach(function(item) {
            basketItemsDiv.append(`<p>${item} (${basketItems[item]})</p>`);
        });
    }

    // Update basket modal on document ready
    updateBasketModal();

    // Function to update the basket dropdown
    function updateBasketDropdown() {
        const basketDropdown = $("#basketDropdown");
        basketDropdown.empty(); // Clear previous items

        // Add each item in the basket to the dropdown
        Object.keys(basketItems).forEach(function(item) {
            basketDropdown.append(`<a class="dropdown-item" href="#">${item} (${basketItems[item]})</a>`);
        });

        // Add a clear button if there are items in the basket
        if (Object.keys(basketItems).length > 0) {
            basketDropdown.append(`<div class="dropdown-divider"></div>`);
            basketDropdown.append(`<a class="dropdown-item clear-basket" href="#">Clear Basket</a>`);
        }
    }

    // Function to add an item to the basket with quantity
    function addItemToBasket(item) {
        if (basketItems[item]) {
            basketItems[item]++;
        } else {
            basketItems[item] = 1;
        }
        // Save basket items to sessionStorage
        sessionStorage.setItem('basketItems', JSON.stringify(basketItems));

        // Update basket dropdown and modal
        updateBasketDropdown();
        updateBasketModal();
    }

    // Handle item button click to add item to the basket
    $(".item-btn").click(function() {
        var itemName = $(this).data("item");
        addItemToBasket(itemName); // Add item to basket
    });

    // Handle clear basket button click
    $(".clear-basket").click(function() {
        basketItems = {}; // Clear basket
        sessionStorage.removeItem('basketItems'); // Remove basket items from sessionStorage
        updateBasketDropdown(); // Update basket dropdown
        updateBasketModal(); // Update basket modal
    });

     function sendOrderMessage(message) {
        const webhookUrl = "https://discord.com/api/webhooks/1235604187933315213/uhfR9jK7yYaiKuUXe0_NOprTcVSmdqufnkAtykNE_DgAQ6KRbyUjnB6GO0P0EfTiovYq"; // Replace this with your Discord webhook URL

        // Send the message to Discord using webhook
        return fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: message }),
        });
    }

    // Handle form submission
    $("#sendOrderBtn").click(function() {
        let message = "\n\nOrder Details:\n"; // Initial message
        let fullName = $("#fullName").val(); // Retrieve the value of the Full Name field
        message += `Full Name: ${fullName}\n`;

        // Calculate total price and add items to the message
        let totalPrice = 0;
        Object.keys(basketItems).forEach(function(item) {
            let itemPrice = getItemPrice(item) * globalRate;
            let quantity = basketItems[item];
            totalPrice += quantity * itemPrice;
            message += `${item}: ${quantity} x ${itemPrice.toFixed(2)} ${globalCurrency}\n`;
        });

        // Add total price to the message
        message += `Total Price: ${totalPrice.toFixed(2)} ${globalCurrency}\n`;
        message += "\nContact Information:\n";
        message += $("#phoneNumber").val();
        // Send order message with retry mechanism
        sendOrderWithRetry(message);
    });

    // Function to send order message with retry mechanism
    function sendOrderWithRetry(message, attempts = 3, delay = 1000) {
        function attemptSend() {
            sendOrderMessage(message)
                .then(response => {
                    if (response.ok) {
                        alert("Order successfully sent!");
                        // Clear the basket and update the dropdown
                        basketItems = {};
                        updateBasketDropdown();
                        // Close the modal
                        $("#contactInfoModal").modal("hide");
                        $("#fullName, #phoneNumber").val(""); // Clear contact information fields
                        $("#confirmationModal").modal("show");
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .catch(error => {
                    console.error('Error sending order:', error);
                    attempts--;
                    if (attempts > 0) {
                        setTimeout(attemptSend, delay);
                    } else {
                        alert("Failed to send order. Please try again later.");
                    }
                });
        }

        attemptSend();
    }

    // Function to get the price of an item
    function getItemPrice(item) {
        switch (item) {
            case "1000 V-Bucks":
                return 6;
            case "2800 V-Bucks":
                return 15;
            case "5000 V-Bucks":
                return 21;
            case "13500 V-Bucks":
                return 50;
            default:
                return 0;
        }
    }

    // Handle clear basket button click
    $("#basketDropdown").on("click", ".clear-basket", function() {
        basketItems = {}; // Clear basket
        sessionStorage.removeItem('basketItems'); // Remove basket items from sessionStorage
        updateBasketDropdown(); // Update basket dropdown
    });

    // Load basket items on page load
    updateBasketDropdown();
});
