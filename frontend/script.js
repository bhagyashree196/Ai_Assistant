// ===============================
// Secure Compliance LLM - script.js
// ===============================

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {

    console.log("SecureLLM Dashboard Loaded");

    // ===============================
    // SEARCH & FILTER LOGS
    // ===============================

    const searchInput = document.querySelector("input[placeholder='Search by User / Query ID']");
    const statusFilter = document.querySelector("select.form-select");
    const tableRows = document.querySelectorAll("table tbody tr:not(.collapse)");

    if (searchInput) {
        searchInput.addEventListener("keyup", function () {
            filterLogs();
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", function () {
            filterLogs();
        });
    }

    function filterLogs() {
        const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedStatus = statusFilter ? statusFilter.value.toLowerCase() : "";

        tableRows.forEach(row => {
            const text = row.innerText.toLowerCase();
            const statusCell = row.querySelector(".badge");

            let statusText = statusCell ? statusCell.innerText.toLowerCase() : "";

            const matchesSearch = text.includes(searchValue);
            const matchesStatus = selectedStatus === "filter by status" || selectedStatus === "" || statusText.includes(selectedStatus);

            if (matchesSearch && matchesStatus) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    // ===============================
    // DOWNLOAD LOGS (Simulation)
    // ===============================

    const downloadBtn = document.querySelector(".btn-download");

    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {

            const logs = [];
            tableRows.forEach(row => {
                if (row.style.display !== "none") {
                    logs.push(row.innerText);
                }
            });

            const blob = new Blob([logs.join("\n\n")], { type: "text/plain" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "secure_llm_logs.txt";
            a.click();
            window.URL.revokeObjectURL(url);

            showToast("Logs downloaded successfully!");
        });
    }

    // ===============================
    // TOAST NOTIFICATION
    // ===============================

    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "position-fixed bottom-0 end-0 p-3";
        toast.style.zIndex = "9999";

        toast.innerHTML = `
            <div class="toast show text-bg-success border-0">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto"></button>
                </div>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // ===============================
    // COLLAPSE ICON TOGGLE (Optional)
    // ===============================

    const collapseButtons = document.querySelectorAll("[data-bs-toggle='collapse']");

    collapseButtons.forEach(button => {
        button.addEventListener("click", function () {
            const targetId = this.getAttribute("data-bs-target");
            const targetElement = document.querySelector(targetId);

            setTimeout(() => {
                if (targetElement.classList.contains("show")) {
                    this.innerText = "Hide";
                } else {
                    this.innerText = "View";
                }
            }, 300);
        });
    });

    // ===============================
    // COMPLIANCE HARD RULE ALERT
    // ===============================

    const blockedBadges = document.querySelectorAll(".badge-blocked");

    if (blockedBadges.length > 0) {
        console.warn("Compliance Alert: Blocked requests detected.");
    }

});
