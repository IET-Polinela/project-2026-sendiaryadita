const REPORT_ENDPOINT = "/api/reports/";

function getReportStatusClass(status) {
    const statusClassMap = {
        DRAFT: "status-draft",
        REPORTED: "status-reported",
        VERIFIED: "status-verified",
        IN_PROGRESS: "status-progress",
        RESOLVED: "status-resolved",
    };

    return statusClassMap[status] || "status-draft";
}

async function loadReports() {
    const reportsContainer = document.getElementById("reports-list");

    if (!reportsContainer) {
        return;
    }

    reportsContainer.innerHTML = `
        <div class="text-center text-muted py-4">
            <div class="spinner-border text-primary mb-3" role="status"></div>
            <p>Memuat data laporan...</p>
        </div>
    `;

    try {
        const response = await requestAPI(REPORT_ENDPOINT, "GET");

        if (response.status === 401) {
            reportsContainer.innerHTML = `
                <div class="alert alert-warning">
                    Sesi login sudah habis. Silakan login ulang.
                </div>
            `;
            window.location.hash = "#login";
            return;
        }

        if (!response.ok) {
            reportsContainer.innerHTML = `
                <div class="alert alert-danger">
                    Gagal mengambil data laporan dari backend.
                </div>
            `;
            return;
        }

        const data = await response.json();
        const reports = Array.isArray(data) ? data : data.results || [];

        if (reports.length === 0) {
            reportsContainer.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="bi bi-inbox fs-1"></i>
                    <h5 class="mt-3">Belum Ada Laporan</h5>
                    <p class="small">Data laporan belum tersedia.</p>
                </div>
            `;
            return;
        }

        reportsContainer.innerHTML = reports.map(function (report) {
            const title = report.title || report.judul || "Tanpa Judul";
            const location = report.location || report.lokasi || "Lokasi tidak tersedia";
            const description = report.description || report.deskripsi || report.content || "Tidak ada deskripsi laporan.";
            const status = report.status || "DRAFT";

            return `
                <div class="card shadow-sm border-0 mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 class="fw-bold mb-1">
                                    ${escapeHTML(title)}
                                </h5>
                                <p class="text-muted small mb-2">
                                    <i class="bi bi-geo-alt-fill me-1"></i>
                                    ${escapeHTML(location)}
                                </p>
                            </div>

                            <span class="status-pill ${getReportStatusClass(status)}">
                                ${escapeHTML(status)}
                            </span>
                        </div>

                        <p class="mb-0">
                            ${escapeHTML(description)}
                        </p>
                    </div>
                </div>
            `;
        }).join("");

    } catch (error) {
        console.error("Error mengambil reports:", error);

        reportsContainer.innerHTML = `
            <div class="alert alert-danger">
                Tidak dapat terhubung ke server backend.
            </div>
        `;
    }
}
