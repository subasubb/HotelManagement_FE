const place = localStorage.getItem("location");
const availableRooms = localStorage.getItem("rooms");
const price = localStorage.getItem("price");
const errorMessage = document.getElementById('error-message');
const infoMessage = document.getElementById('info-message');

const fromDateInput = document.getElementById('from-date');
const toDateInput = document.getElementById('to-date');
const numRoomsInput = document.getElementById('num-rooms');
const numAdult = document.getElementById('num-adult');
const numChild = document.getElementById('num-child');
const roomRentElement = document.getElementById('room-rent');
const gstElement = document.getElementById('gst');
const totalRoomRent = document.getElementById('tb-total-room-rent');
const discount = document.getElementById('tb-discount');
const totalElement = document.getElementById('tb-total');

const confirmBookingBtn = document.getElementById('confirm-booking-btn');

document.addEventListener("DOMContentLoaded", function () {

    // Set the values in the card
    document.getElementById("location").textContent = "Location: " + place;
    document.getElementById("available-rooms").textContent = "Available Rooms: " + availableRooms;
    document.getElementById("price").textContent = "Price: \u20B9" + price + "/day (Excluding GST)";
    const currentDate = new Date().toISOString().split('T')[0];
    fromDateInput.setAttribute('min', currentDate);
    toDateInput.setAttribute('min', currentDate);
    fromDateInput.value = localStorage.fromDateInput;
    toDateInput.value = localStorage.toDateInput
});


function calculateTotalRoomRent() {

    // Get the values from the input fields and checkboxes
    const fromDate = new Date(fromDateInput.value);
    const toDate = new Date(toDateInput.value);
    const numRooms = Number(numRoomsInput.value);
    const adultValue = Number(numAdult.value);
    const childValue = Number(numChild.value);
    var checkFlag = false;
    var discountAmout = 0;

    if (!fromDateInput.value || !toDateInput.value || !adultValue || (!childValue && childValue !== 0) || !numRooms) {
        errorMessage.textContent = "All fields are mandatory.";
        errorMessage.style.display = "block";
        errorMessage.style.color = "Red"
        checkFlag = true;
    } else if (fromDate > toDate) {
        errorMessage.textContent = "From date cannot be greater than To date.";
        errorMessage.style.display = "block";
        errorMessage.style.color = "Red"
        checkFlag = true;
    } else {
        errorMessage.textContent = "";
    }

    // Calculate the number of days
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const diffDays = Math.round(Math.abs((fromDate - toDate) / oneDay));

    // Calculate the total room rent
    const roomRent = price * diffDays * numRooms;

    // Calculate the GST
    const gst = roomRent * 0.18; // Assuming 18% GST

    const totalRoomRentValue = roomRent + gst;

    if(diffDays > 10 && diffDays < 20){
        discountAmout = totalRoomRentValue * 0.20
        infoMessage.textContent = "Since you have booked for " + diffDays +" days, we have given 20% Discount";
        infoMessage.style.display = "block";
        infoMessage.style.color = "Green";
    } else if(diffDays > 20 && diffDays < 30){
        discountAmout = totalRoomRentValue * 0.30
        infoMessage.textContent = "Since you have booked for " + diffDays +" days, we have given 30% Discount";
        infoMessage.style.display = "block";
        infoMessage.style.color = "Green";
    } else if(diffDays > 30 ) {
        discountAmout = totalRoomRentValue * 0.40
        infoMessage.textContent = "Since you have booked for " + diffDays +" days, we have given 40% Discount";
        infoMessage.style.display = "block";
        infoMessage.style.color = "Green";
    } else {
        infoMessage.textContent = "No discount is applied, Since you booked below 10 days";
        infoMessage.style.display = "block";
        infoMessage.style.color = "Green";
    }

    var finalPrice = totalRoomRentValue - discountAmout;
    // Set the calculated values in the table
    roomRentElement.textContent = roomRent;
    gstElement.textContent = gst;
    totalRoomRent.textContent = totalRoomRentValue;
    discount.textContent = Math.round(discountAmout);
    totalElement.textContent = Math.round(finalPrice);

    if (checkFlag !== true) {
        confirmBookingBtn.style.backgroundColor = '#4CAF50';
        confirmBookingBtn.style.pointerEvents = 'fill'
    }
    localStorage.setItem("fromDateInput", fromDate);
    localStorage.setItem("toDateInput", toDate);
    localStorage.setItem("totalAmount", finalPrice);
    localStorage.setItem("roomsBooked", numRooms);
    localStorage.setItem("adult", adultValue);
    localStorage.setItem("child", childValue);
}

var backBtn = document.getElementById('back-button');
backBtn.addEventListener('click', function () {
    window.location.href = 'Homepage.html';
});



confirmBookingBtn.addEventListener('click', function() {
  window.location.href = 'ConfirmBooking.html';
});

function validatingRoom() {
    const numRoomsInput = document.getElementById('num-rooms');
    const numAdultsInput = document.getElementById('num-adult');
    const numChildrenInput = document.getElementById('num-child');

    var adultCount = parseInt(numAdultsInput.value) + parseInt(numChildrenInput.value / 2);
    var expectedRoom = adultCount / 3;

    if (expectedRoom > parseInt(numRoomsInput.value)) {
        errorMessage.textContent = "Maximum of 3 Adults are allowed per Room. You have to select " + (parseInt(expectedRoom)+1) + " Rooms";
        errorMessage.style.display = "block";
        errorMessage.style.color = "Red"
    } else if (Math.round(numRoomsInput.value) > Math.round(availableRooms)) {
        errorMessage.textContent = "Required room is greater than available Room.";
        errorMessage.style.display = "block";
        errorMessage.style.color = "Red"
    } else {
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
    }

}