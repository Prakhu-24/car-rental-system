const API_URL = "https://car-rental-system-t7u7.onrender.com/api";

let selectedCar = null;

// 🌟 Toast notification
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("opacity-0", "translate-y-5");
  toast.classList.remove("bg-green-500", "bg-red-500");
  toast.classList.add(type === "error" ? "bg-red-500" : "bg-green-500");

  setTimeout(() => toast.classList.add("opacity-100", "translate-y-0"), 10);
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-5");
  }, 2500);
}

async function fetchCars() {
  try {
    const token = localStorage.getItem("token");
    let isAdmin = false;

    // ✅ Check if current user is admin
    if (token) {
      try {
        const resUser = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: "Bearer " + token },
        });
        const user = await resUser.json();
        isAdmin = user.isAdmin;
      } catch (err) {
        console.error("Admin check failed:", err);
      }
    }

    const res = await fetch(`${API_URL}/cars`);
    const cars = await res.json();
    const container = document.getElementById("carList");
    if (!container) return;

    container.innerHTML = "";

    cars.forEach((car) => {
      const div = document.createElement("div");
      div.className =
        "bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-4 w-[260px] text-center border border-white/10 transition transform hover:scale-105 hover:shadow-teal-500/30";

      // ✅ Hide Book Now for admins
      const showButton = !isAdmin && car.available;

      div.innerHTML = `
        <img src="${car.imageUrl || "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80"}"
             alt="${car.name}" class="rounded-lg mb-3 w-full h-44 object-cover">
        <h3 class="text-lg font-semibold text-white mb-1">${car.brand} ${car.name}</h3>
        <p class="text-gray-300 text-sm mb-1">₹${car.pricePerDay}/day</p>
        <p class="text-sm mb-3 ${car.available ? "text-teal-400" : "text-red-400"}">
          ${car.available ? "Available" : "Booked"}
        </p>
        ${
          showButton
            ? `<button onclick="openBookingModal('${car._id}', '${car.name}', '${car.brand}', ${car.pricePerDay})"
                class="w-full py-2 rounded-lg font-medium transition-all duration-300 bg-teal-500 hover:bg-teal-600 text-white">
                Book Now
              </button>`
            : ""
        }
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading cars:", err);
    showToast("Failed to load cars", "error");
  }
}

// 🪟 Open booking modal
function openBookingModal(carId, carName, brand, pricePerDay) {
  const token = localStorage.getItem("token");
  if (!token) return showToast("Please login first!", "error");

  selectedCar = { carId, carName, brand, pricePerDay };

  const modal = document.getElementById("bookingModal");
  if (!modal) {
    showToast("Booking modal missing in HTML!", "error");
    return;
  }

  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  document.getElementById("priceInfo").textContent = `Price per day: ₹${pricePerDay}`;
  document.getElementById("totalPrice").textContent = "";

  modal.classList.remove("hidden");
  setTimeout(() => modal.classList.add("opacity-100", "scale-100"), 50);
  modal.classList.add("flex");
}

// ❌ Close modal
function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  modal.classList.remove("opacity-100", "scale-100");
  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }, 200);
  selectedCar = null;
}

// 💰 Update total price dynamically
function updateTotalPrice() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const totalPriceEl = document.getElementById("totalPrice");

  if (!startDate || !endDate || !selectedCar) {
    totalPriceEl.textContent = "";
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

  if (diffDays < 1) {
    totalPriceEl.textContent = "Invalid date range.";
    return;
  }

  const total = diffDays * selectedCar.pricePerDay;
  totalPriceEl.textContent = `Total: ₹${total} (${diffDays} day${diffDays > 1 ? "s" : ""})`;
}

// ✅ Confirm booking
async function confirmBooking() {
  if (!selectedCar) return;
  const token = localStorage.getItem("token");
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!startDate || !endDate)
    return showToast("Please select both start and end dates", "error");

  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        carId: selectedCar.carId,
        startDate,
        endDate,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      showToast(`✅ ${selectedCar.brand} ${selectedCar.carName} booked!`);
      closeBookingModal();
      fetchCars(); // refresh availability
    } else {
      showToast(data.message || "Booking failed", "error");
    }
  } catch (err) {
    console.error("Booking error:", err);
    showToast("Server error while booking", "error");
  }
}

// 🚪 Logout helper
function logout() {
  localStorage.removeItem("token");
  showToast("Logged out successfully!");
  setTimeout(() => (window.location.href = "login.html"), 1000);
}

// ⚡ Initialize
window.onload = () => {
  fetchCars();

  // modal event listeners
  document.getElementById("confirmBookingBtn")?.addEventListener("click", confirmBooking);
  document.getElementById("cancelBtn")?.addEventListener("click", closeBookingModal);
  document.getElementById("closeModal")?.addEventListener("click", closeBookingModal);
  document.getElementById("startDate")?.addEventListener("change", updateTotalPrice);
  document.getElementById("endDate")?.addEventListener("change", updateTotalPrice);
};
