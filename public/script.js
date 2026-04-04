const form = document.getElementById("alumniForm");
const tableBody = document.querySelector("#alumniTable tbody");
const searchInput = document.getElementById("searchName");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const statusEl = document.getElementById("statusMessage");
const submitBtn = document.getElementById("submitBtn");
const statusSelect = document.getElementById("status");
const totalCountEl = document.getElementById("totalCount");
const identifiedCountEl = document.getElementById("identifiedCount");
const verifyCountEl = document.getElementById("verifyCount");
const untrackedCountEl = document.getElementById("untrackedCount");
const authButton = document.getElementById("authButton");
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const cancelLogin = document.getElementById("cancelLogin");
const loginHint = document.getElementById("loginHint");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const detailModal = document.getElementById("detailModal");
const detailBody = document.getElementById("detailBody");
const detailName = document.getElementById("detailName");
const closeDetail = document.getElementById("closeDetail");

const ADMIN_TOKEN_KEY = "alumniAdminToken";
const ADMIN_USER_KEY = "alumniAdminUser";
const BATCH_SIZE = 500;

let editingId = null;
let lastData = [];
let filteredData = [];
let currentQuery = "";

let currentPage = 1;
const rowsPerPage = 5;

let totalRecords = 0;
let latestStats = null;
let isLoadingBatch = false;

function getToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function setToken(token, user) {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    if (user) {
      localStorage.setItem(ADMIN_USER_KEY, user);
    }
    return;
  }
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

function isAdmin() {
  return Boolean(getToken());
}

function buildAuthHeaders(base = {}) {
  const token = getToken();
  if (!token) return base;
  return {
    ...base,
    Authorization: `Bearer ${token}`
  };
}

function extractYear(value) {
  const text = String(value ?? "").trim();
  const match = text.match(/(19|20)\d{2}/);
  return match ? match[0] : "";
}

function normalizeStatus(status) {
  if (!status) return "Belum Dilacak";
  if (status === "Teridentifikasi") return "Teridentifikasi";
  if (status === "Perlu Verifikasi") return "Perlu Verifikasi";
  if (status === "Belum Dilacak") return "Belum Dilacak";
  return "Belum Dilacak";
}

function getStatusClass(status) {
  if (status === "Teridentifikasi") return "status-identified";
  if (status === "Perlu Verifikasi") return "status-verify";
  return "status-untracked";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatValue(value) {
  const text = String(value ?? "").trim();
  if (!text) {
    return '<span class="muted">-</span>';
  }
  return escapeHtml(text);
}

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function validateGraduationYear(yearValue) {
  const yearString = String(yearValue ?? "").trim();
  const extracted = extractYear(yearString);
  const yearNumber = Number(extracted || yearString);
  const currentYear = new Date().getFullYear();

  if (!yearString) {
    return "Tahun lulus wajib diisi.";
  }

  if (!Number.isInteger(yearNumber)) {
    return "Tahun lulus harus berupa angka.";
  }

  if (yearNumber > currentYear) {
    return "Tahun lulus tidak boleh lebih besar dari tahun sekarang.";
  }

  return "";
}

function updateStatsFromData(data) {
  const total = data.length;
  let identified = 0;
  let verify = 0;
  let untracked = 0;

  data.forEach((item) => {
    const status = normalizeStatus(item.status);
    if (status === "Teridentifikasi") identified += 1;
    else if (status === "Perlu Verifikasi") verify += 1;
    else untracked += 1;
  });

  totalCountEl.textContent = total;
  identifiedCountEl.textContent = identified;
  verifyCountEl.textContent = verify;
  untrackedCountEl.textContent = untracked;
}

function updateStatsFromMeta(stats, total) {
  totalCountEl.textContent = total;
  identifiedCountEl.textContent = stats?.identified ?? 0;
  verifyCountEl.textContent = stats?.verify ?? 0;
  untrackedCountEl.textContent = stats?.untracked ?? 0;
}

function showLoginModal() {
  loginError.classList.add("hidden");
  loginForm.reset();
  loginModal.classList.remove("hidden");
}

function hideLoginModal() {
  loginModal.classList.add("hidden");
}

function showDetailModal(alumni) {
  if (!alumni) return;
  detailName.textContent = alumni.name || "-";
  detailBody.innerHTML = `
    <div class="detail-item"><span class="detail-label">NIM</span><span class="detail-value">${formatValue(alumni.studentId)}</span></div>
    <div class="detail-item"><span class="detail-label">Fakultas</span><span class="detail-value">${formatValue(alumni.faculty)}</span></div>
    <div class="detail-item"><span class="detail-label">Program Studi</span><span class="detail-value">${formatValue(alumni.program)}</span></div>
    <div class="detail-item"><span class="detail-label">Tahun Masuk</span><span class="detail-value">${formatValue(alumni.entryYear)}</span></div>
    <div class="detail-item"><span class="detail-label">Tanggal Lulus</span><span class="detail-value">${formatValue(alumni.graduationDate)}</span></div>
    <div class="detail-item"><span class="detail-label">Tahun Lulus</span><span class="detail-value">${formatValue(alumni.graduationYear)}</span></div>
    <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">${formatValue(alumni.email)}</span></div>
    <div class="detail-item"><span class="detail-label">No HP</span><span class="detail-value">${formatValue(alumni.phone)}</span></div>
    <div class="detail-item"><span class="detail-label">LinkedIn</span><span class="detail-value">${formatValue(alumni.socialLinkedin)}</span></div>
    <div class="detail-item"><span class="detail-label">Instagram</span><span class="detail-value">${formatValue(alumni.socialInstagram)}</span></div>
    <div class="detail-item"><span class="detail-label">Facebook</span><span class="detail-value">${formatValue(alumni.socialFacebook)}</span></div>
    <div class="detail-item"><span class="detail-label">TikTok</span><span class="detail-value">${formatValue(alumni.socialTiktok)}</span></div>
    <div class="detail-item"><span class="detail-label">Posisi</span><span class="detail-value">${formatValue(alumni.position)}</span></div>
    <div class="detail-item"><span class="detail-label">Tempat Bekerja</span><span class="detail-value">${formatValue(alumni.workplace)}</span></div>
    <div class="detail-item"><span class="detail-label">Alamat Bekerja</span><span class="detail-value">${formatValue(alumni.workplaceAddress)}</span></div>
    <div class="detail-item"><span class="detail-label">Status Pekerjaan</span><span class="detail-value">${formatValue(alumni.employmentType)}</span></div>
    <div class="detail-item"><span class="detail-label">Sosmed Tempat Bekerja</span><span class="detail-value">${formatValue(alumni.workplaceSocialMedia)}</span></div>
    <div class="detail-item"><span class="detail-label">Status Pelacakan</span><span class="detail-value">${formatValue(alumni.status)}</span></div>
  `;
  detailModal.classList.remove("hidden");
}

function hideDetailModal() {
  detailModal.classList.add("hidden");
}

function renderEmptyState(message) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="20" class="empty">${escapeHtml(message)}</td>
    </tr>
  `;
  updateStatsFromData([]);
  updatePaginationInfo(0);
}

function updateAuthUI() {
  const admin = isAdmin();
  authButton.textContent = admin ? "Logout Admin" : "Login Admin";
  loginHint.classList.toggle("hidden", admin);
  submitBtn.classList.toggle("hidden", !admin);

  form.querySelectorAll("input, select").forEach((input) => {
    input.disabled = !admin;
  });

  if (!admin) {
    resetFormMode();
  }

  if (lastData.length) {
    applyFilter();
    renderTable(getActiveData());
  }
}

function resetFormMode() {
  editingId = null;
  submitBtn.textContent = "Simpan Data";
  statusSelect.value = "Belum Dilacak";
}

function setEditMode(alumni) {
  if (!isAdmin()) {
    setStatus("Silakan login sebagai admin untuk mengubah data alumni.", "warning");
    return;
  }

  editingId = alumni.id;
  form.name.value = alumni.name || "";
  form.studentId.value = alumni.studentId || "";
  form.faculty.value = alumni.faculty || "";
  form.program.value = alumni.program || "";
  form.entryYear.value = alumni.entryYear || "";
  form.graduationDate.value = alumni.graduationDate || "";
  form.graduationYear.value = alumni.graduationYear || "";
  form.email.value = alumni.email || "";
  form.phone.value = alumni.phone || "";
  form.socialLinkedin.value = alumni.socialLinkedin || "";
  form.socialInstagram.value = alumni.socialInstagram || "";
  form.socialFacebook.value = alumni.socialFacebook || "";
  form.socialTiktok.value = alumni.socialTiktok || "";
  form.position.value = alumni.position || "";
  form.workplace.value = alumni.workplace || "";
  form.workplaceAddress.value = alumni.workplaceAddress || "";
  form.employmentType.value = alumni.employmentType || "";
  form.workplaceSocialMedia.value = alumni.workplaceSocialMedia || "";
  statusSelect.value = normalizeStatus(alumni.status);
  submitBtn.textContent = "Perbarui Data";
  setStatus("Mode edit: perbarui data lalu simpan.");
  document.getElementById("tambah-alumni").scrollIntoView({ behavior: "smooth" });
  form.name.focus();
}

function paginateData(data) {
  const start = (currentPage - 1) * rowsPerPage;
  return data.slice(start, start + rowsPerPage);
}

function getTotalDataCount() {
  if (currentQuery) return filteredData.length;
  if (totalRecords > 0) return totalRecords;
  return lastData.length;
}

function updatePaginationInfo(totalData) {
  const totalPages = Math.max(1, Math.ceil(totalData / rowsPerPage));
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= totalPages;
}

function getActiveData() {
  return currentQuery ? filteredData : lastData;
}

function applyFilter() {
  if (currentQuery) {
    filteredData = lastData.filter((item) =>
      String(item.name || "").toLowerCase().includes(currentQuery)
    );
  } else {
    filteredData = [];
  }
}

function renderTable(data) {
  const dataset = Array.isArray(data) ? data : [];
  tableBody.innerHTML = "";

  if (!dataset.length) {
    renderEmptyState("Data tidak ditemukan.");
    return;
  }

  updatePaginationInfo(getTotalDataCount());
  const paginated = paginateData(dataset);
  const admin = isAdmin();

  paginated.forEach((item) => {
    const statusClass = getStatusClass(item.status);
    const detailBtn = `<button class="btn ghost" data-action="detail" data-id="${item.id}">Detail</button>`;
    const actions = admin
      ? `${detailBtn}
         <button class="btn ghost" data-action="edit" data-id="${item.id}">Edit</button>
         <button class="btn danger" data-action="delete" data-id="${item.id}">Hapus</button>`
      : detailBtn;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatValue(item.name)}</td>
      <td>${formatValue(item.studentId)}</td>
      <td>${formatValue(item.faculty)}</td>
      <td>${formatValue(item.program)}</td>
      <td>${formatValue(item.entryYear)}</td>
      <td>${formatValue(item.graduationDate)}</td>
      <td>${formatValue(item.graduationYear)}</td>
      <td>${formatValue(item.email)}</td>
      <td>${formatValue(item.phone)}</td>
      <td>${formatValue(item.socialLinkedin)}</td>
      <td>${formatValue(item.socialInstagram)}</td>
      <td>${formatValue(item.socialFacebook)}</td>
      <td>${formatValue(item.socialTiktok)}</td>
      <td>${formatValue(item.position)}</td>
      <td>${formatValue(item.workplace)}</td>
      <td>${formatValue(item.workplaceAddress)}</td>
      <td>${formatValue(item.employmentType)}</td>
      <td>${formatValue(item.workplaceSocialMedia)}</td>
      <td><span class="status-pill ${statusClass}">${escapeHtml(item.status)}</span></td>
      <td>${actions}</td>
    `;
    tableBody.appendChild(row);
  });

  if (latestStats && !currentQuery && totalRecords > 0) {
    updateStatsFromMeta(latestStats, totalRecords);
  } else {
    updateStatsFromData(dataset);
  }
}

function handleUnauthorized(message) {
  setToken(null);
  updateAuthUI();
  setStatus(message || "Sesi login berakhir. Silakan login kembali.", "warning");
}

async function fetchBatch(offset) {
  const params = new URLSearchParams();
  params.set("limit", BATCH_SIZE);
  params.set("offset", offset);
  const url = `/alumni?${params.toString()}`;

  const response = await fetch(url, {
    headers: buildAuthHeaders()
  });

  if (response.status === 401) {
    handleUnauthorized("Silakan login untuk melihat data alumni.");
    return null;
  }

  if (!response.ok) {
    setStatus("Gagal memuat data alumni.", "error");
    return null;
  }

  const result = await response.json();

  if (Array.isArray(result)) {
    return { data: result, total: result.length, stats: null, isFull: true };
  }

  const batch = Array.isArray(result.data) ? result.data : [];
  const total = Number.isFinite(result.total) ? result.total : 0;
  const stats = result.stats || null;

  return { data: batch, total, stats, isFull: false };
}

async function fetchMoreData() {
  if (isLoadingBatch) return false;
  if (totalRecords && lastData.length >= totalRecords) return false;

  isLoadingBatch = true;
  try {
    const result = await fetchBatch(lastData.length);
    if (!result) return false;

    if (result.isFull) {
      lastData = result.data;
      totalRecords = result.total;
      latestStats = result.stats;
      return result.data.length > 0;
    }

    lastData = lastData.concat(result.data);
    if (result.total) {
      totalRecords = result.total;
    }
    if (result.stats) {
      latestStats = result.stats;
    }

    return result.data.length > 0;
  } finally {
    isLoadingBatch = false;
  }
}

async function ensureDataForPage(page) {
  if (currentQuery) return;
  const needed = page * rowsPerPage;
  if (lastData.length >= needed) return;
  await fetchMoreData();
}

async function loadAlumniData() {
  if (!isAdmin()) {
    renderEmptyState("Data alumni belum dimuat. Login admin untuk sinkronisasi.");
    return;
  }

  setStatus("Memuat data alumni...", "warning");
  currentPage = 1;
  currentQuery = "";
  searchInput.value = "";
  lastData = [];
  filteredData = [];
  totalRecords = 0;
  latestStats = null;

  const loaded = await fetchMoreData();
  if (!loaded) {
    renderEmptyState("Data tidak ditemukan.");
    setStatus("Data alumni belum tersedia.", "warning");
    return;
  }

  applyFilter();
  renderTable(getActiveData());
  setStatus("Data alumni berhasil dimuat.", "success");
}

async function verifySession() {
  const token = getToken();
  if (!token) return false;
  try {
    const response = await fetch("/auth", {
      headers: buildAuthHeaders()
    });

    if (!response.ok) {
      setToken(null);
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!isAdmin()) {
    setStatus("Silakan login sebagai admin untuk mengubah data alumni.", "warning");
    return;
  }

  const payload = {
    name: form.name.value.trim(),
    studentId: form.studentId.value.trim(),
    faculty: form.faculty.value.trim(),
    program: form.program.value.trim(),
    entryYear: form.entryYear.value.trim(),
    graduationDate: form.graduationDate.value.trim(),
    graduationYear: form.graduationYear.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    socialLinkedin: form.socialLinkedin.value.trim(),
    socialInstagram: form.socialInstagram.value.trim(),
    socialFacebook: form.socialFacebook.value.trim(),
    socialTiktok: form.socialTiktok.value.trim(),
    position: form.position.value.trim(),
    workplace: form.workplace.value.trim(),
    workplaceAddress: form.workplaceAddress.value.trim(),
    employmentType: form.employmentType.value,
    workplaceSocialMedia: form.workplaceSocialMedia.value.trim(),
    status: statusSelect.value
  };

  const yearError = validateGraduationYear(payload.graduationYear || payload.graduationDate);
  if (yearError) {
    setStatus(yearError, "error");
    return;
  }

  if (!payload.status) {
    setStatus("Status pelacakan wajib diisi.", "error");
    return;
  }

  const url = editingId ? `/alumni/${editingId}` : "/alumni";
  const method = editingId ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: buildAuthHeaders({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(payload)
    });

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    let result = null;
    try {
      result = await response.json();
    } catch (error) {
      result = null;
    }

    if (!response.ok) {
      setStatus(result?.message || "Gagal menyimpan data.", "error");
      return;
    }

    setStatus(editingId ? "Data alumni berhasil diperbarui." : "Data alumni berhasil disimpan.", "success");
    form.reset();
    resetFormMode();
    await loadAlumniData();
  } catch (error) {
    setStatus("Terjadi kesalahan pada server.", "error");
  }
});

searchBtn.addEventListener("click", () => {
  currentQuery = searchInput.value.trim().toLowerCase();
  currentPage = 1;
  applyFilter();
  renderTable(getActiveData());
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  currentQuery = "";
  filteredData = [];
  currentPage = 1;
  renderTable(getActiveData());
});

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    renderTable(getActiveData());
  }
});

nextPageBtn.addEventListener("click", async () => {
  const totalPages = Math.max(1, Math.ceil(getTotalDataCount() / rowsPerPage));
  if (currentPage < totalPages) {
    const nextPage = currentPage + 1;
    await ensureDataForPage(nextPage);
    applyFilter();
    currentPage = nextPage;
    renderTable(getActiveData());
  }
});

authButton.addEventListener("click", () => {
  if (isAdmin()) {
    setToken(null);
    setStatus("Logout berhasil.", "success");
    updateAuthUI();
    return;
  }

  showLoginModal();
});

cancelLogin.addEventListener("click", () => {
  hideLoginModal();
});

loginModal.addEventListener("click", (event) => {
  if (event.target === loginModal) {
    hideLoginModal();
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = loginForm.username.value.trim();
  const password = loginForm.password.value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      loginError.classList.remove("hidden");
      return;
    }

    const result = await response.json();
    setToken(result.token, result.user);
    hideLoginModal();
    setStatus("Login admin berhasil.", "success");
    updateAuthUI();
    await loadAlumniData();
  } catch (error) {
    loginError.classList.remove("hidden");
  }
});

detailModal.addEventListener("click", (event) => {
  if (event.target === detailModal) {
    hideDetailModal();
  }
});

closeDetail.addEventListener("click", () => {
  hideDetailModal();
});

// Event delegation for detail/edit/delete button
tableBody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.getAttribute("data-action");
  const id = target.getAttribute("data-id");
  if (!action || !id) return;

  const alumni = lastData.find((item) => String(item.id) === String(id));

  if (action === "detail") {
    if (alumni) {
      showDetailModal(alumni);
    }
    return;
  }

  if (!isAdmin()) {
    setStatus("Silakan login sebagai admin untuk mengubah data alumni.", "warning");
    return;
  }

  if (action === "edit") {
    if (alumni) {
      setEditMode(alumni);
    }
    return;
  }

  if (action === "delete") {
    const confirmed = window.confirm("Yakin ingin menghapus data alumni ini?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/alumni/${id}`, {
        method: "DELETE",
        headers: buildAuthHeaders()
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        setStatus(errorData.message || "Gagal menghapus data.", "error");
        return;
      }

      setStatus("Data alumni berhasil dihapus.", "success");
      await loadAlumniData();
    } catch (error) {
      setStatus("Terjadi kesalahan pada server.", "error");
    }
  }
});

async function init() {
  const hasSession = await verifySession();
  updateAuthUI();
  resetFormMode();
  if (hasSession) {
    await loadAlumniData();
  } else {
    renderEmptyState("Data alumni belum dimuat. Login admin untuk sinkronisasi.");
  }
}

init();
