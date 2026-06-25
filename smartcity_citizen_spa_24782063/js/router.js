const routes = {
    "#login": `
        <section class="auth-shell">
            <div class="auth-visual">
                <div class="auth-visual-content">
                    <span class="auth-kicker">
                        <i class="bi bi-geo-alt-fill"></i>Provinsi Lampung
                    </span>
                    <h1>Suara warga, respons yang lebih cepat.</h1>
                    <p>
                        Sampaikan persoalan fasilitas umum dan pantau tindak lanjutnya
                        dalam satu portal yang transparan.
                    </p>
                </div>
            </div>

            <div class="auth-panel">
                <div class="auth-form-wrap">
                    <span class="auth-icon">
                        <i class="bi bi-person-check-fill fs-5"></i>
                    </span>
                    <h2 class="auth-heading">Masuk ke portal warga</h2>
                    <p class="auth-subheading">
                        Gunakan akun Citizen untuk membuat dan memantau laporan Anda.
                    </p>

                    <form id="loginForm">
                        <div class="mb-3">
                            <label for="loginUsername" class="form-label">Username</label>
                            <input type="text" id="loginUsername" class="form-control" placeholder="Masukkan username" autocomplete="username" required>
                        </div>

                        <div class="mb-3">
                            <label for="loginPassword" class="form-label">Password</label>
                            <input type="password" id="loginPassword" class="form-control" placeholder="Masukkan password" autocomplete="current-password" required>
                        </div>

                        <button type="submit" class="btn btn-primary w-100">
                            <i class="bi bi-box-arrow-in-right me-2"></i>Masuk
                        </button>
                    </form>

                    <p class="auth-switch mb-0">
                        Belum punya akun?
                        <a href="#register" class="fw-bold text-decoration-none">Daftar sebagai warga</a>
                    </p>
                </div>
            </div>
        </section>
    `,

    "#register": `
        <section class="auth-shell">
            <div class="auth-visual">
                <div class="auth-visual-content">
                    <span class="auth-kicker">
                        <i class="bi bi-people-fill"></i>Partisipasi Publik
                    </span>
                    <h1>Mulai berkontribusi untuk Lampung.</h1>
                    <p>
                        Buat akun warga untuk mengirim laporan, menyimpan draf,
                        dan mengikuti perkembangan penanganannya.
                    </p>
                </div>
            </div>

            <div class="auth-panel">
                <div class="auth-form-wrap register-wrap">
                    <span class="auth-icon">
                        <i class="bi bi-person-plus-fill fs-5"></i>
                    </span>
                    <h2 class="auth-heading">Buat akun warga</h2>
                    <p class="auth-subheading">
                        Lengkapi data berikut. Akun ini digunakan untuk mengelola laporan Anda.
                    </p>

                    <div id="registerMessage"></div>

                    <form id="registerForm">
                        <div class="row g-3">
                            <div class="col-12 col-md-6">
                                <label for="registerFirstName" class="form-label">Nama Depan</label>
                                <input type="text" id="registerFirstName" class="form-control" autocomplete="given-name">
                            </div>

                            <div class="col-12 col-md-6">
                                <label for="registerLastName" class="form-label">Nama Belakang</label>
                                <input type="text" id="registerLastName" class="form-control" autocomplete="family-name">
                            </div>

                            <div class="col-12">
                                <label for="registerUsername" class="form-label">Username</label>
                                <input type="text" id="registerUsername" class="form-control" autocomplete="username" required>
                            </div>

                            <div class="col-12">
                                <label for="registerEmail" class="form-label">Email</label>
                                <input type="email" id="registerEmail" class="form-control" autocomplete="email">
                            </div>

                            <div class="col-12 col-md-6">
                                <label for="registerPassword" class="form-label">Password</label>
                                <input type="password" id="registerPassword" class="form-control" minlength="6" autocomplete="new-password" required>
                            </div>

                            <div class="col-12 col-md-6">
                                <label for="registerPassword2" class="form-label">Konfirmasi Password</label>
                                <input type="password" id="registerPassword2" class="form-control" minlength="6" autocomplete="new-password" required>
                            </div>
                        </div>

                        <button type="submit" id="registerButton" class="btn btn-primary w-100 mt-4">
                            <i class="bi bi-person-check-fill me-2"></i>Daftar
                        </button>
                    </form>

                    <p class="auth-switch mb-0">
                        Sudah punya akun?
                        <a href="#login" class="fw-bold text-decoration-none">Masuk ke portal</a>
                    </p>
                </div>
            </div>
        </section>
    `,

    "#dashboard": `
        <header class="dashboard-header">
            <div>
                <span class="workspace-kicker">
                    <i class="bi bi-broadcast-pin"></i>Pusat Laporan Provinsi
                </span>
                <h1>Aspirasi warga Lampung</h1>
                <p>
                    Kelola laporan Anda dan pantau perkembangan persoalan publik
                    dari berbagai wilayah di Lampung.
                </p>
            </div>
            <span class="service-state">Layanan aktif</span>
        </header>

        <div class="row g-4 dashboard-shell">
            <aside class="col-12 col-lg-3 col-xl-2">
                <div class="card sidebar-card sticky-top" id="summaryStats" style="top: 88px;">
                    <div class="card-body">
                        <button type="button" id="btnBukaModal" class="btn btn-primary new-report-button mb-4" data-bs-toggle="modal" data-bs-target="#reportModal">
                            <i class="bi bi-plus-circle-fill me-2"></i>Laporan Baru
                        </button>

                        <h2 class="sidebar-heading fw-bold text-uppercase mb-2">
                            <i class="bi bi-activity me-1"></i>Status Laporan Anda
                        </h2>

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

                        <div class="sidebar-note">
                            <i class="bi bi-shield-check me-1"></i>
                            Identitas pelapor pada Feed Lampung ditampilkan secara anonim.
                        </div>
                    </div>
                </div>
            </aside>

            <section class="col-12 col-lg-9 col-xl-10">
                <div class="reports-toolbar">
                    <div class="nav nav-tabs dashboard-tabs" id="dashboardTabs">
                        <button type="button" id="tabMyReports" class="nav-link active fw-bold" onclick="loadDashboardData('my_reports', 1)">
                            <i class="bi bi-folder-fill me-2"></i>Laporan Saya
                        </button>

                        <button type="button" id="tabFeed" class="nav-link fw-bold" onclick="loadDashboardData('feed', 1)">
                            <i class="bi bi-globe-asia-australia me-2"></i>Feed Lampung
                        </button>
                    </div>
                    <span class="toolbar-context">
                        <i class="bi bi-arrow-down-up me-1"></i>Terbaru diperbarui
                    </span>
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

    if (hash === "#register" && typeof setupRegisterForm === "function") {
        setupRegisterForm();
    }

    if (hash === "#dashboard" && typeof loadReports === "function") {
        loadReports();
    }
}

window.addEventListener("hashchange", handleRouting);
window.addEventListener("DOMContentLoaded", handleRouting);
