const API_URL = "http://localhost:5000/api";

async function fetchBookings() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/bookings/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const bookings = await res.json();
  const container = document.getElementById("bookingList");

  if (!container) return;

  container.innerHTML = "";

  if (!bookings.length) {
    container.innerHTML = `
      <p class="text-gray-500 text-lg font-medium">You have no bookings yet.</p>
    `;
    return;
  }

  bookings.forEach((b) => {
    const div = document.createElement("div");
    div.className = "bg-gray-50 rounded-xl shadow-md p-4 w-80";
    div.innerHTML = `
      <img src="${b.car.imageUrl || 'https://via.placeholder.com/250x150'}"
           class="rounded-md mb-3 w-full h-40 object-cover">
      <h3 class="text-lg font-semibold mb-1">${b.car.brand} ${b.car.name}</h3>
      <p class="text-gray-600 text-sm mb-1">₹${b.totalAmount} total</p>
      <p class="text-gray-600 text-sm mb-1">From: ${new Date(b.startDate).toLocaleDateString()}</p>
      <p class="text-gray-600 text-sm mb-3">To: ${new Date(b.endDate).toLocaleDateString()}</p>
      <button onclick="cancelBooking('${b._id}')"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
        Cancel Booking
      </button>
    `;
    container.appendChild(div);
  });
}

async function cancelBooking(id) {
  const token = localStorage.getItem("token");
  if (!confirm("Are you sure you want to cancel this booking?")) return;

  const res = await fetch(`${API_URL}/bookings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  alert(data.message);
  fetchBookings(); // Refresh list
}

// Auto-load
window.onload = fetchBookings;
