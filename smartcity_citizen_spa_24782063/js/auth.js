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
                <i class="bi bi-person-circle me-2"></i>Halo, ${escapeHTML(username)}!
            </span>
            <button class="nav-link-button" type="button" onclick="logout()">
                <i class="bi bi-box-arrow-right me-1"></i>Keluar
            </button>
        `;
        return;
    }

    navMenus.innerHTML = `
        <a class="app-nav-link" href="#login">
            <i class="bi bi-box-arrow-in-right me-1"></i>Login
        </a>
        <a class="app-nav-link" href="#register">
            <i class="bi bi-person-plus me-1"></i>Daftar
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

function getRegisterErrorMessage(data) {
    if (!data || typeof data !== "object") {
        return "Registrasi gagal. Silakan periksa kembali data yang diisi.";
    }

    const messages = Object.values(data).flatMap(function (value) {
        return Array.isArray(value) ? value : [value];
    });

    return messages.length > 0
        ? messages.join(" ")
        : "Registrasi gagal. Silakan periksa kembali data yang diisi.";
}

function setupRegisterForm() {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const messageContainer = document.getElementById("registerMessage");
        const registerButton = document.getElementById("registerButton");
        const password = document.getElementById("registerPassword").value;
        const password2 = document.getElementById("registerPassword2").value;

        if (password !== password2) {
            messageContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Password dan konfirmasi password tidak sama.
                </div>
            `;
            return;
        }

        const payload = {
            username: document.getElementById("registerUsername").value.trim(),
            email: document.getElementById("registerEmail").value.trim(),
            first_name: document.getElementById("registerFirstName").value.trim(),
            last_name: document.getElementById("registerLastName").value.trim(),
            password: password,
            password2: password2,
        };

        registerButton.disabled = true;
        registerButton.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            Mendaftarkan...
        `;
        messageContainer.innerHTML = "";

        try {
            const response = await requestAPI("/api/register/", "POST", payload);
            const data = await response.json();

            if (response.status === 201) {
                registerForm.reset();
                messageContainer.innerHTML = `
                    <div class="alert alert-success" role="alert">
                        Akun berhasil dibuat. Mengarahkan ke halaman login...
                    </div>
                `;

                window.setTimeout(function () {
                    window.location.hash = "#login";
                }, 1200);
                return;
            }

            messageContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    ${escapeHTML(getRegisterErrorMessage(data))}
                </div>
            `;
        } catch (error) {
            console.error("Terjadi kesalahan saat registrasi:", error);
            messageContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Tidak dapat terhubung ke server backend.
                </div>
            `;
        } finally {
            registerButton.disabled = false;
            registerButton.innerHTML = `
                <i class="bi bi-person-check-fill me-2"></i>Daftar
            `;
        }
    });
}
