document.getElementById("addRoomsForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get the form data
    var formData = {
        location: document.getElementById("location").value,
        availableRooms: document.getElementById("availableRooms").value,
        price: document.getElementById("price").value
    };
    // Make a POST request to the API
    fetch('http://localhost:8022/api/v1/add/rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Handle the API response
            alert("Rooms added successfully.");
            // Reset the form
            document.getElementById("addRoomsForm").reset();
        })
        .catch(error => {
            console.error(error);
            alert("Failed to add rooms. Please try again.");
        });
});

var sideMenuLinks = document.getElementsByClassName("sidenav")[0].getElementsByTagName("a");
var menuContentContainers = document.getElementsByClassName("menu-content");

var addRoomsLink = document.getElementById("addRoomsLink");
var addRoomId = document.getElementById("addRoomId");
var getRoomDetailId = document.getElementById("getRoomDetailId");
var getBookingDetailId = document.getElementById("getBookingDetailId");
addRoomsLink.classList.add("active");

getRoomDetailId.style.display = "none";
getBookingDetailId.style.display = "none";

// Add click event listener to each link
for (var i = 0; i < sideMenuLinks.length; i++) {
    sideMenuLinks[i].addEventListener("click", function () {
        // Remove active class from all links
        for (var j = 0; j < sideMenuLinks.length; j++) {
            sideMenuLinks[j].classList.remove("active");
        }

        // Add active class to the clicked link
        this.classList.add("active");

        for (var k = 0; k < menuContentContainers.length; k++) {
            menuContentContainers[k].style.display = "none";
          }
      
          if (this.id === "getRoomsLink") {
            fetchRoomsData();
            getRoomDetailId.style.display = "block";
            addRoomId.style.display = "none";
            getBookingDetailId.style.display = "none"; 
          }
          if (this.id === "bookingDetailsLink") {
            fetchBookingDetails();
            getBookingDetailId.style.display = "block";
            getRoomDetailId.style.display = "none";
            addRoomId.style.display = "none"; 
          }
          if (this.id === "addRoomsLink") {
            addRoomId.style.display = "block";
            getRoomDetailId.style.display = "none";
            getBookingDetailId.style.display = "none";  
          }
    });
}

function fetchRoomsData() {
    // Make the API call to retrieve the room details
    fetch("http://localhost:8022/api/v1/get/roomsDetail")
        .then(response => response.json())
        .then(data => {
            // Get the table body element
            var roomTableBody = document.getElementById("roomTableBody");

            // Clear the table body
            roomTableBody.innerHTML = "";

            // Iterate over the room details and add rows to the table
            data.forEach(room => {
                var row = roomTableBody.insertRow();
                var locationCell = row.insertCell(0);
                var availableRoomsCell = row.insertCell(1);
                var priceCell = row.insertCell(2);

                locationCell.innerText = room.location;
                availableRoomsCell.innerText = room.availableRooms;
                priceCell.innerText = room.price;
            });

            // Show the table
            var roomTable = document.getElementById("roomTable");
            roomTable.style.display = "table";
        })
        .catch(error => console.log(error));
}

function fetchBookingDetails() {
    // Make the API call to retrieve the booking details
    fetch("http://localhost:8022/api/v1/get/bookingDetail")
        .then(response => response.json())
        .then(data => {
            // Get the table body element
            var bookingTableBody = document.getElementById("bookingTableBody");

            // Clear the table body
            bookingTableBody.innerHTML = "";

            // Iterate over the booking details and add rows to the table
            data.forEach(booking => {
                var row = bookingTableBody.insertRow();
                var bookingId = row.insertCell(0);
                var nameCell = row.insertCell(1);
                var emailCell = row.insertCell(2);
                var phoneCell = row.insertCell(3);
                var locationCell = row.insertCell(4);
                var roomsBookedCell = row.insertCell(5);
                var amountCell = row.insertCell(6);
                var fromDateCell = row.insertCell(7);
                var toDateCell = row.insertCell(8);
                var adultsCell = row.insertCell(9);
                var childrenCell = row.insertCell(10);

                bookingId.innerText = booking.bookingId;
                nameCell.innerText = booking.name;
                emailCell.innerText = booking.emailId;
                phoneCell.innerText = booking.phoneNumber;
                locationCell.innerText = booking.location;
                roomsBookedCell.innerText = booking.roomsBooked;
                amountCell.innerText = booking.totalAmount;
                fromDateCell.innerText = booking.fromDate;
                toDateCell.innerText = booking.toDate;
                adultsCell.innerText = booking.adultCount;
                childrenCell.innerText = booking.childCount;
            });

            // Show the table
            var bookingTable = document.getElementById("bookingTable");
            bookingTable.style.display = "table";
        })
        .catch(error => console.log(error));
}

function searchBooking() {
    var searchInput = document.getElementById("searchBookingId").value.toLowerCase();
    var bookingTableBody = document.getElementById("bookingTableBody");
    var rows = bookingTableBody.getElementsByTagName("tr");
    
    for (var i = 0; i < rows.length; i++) {
        var bookingId = rows[i].getElementsByTagName("td")[0].innerText.toLowerCase();
        
        if (bookingId.includes(searchInput)) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}