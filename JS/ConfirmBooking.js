const fromDate = new Date(localStorage.fromDateInput);
const fromDateInput = fromDate.toISOString().split("T")[0];

const toDate = new Date(localStorage.toDateInput);
const toDateInput = toDate.toISOString().split("T")[0];

// Display booking details in the preview section
const bookingPreview = document.getElementById('booking-preview');
bookingPreview.innerHTML = `
    <h2>Booking Details:</h2>
    <p><span>Location:</span> ${localStorage.location} </p>
    <p><span>No of Rooms Booked:</span> ${localStorage.roomsBooked}</p>
    <p><span>Total Amount: </span>\u20B9${localStorage.totalAmount}</p>
    <p><span>From Date:</span> ${fromDateInput}</p>
    <p><span>To Date:</span> ${toDateInput}</p>
    <p><span>Number of Adults:</span> ${localStorage.adult}</p>
    <p><span>Number of Children:</span> ${localStorage.child}</p>
`;

// Handle Cancel Booking button click
const cancelBookingBtn = document.getElementById('cancel-booking-btn');
cancelBookingBtn.addEventListener('click', () => {
    // Redirect to Homepage.html
    window.location.href = 'Homepage.html';
});

// Handle Confirm Booking button click
const confirmBookingBtn = document.getElementById('confirm-booking-btn');
confirmBookingBtn.addEventListener('click', async () => {
    const name = document.getElementById('name').value;
    const emailId = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phone').value;
    const idType = document.getElementById('id-type').value;
    const idNumber = document.getElementById('id-number').value;
    const age = document.getElementById('age').value;
    const dob = document.getElementById('dob').value;
    // Add other field values as needed

    // Create the request body object
    const requestBody = {
        name,
        emailId,
        phoneNumber,
        dob,
        age,
        idType,
        idNumber,
        location: localStorage.location,
        fromDate: fromDateInput,
        toDate: toDateInput,
        adultCount: localStorage.adult,
        childCount: localStorage.child,
        roomsBooked: localStorage.roomsBooked,
        totalAmount: localStorage.totalAmount
    };

    try {
        // Send the POST request to the API
        const response = await fetch('http://localhost:8022/api/v1/post/confirmBooking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // Check if the response is successful
        if (response.ok) {
            const data = await response.json();
            // Check if the response data is not null
            if (data !== null) {
                // Clear the current page
                document.body.innerHTML = '';
                // Set the success message
                const successMessage = document.createElement('h3');
                successMessage.innerHTML  = 'Room Booked Successfully. <a href="#" id="downloadLink">Click here</a> to download the booking details as PDF';
                successMessage.classList.add('success-message');
                document.body.appendChild(successMessage);

                const homeButton = document.createElement('button');
                homeButton.textContent = 'Home';
                homeButton.addEventListener('click', () => {
                    // Redirect to the Homepage.html page
                    window.location.href = 'Homepage.html';
                });
                
                // Create a download button for the PDF
                const downloadLink = successMessage.querySelector('#downloadLink');

                // Attach an event listener to the download button
                downloadLink.addEventListener('click', async (event) => {
                    event.preventDefault();
                    // Fetch the PDF data
                    const fileName = data.bookingId;
                    const pdfResponse = await fetch('http://localhost:8022/api/v1/post/generatepdf', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data), // Pass the response data as the request body
                    });

                    // Check if the PDF generation request is successful
                    if (pdfResponse.ok) {
                        const pdfBlob = await pdfResponse.blob();

                        // Create a URL for the PDF blob
                        const pdfUrl = URL.createObjectURL(pdfBlob);

                        // Create an anchor element to initiate the download
                        const downloadLink = document.createElement('a');
                        downloadLink.href = pdfUrl;
                        downloadLink.download = fileName + '.pdf';
                        downloadLink.click();

                        // Clean up the URL object
                        URL.revokeObjectURL(pdfUrl);
                    } else {
                        throw new Error('Failed to generate PDF.');
                    }
                });

                // Append the elements to the document body
                document.body.appendChild(homeButton);

                successMessage.style.textAlign = 'center';
                homeButton.style.display = 'block';
                homeButton.style.margin = '20px auto';

            }
        } else {
            // Handle the error response
            throw new Error('Failed to confirm booking.');
        }
    } catch (error) {
        console.error(error);
        // Handle any errors that occurred during the API call
    }
});

const dobInput = document.getElementById('dob');
const ageInput = document.getElementById('age');

// Calculate age based on DOB
dobInput.addEventListener('focusout', () => {
    const dobValue = dobInput.value;
    if (dobValue) {
        const dob = new Date(dobValue);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        ageInput.value = age;
    }
});

// Restrict future dates in the datepicker
const currentDate = new Date().toISOString().split('T')[0];
const dateInputs = document.querySelectorAll('input[type="date"]');
dateInputs.forEach((input) => {
    input.setAttribute('max', currentDate);
});