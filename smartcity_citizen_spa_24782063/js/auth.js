function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function updateNavMenus() {
    const navMenus = document.getElementById("nav-menus");

    if (!navMenus) {
        return;
    }

    const accessToken = localStorage.getItem("access_token");
    const username = localStorage.getItem("username") || "Akun Warga";

    if (accessToken) {
        navMenus.innerHTML = `
            <a class="app-nav-link" href="#dashboard">
                <i class="bi bi-speedometer2 me-1"></i>Dashboard
            </a>
            <span class="user-chip">
                <i class="bi bi-person-circle me-2"></i>${escapeHTML(username)}
            </span>
            <button class="nav-link-button" type="button" onclick="logout()">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
            </button>
        `;
        return;
    }

    navMenus.innerHTML = `
        <a class="app-nav-link" href="#login">
            <i class="bi bi-box-arrow-in-right me-1"></i>Login
        </a>
    `;
}

function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");

    updateNavMenus();
    window.location.hash = "#login";
}

function setupLoginForm() {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        const payload = {
            username: username,
            password: password,
        };

        try {
            const response = await requestAPI("/api/token/", "POST", payload);
            const data = await response.json();

            if (response.status === 200) {
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);
                localStorage.setItem("username", username);

                updateNavMenus();
                alert("Login berhasil!");
                window.location.hash = "#dashboard";
            } else {
                alert("Login gagal. Username atau password salah.");
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            alert("Tidak dapat terhubung ke server backend.");
        }
    });
}
