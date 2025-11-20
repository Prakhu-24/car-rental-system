const API_URL = "https://car-rental-system-t7u7.onrender.com/api";

// 🌟 Toast notification (for login/signup feedback)
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("opacity-0", "translate-y-5");

  // Set color
  toast.classList.remove("bg-green-500", "bg-red-500");
  toast.classList.add(type === "error" ? "bg-red-500" : "bg-green-500");

  // Animate in
  setTimeout(() => toast.classList.add("opacity-100", "translate-y-0"), 10);

  // Hide after 2.5s
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-5");
  }, 2500);
}

// 🔐 Signup function
async function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password)
    return showToast("Please fill all fields", "error");

  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      showToast("Signup successful! Redirecting...", "success");
      setTimeout(() => (window.location.href = "login.html"), 1500);
    } else {
      showToast(data.message || "Signup failed!", "error");
    }
  } catch (error) {
    console.error("Signup error:", error);
    showToast("Something went wrong!", "error");
  }
}

// 🔑 Login function
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password)
    return showToast("Please enter email and password", "error");

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);

      // Check if user is admin
      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: "Bearer " + data.token },
      });
      const me = await meRes.json();

      if (meRes.ok && me.isAdmin) {
        showToast("Welcome Admin!", "success");
        setTimeout(() => (window.location.href = "admin.html"), 1200);
      } else {
        showToast("Login successful!", "success");
        setTimeout(() => (window.location.href = "index.html"), 1200);
      }
    } else {
      showToast(data.message || "Invalid credentials!", "error");
    }
  } catch (error) {
    console.error("Login error:", error);
    showToast("Server error during login", "error");
  }
}
