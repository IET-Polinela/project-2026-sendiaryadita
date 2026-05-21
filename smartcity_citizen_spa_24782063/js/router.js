const routes = {
    "#login": `
        <div class="row justify-content-center mt-5">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h4 class="text-center mb-4">
                            <i class="bi bi-person-circle me-2"></i>Login Warga
                        </h4>

                        <form id="loginForm">
                            <div class="mb-3">
                                <label class="form-label">Username</label>
                                <input type="text" id="loginUsername" class="form-control" placeholder="Masukkan username" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input type="password" id="loginPassword" class="form-control" placeholder="Masukkan password" required>
                            </div>

                            <button type="submit" class="btn btn-primary w-100 fw-bold">
                                Masuk
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,

    "#dashboard": `
        <div class="row g-4">
            <aside class="col-12 col-lg-3">
                <div class="card shadow-sm border-0 sticky-top" style="top: 20px;">
                    <div class="card-body">
                        <button class="btn btn-primary w-100 fw-bold mb-3">
                            <i class="bi bi-plus-circle-fill me-2"></i>Laporan Baru
                        </button>

                        <hr>

                        <p class="text-muted mb-0">
                            <i class="bi bi-person-check-fill me-2"></i>Portal Warga
                        </p>
                    </div>
                </div>
            </aside>

            <section class="col-12 col-lg-6">
                <div class="mb-3">
                    <h5 class="fw-bold">
                        <i class="bi bi-list-check me-2"></i>Daftar Laporan Warga
                    </h5>
                    <p class="text-muted small mb-0">Data laporan diambil langsung dari backend Django REST API.</p>
                </div>

                <div id="reports-list"></div>
            </section>

            <aside class="col-12 col-lg-3">
                <div class="card shadow-sm border-0 sticky-top" style="top: 20px;">
                    <div class="card-body">
                        <h6 class="fw-bold">
                            <i class="bi bi-info-circle-fill text-primary me-2"></i>Pengumuman
                        </h6>
                        <p class="small text-muted mb-0">
                            Gunakan portal ini untuk membuat dan memantau laporan warga.
                        </p>
                    </div>
                </div>
            </aside>
        </div>
    `
};

function handleRouting() {
    const hash = window.location.hash || "#login";
    document.getElementById("app-content").innerHTML = routes[hash] || routes["#login"];

    if (typeof updateNavMenus === "function") {
        updateNavMenus();
    }

    if (hash === "#login" && typeof setupLoginForm === "function") {
        setupLoginForm();
    }

    if (hash === "#dashboard" && typeof loadReports === "function") {
        loadReports();
    }
}

window.addEventListener("hashchange", handleRouting);
window.addEventListener("DOMContentLoaded", handleRouting);
