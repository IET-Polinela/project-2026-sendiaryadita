const routes = {
    "#login": `
        <div class="row justify-content-center mt-5">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card login-card shadow-sm border-0">
                    <div class="card-body p-4">
                        <div class="text-center mb-4">
                            <span class="login-icon mb-3">
                                <i class="bi bi-person-circle fs-4"></i>
                            </span>
                            <h4 class="fw-bold mb-1">Login Warga</h4>
                        </div>

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
        <div class="row g-4 dashboard-shell">
            <aside class="col-12 col-lg-2">
                <div class="card sidebar-card shadow-sm border-0 sticky-top" style="top: 20px;">
                    <div class="card-body">
                        <button type="button" class="btn btn-primary new-report-button w-100 fw-bold mb-4 d-inline-flex align-items-center" data-bs-toggle="modal" data-bs-target="#reportModal">
                            <i class="bi bi-plus-circle-fill me-2"></i>Buat Laporan Baru
                        </button>

                        <h6 class="sidebar-heading fw-bold text-uppercase small mb-3">
                            <i class="bi bi-activity me-1"></i>Status Laporan Anda
                        </h6>

                        <div class="status-row d-flex justify-content-between align-items-center border-bottom py-2">
                            <span><i class="bi bi-pencil-square text-secondary me-2"></i>Draf</span>
                            <span class="badge rounded-pill status-count-draft" id="countDraft">0</span>
                        </div>

                        <div class="status-row d-flex justify-content-between align-items-center border-bottom py-2">
                            <span><i class="bi bi-send-fill text-warning me-2"></i>Diajukan</span>
                            <span class="badge rounded-pill status-count-reported" id="countReported">0</span>
                        </div>

                        <div class="status-row d-flex justify-content-between align-items-center border-bottom py-2">
                            <span><i class="bi bi-patch-check-fill me-2" style="color: #18b7cf;"></i>Diverifikasi</span>
                            <span class="badge rounded-pill status-count-verified" id="countVerified">0</span>
                        </div>

                        <div class="status-row d-flex justify-content-between align-items-center border-bottom py-2">
                            <span><i class="bi bi-gear-fill me-2" style="color: #fd7e14;"></i>Diproses</span>
                            <span class="badge rounded-pill status-count-process" id="countProcess">0</span>
                        </div>

                        <div class="status-row d-flex justify-content-between align-items-center py-2">
                            <span><i class="bi bi-check-circle-fill text-success me-2"></i>Selesai</span>
                            <span class="badge rounded-pill status-count-done" id="countDone">0</span>
                        </div>
                    </div>
                </div>
            </aside>

            <section class="col-12 col-lg-10">
                <div class="mb-3">
                    <div class="nav nav-tabs dashboard-tabs" id="dashboardTabs">
                        <button type="button" id="tabMyReports" class="nav-link active fw-bold" onclick="loadDashboardData('my_reports', 1)">
                            <i class="bi bi-folder-fill me-2"></i>Laporan Saya
                        </button>

                        <button type="button" id="tabFeed" class="nav-link fw-bold" onclick="loadDashboardData('feed', 1)">
                            <i class="bi bi-globe-americas me-2"></i>Feed Kota (Publik)
                        </button>
                    </div>
                </div>

                <div id="reports-list"></div>
            </section>
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
