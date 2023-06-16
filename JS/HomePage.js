function handleHomeTab() {
    // Hide/show corresponding content here
    document.getElementById('home').style.display = 'block';
    document.getElementById('booking').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
}

function handleBookingTab() {
    // Hide/show corresponding content here
    document.getElementById('home').style.display = 'none';
    document.getElementById('booking').style.display = 'block';
    document.getElementById('contact').style.display = 'none';
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('from-date').setAttribute('min', currentDate);
    document.getElementById('to-date').setAttribute('min', currentDate);
}


function handleContactTab() {
    // Hide/show corresponding content here
    document.getElementById('home').style.display = 'none';
    document.getElementById('booking').style.display = 'none';
    document.getElementById('contact').style.display = 'block';
}

document.querySelector('.tab-link[data-tab="home"]').click();

function getRoomDetails() {
    const fromDateInput = document.getElementById('from-date');
    const toDateInput = document.getElementById('to-date');
    const errorMessage = document.getElementById('error-message');
    if (!fromDateInput.value || !toDateInput.value) {
        errorMessage.textContent = "Please select the Date.";
        errorMessage.style.display = "block";
        errorMessage.style.color = "Red"
    } else if (fromDateInput.value > toDateInput.value) {
        errorMessage.textContent = "From date cannot be greater than To date.";
        errorMessage.style.display = "block";
        errorMessage.style.color = "Red"
    } else {
        errorMessage.textContent = "";
        var cardContainer = document.getElementById("card-container");

        // Clear the old card container
        cardContainer.innerHTML = "";

        var fromDate = document.getElementById("from-date").value;
        var toDate = document.getElementById("to-date").value;
        var location = document.getElementById("location").value;

        // Make the API call with the fromDate, toDate, and location
        var apiUrl = "http://localhost:8022/api/v1/get/rooms?fromDate=" + encodeURIComponent(fromDate) +
            "&toDate=" + encodeURIComponent(toDate) +
            "&location=" + encodeURIComponent(location);

        // Perform further actions with the API response
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const errorContainer = document.getElementById('error-container');

                // Check if data.length is 0
                if (data.length === 0) {
                    // Create error message element
                    const errorMessage = document.createElement('p');
                    errorMessage.textContent = 'No Rooms available for the selected date';
                    errorMessage.classList.add('error-message'); // Add CSS class for styling

                    // Clear any existing error messages
                    errorContainer.innerHTML = '';

                    // Append the error message to the error container
                    errorContainer.appendChild(errorMessage);
                } else {
                    // Clear the error container if there are available rooms
                    errorContainer.innerHTML = '';
                    setCardValue(data);
                }
            })
            .catch(function (error) {
                console.log("An error occurred:", error);
            });
    }
}
function getRooms() {
    fetch('http://localhost:8022/api/v1/get/rooms')
        .then(response => response.json())
        .then(data => {
            setCardValue(data);
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}

function setCardValue(data) {
    var cardContainer = document.getElementById("card-container");
    const fromDateInput = document.getElementById('from-date');
    const toDateInput = document.getElementById('to-date');
    data.forEach(function (item) {
        // Create the card element
        var card = document.createElement("div");
        card.className = "card";

        // Set the card content
        var location = document.createElement("p");
        location.textContent = "Location: " + item.location;

        var availableRooms = document.createElement("p");
        availableRooms.textContent = "Available Rooms: " + item.availableRooms;

        var price = document.createElement("p");
        price.textContent = "Price: \u20B9" + item.price + "/day";

        var bookButton = document.createElement("button");
        bookButton.textContent = "Book Now \u2192";

        bookButton.addEventListener("click", function () {
            // Perform the desired action when the button is clicked
            localStorage.setItem("location", item.location);
            localStorage.setItem("rooms", item.availableRooms);
            localStorage.setItem("price", item.price);
            localStorage.setItem("fromDateInput", fromDateInput.value);
            localStorage.setItem("toDateInput", toDateInput.value);
            window.location.href = "Booking.html"; // Replace with the desired URL
        });

        // Append the elements to the card
        card.appendChild(location);
        card.appendChild(availableRooms);
        card.appendChild(price);
        card.appendChild(bookButton);

        // Append the card to the card container
        cardContainer.appendChild(card);
    });
}
