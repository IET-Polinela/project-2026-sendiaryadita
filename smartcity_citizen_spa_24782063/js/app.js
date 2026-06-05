const REPORT_ENDPOINT = "/api/reports/";

let currentTab = "my_reports";
let currentPage = 1;
let totalPages = 1;
let allReports = [];
let editingReportId = null;

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

function getProgressInfo(status) {
    if (status === "DRAFT") {
        return { value: 10, className: "progress-draft", label: "Draf" };
    }

    if (status === "REPORTED") {
        return { value: 25, className: "progress-reported", label: "Diajukan" };
    }

    if (status === "VERIFIED") {
        return { value: 50, className: "progress-verified", label: "Diverifikasi" };
    }

    if (status === "IN_PROGRESS") {
        return { value: 75, className: "progress-in-progress", label: "Diproses" };
    }

    if (status === "RESOLVED") {
        return { value: 100, className: "progress-resolved", label: "Selesai" };
    }

    return { value: 0, className: "progress-draft", label: "Belum Diketahui" };
}

function updateDashboardTabs() {
    const tabMyReports = document.getElementById("tabMyReports");
    const tabFeed = document.getElementById("tabFeed");

    if (!tabMyReports || !tabFeed) {
        return;
    }

    tabMyReports.className = `nav-link fw-bold ${currentTab === "my_reports" ? "active" : ""}`;
    tabFeed.className = `nav-link fw-bold ${currentTab === "feed" ? "active" : ""}`;
}

async function loadReports() {
    loadDashboardData(currentTab, currentPage);
}

async function loadDashboardData(tab = currentTab, page = currentPage) {
    currentTab = tab;
    currentPage = page;
    updateDashboardTabs();

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
        const response = await requestAPI(`${REPORT_ENDPOINT}?tab=${tab}&page=${page}`, "GET");

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
            renderLoadError();
            return;
        }

        const data = await response.json();

        allReports = data.results || [];
        totalPages = Math.max(1, Math.ceil((data.count || 0) / 10));

        reportsContainer.innerHTML = `
            <div id="listContainer" class="row g-4 reports-grid"></div>
            <nav class="d-flex justify-content-center mt-4" aria-label="Navigasi halaman laporan">
                <ul id="paginationContainer" class="pagination mb-0"></ul>
            </nav>
        `;

        renderList(allReports, tab);
        renderPagination(totalPages, page);
        loadSummaryStats();
    } catch (error) {
        console.error("Error mengambil reports:", error);
        renderLoadError("Tidak dapat terhubung ke server backend.");
    }
}

function renderLoadError(message = "Gagal mengambil data laporan dari backend.") {
    const reportsContainer = document.getElementById("reports-list");

    if (!reportsContainer) {
        return;
    }

    reportsContainer.innerHTML = `
        <div class="alert alert-danger">
            ${escapeHTML(message)}
        </div>
    `;
}

function renderList(reports, tab) {
    const listContainer = document.getElementById("listContainer");

    if (!listContainer) {
        return;
    }

    if (reports.length === 0) {
        listContainer.innerHTML = `
            <div class="col-12">
                <div class="card border-0 shadow-sm">
                    <div class="card-body text-center text-muted py-5">
                        <i class="bi bi-inbox fs-1"></i>
                        <h5 class="mt-3">Belum Ada Laporan</h5>
                        <p class="small mb-0">Belum ada laporan di tab ini.</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = reports.map(function (report) {
        const title = report.title || report.judul || "Tanpa Judul";
        const location = report.location || report.lokasi || "Lokasi tidak tersedia";
        const description = report.description || report.deskripsi || report.content || "Tidak ada deskripsi laporan.";
        const status = report.status || "DRAFT";
        const category = report.category || "Tanpa Kategori";
        const reporter = report.reporter || "Warga Anonim";
        const progress = getProgressInfo(status);
        const canEditDraft = status === "DRAFT" && report.is_owner === true;
        const editButton = canEditDraft ? `
            <div class="mt-3 d-flex justify-content-end">
                <button type="button" class="btn btn-sm btn-warning fw-bold" onclick="editDraft(${report.id})">
                    <i class="bi bi-pencil-square me-1"></i>Edit
                </button>
            </div>
        ` : "";

        return `
            <div class="col-12 col-xl-6">
                <div class="card report-card shadow-sm border-0">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                            <span class="status-pill ${getReportStatusClass(status)}">
                                ${escapeHTML(status)}
                            </span>
                            <span class="small text-muted text-end">${escapeHTML(category)}</span>
                        </div>

                        <h5 class="report-title fw-bold mb-2">
                            ${escapeHTML(title)}
                        </h5>

                        <p class="report-description text-muted mb-3">
                            ${escapeHTML(description)}
                        </p>

                        <div class="report-meta">
                            <p class="mb-1">
                                <strong>Lokasi:</strong> ${escapeHTML(location)}
                            </p>
                            <p class="mb-3">
                                <strong>Oleh:</strong> ${escapeHTML(reporter)}
                            </p>

                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <small class="text-muted fw-bold">Progress Laporan:</small>
                                <small class="fw-bold ${getReportStatusClass(status)}">${progress.label} (${progress.value}%)</small>
                            </div>
                        </div>

                        <div class="progress mt-auto" style="height: 8px;">
                            <div
                                class="progress-bar progress-bar-striped ${progress.className}"
                                role="progressbar"
                                style="width: ${progress.value}%"
                                aria-valuenow="${progress.value}"
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>

                        ${editButton}
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function renderPagination(pageCount, activePage) {
    const paginationContainer = document.getElementById("paginationContainer");

    if (!paginationContainer) {
        return;
    }

    if (pageCount <= 1) {
        paginationContainer.innerHTML = "";
        return;
    }

    const previousPage = activePage - 1;
    const nextPage = activePage + 1;

    let buttons = `
        <li class="page-item ${activePage === 1 ? "disabled" : ""}">
            <button
                type="button"
                class="page-link"
                ${activePage === 1 ? "disabled" : ""}
                onclick="loadDashboardData('${currentTab}', ${previousPage})"
            >
                Sebelumnya
            </button>
        </li>
    `;

    for (let page = 1; page <= pageCount; page++) {
        buttons += `
            <li class="page-item ${page === activePage ? "active" : ""}">
                <button
                    type="button"
                    class="page-link"
                    onclick="loadDashboardData('${currentTab}', ${page})"
                >
                    ${page}
                </button>
            </li>
        `;
    }

    buttons += `
        <li class="page-item ${activePage === pageCount ? "disabled" : ""}">
            <button
                type="button"
                class="page-link"
                ${activePage === pageCount ? "disabled" : ""}
                onclick="loadDashboardData('${currentTab}', ${nextPage})"
            >
                Selanjutnya
            </button>
        </li>
    `;

    paginationContainer.innerHTML = buttons;
}

async function loadSummaryStats() {
    try {
        const response = await requestAPI(`${REPORT_ENDPOINT}?tab=my_reports&page_size=1000`, "GET");

        if (!response || !response.ok) {
            return;
        }

        const data = await response.json();
        const reports = Array.isArray(data) ? data : data.results || [];

        const totalDraft = reports.filter(function (report) {
            return report.status === "DRAFT";
        }).length;

        const totalReported = reports.filter(function (report) {
            return report.status === "REPORTED";
        }).length;

        const totalVerified = reports.filter(function (report) {
            return report.status === "VERIFIED";
        }).length;

        const totalProcess = reports.filter(function (report) {
            return report.status === "IN_PROGRESS";
        }).length;

        const totalDone = reports.filter(function (report) {
            return report.status === "RESOLVED";
        }).length;

        const countDraft = document.getElementById("countDraft");
        const countReported = document.getElementById("countReported");
        const countVerified = document.getElementById("countVerified");
        const countProcess = document.getElementById("countProcess");
        const countDone = document.getElementById("countDone");

        if (countDraft) {
            countDraft.textContent = totalDraft;
        }

        if (countReported) {
            countReported.textContent = totalReported;
        }

        if (countVerified) {
            countVerified.textContent = totalVerified;
        }

        if (countProcess) {
            countProcess.textContent = totalProcess;
        }

        if (countDone) {
            countDone.textContent = totalDone;
        }
    } catch (error) {
        console.error("Error mengambil rekap status:", error);
    }
}

function showReportModal() {
    const modalElement = document.getElementById("reportModal");

    if (!modalElement || typeof bootstrap === "undefined") {
        return;
    }

    const reportModal = new bootstrap.Modal(modalElement);
    reportModal.show();
}

function closeReportModal() {
    const modalElement = document.getElementById("reportModal");

    if (!modalElement || typeof bootstrap === "undefined") {
        return;
    }

    const reportModal = bootstrap.Modal.getInstance(modalElement);

    if (reportModal) {
        reportModal.hide();
    }
}

function resetReportForm() {
    const reportForm = document.getElementById("reportForm");
    const reportId = document.getElementById("reportId");
    const modalTitle = document.getElementById("reportModalLabel");

    if (reportForm) {
        reportForm.reset();
    }

    if (reportId) {
        reportId.value = "";
    }

    if (modalTitle) {
        modalTitle.innerHTML = '<i class="bi bi-pencil-square me-2"></i> Form Laporan';
    }

    editingReportId = null;
}

function prepareNewReport() {
    resetReportForm();
}

async function editDraft(id) {
    try {
        const response = await requestAPI(`${REPORT_ENDPOINT}${id}/`, "GET");

        if (!response || !response.ok) {
            alert("Gagal mengambil data laporan lama.");
            return;
        }

        const report = await response.json();

        editingReportId = id;

        document.getElementById("reportId").value = report.id || "";
        document.getElementById("title").value = report.title || "";
        document.getElementById("category").value = report.category || "";
        document.getElementById("location").value = report.location || "";
        document.getElementById("description").value = report.description || "";

        const modalTitle = document.getElementById("reportModalLabel");

        if (modalTitle) {
            modalTitle.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Edit Draft Laporan';
        }

        showReportModal();
    } catch (error) {
        console.error("Error mengambil draft laporan:", error);
        alert("Tidak dapat terhubung ke server backend.");
    }
}

async function submitReport(statusValue) {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;

    const bodyData = {
        title: title,
        category: category,
        location: location,
        description: description,
        status: statusValue,
    };

    let endpoint = REPORT_ENDPOINT;
    let method = "POST";

    if (editingReportId !== null) {
        endpoint = `${REPORT_ENDPOINT}${editingReportId}/`;
        method = "PUT";
    }

    try {
        const response = await requestAPI(endpoint, method, bodyData);

        if (response && response.ok) {
            alert("Laporan berhasil disimpan.");

            resetReportForm();
            closeReportModal();
            loadDashboardData(currentTab, currentPage);

            if (typeof loadSummaryStats === "function") {
                loadSummaryStats();
            }

            return;
        }

        const errorData = response ? await response.json().catch(function () {
            return null;
        }) : null;
        const errorMessage = errorData ? JSON.stringify(errorData) : "Gagal menyimpan laporan.";

        alert(errorMessage);
    } catch (error) {
        console.error("Error menyimpan laporan:", error);
        alert("Tidak dapat terhubung ke server backend.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const btnSaveDraft = document.getElementById("btnSaveDraft");
    const btnSubmitReport = document.getElementById("btnSubmitReport");

    if (btnSaveDraft) {
        btnSaveDraft.addEventListener("click", function () {
            submitReport("DRAFT");
        });
    }

    if (btnSubmitReport) {
        btnSubmitReport.addEventListener("click", function () {
            submitReport("REPORTED");
        });
    }

    document.addEventListener("click", function (event) {
        const newReportButton = event.target.closest('[data-bs-target="#reportModal"]');

        if (newReportButton) {
            prepareNewReport();
        }
    });
});
