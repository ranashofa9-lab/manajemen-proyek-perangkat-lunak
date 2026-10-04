/**
 * YUNDA FASHION - FRONTEND & DIGITAL TWIN CONTROLLER (Point 2)
 * Bertanggung jawab atas:
 * 1. Rendering visual Digital Twin Etalase Toko (Store Layout Grid)
 * 2. Logika otomatis indikator warna stok (Hijau, Kuning, Merah)
 * 3. Responsivitas dan interaktivitas katalog produk & varian
 * 4. Integrasi siap pakai untuk REST API (Orang 3), DB MySQL (Orang 1), dan QR/WA (Orang 4)
 * 
 * Kompatibel untuk langsung dibuka via Klik Ganda (file://) maupun Web Server (http://)
 */

(function() {
  const { INITIAL_PRODUCTS, STORE_RACKS, CATEGORIES } = window.YUNDA_DATA || {
    INITIAL_PRODUCTS: [],
    STORE_RACKS: [],
    CATEGORIES: []
  };

  // --- STATE MANAGEMENT ---
  const state = {
    products: [],
    racks: STORE_RACKS,
    currentCategory: "Semua",
    currentStatus: "all",
    searchQuery: "",
    selectedRackId: null,
    activeView: "digital-twin", // 'digital-twin', 'catalog', 'table'
    theme: "dark",
    apiUrl: "http://localhost:3000/api/products", // Default REST API endpoint Orang 3
    isApiMode: false,
    waAlertLogs: []
  };

  // --- LOGIKA INDIKATOR WARNA STOK OTOMATIS ---
  /**
   * Menghitung status stok berdasarkan kuantitas:
   * - Hijau (Safe): Stok >= 10 (atau di atas threshold aman)
   * - Kuning (Warning): Stok antara 4 s/d 9 (atau <= minStock) -> Menipis / Reorder Point
   * - Merah (Critical): Stok <= 3 atau Habis (0) -> Kritis, butuh restok segera!
   */
  function getStockStatus(stock, minStock = 5) {
    if (stock <= 3) {
      return {
        status: "critical",
        label: "Kritis",
        badgeClass: "critical",
        color: "#ef4444",
        glowClass: "stock-critical-glow",
        message: "Stok Kritis! Segera Restok"
      };
    } else if (stock <= Math.max(minStock, 9)) {
      return {
        status: "warning",
        label: "Menipis",
        badgeClass: "warning",
        color: "#f59e0b",
        glowClass: "stock-warning-glow",
        message: "Stok Menipis (Reorder Point)"
      };
    } else {
      return {
        status: "safe",
        label: "Stok Aman",
        badgeClass: "safe",
        color: "#10b981",
        glowClass: "stock-safe-glow",
        message: "Stok Aman"
      };
    }
  }

  /**
   * Menghitung total stok produk dari seluruh varian
   */
  function getProductTotalStock(product) {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce((acc, curr) => acc + Number(curr.stock || 0), 0);
  }

  /**
   * Menghitung status agregat sebuah produk berdasarkan varian terendahnya
   */
  function getProductOverallStatus(product) {
    const totalStock = getProductTotalStock(product);
    
    // Jika ada salah satu varian yang kritis (<= 3), kita tandai waspada
    const hasCriticalVariant = product.variants.some(v => v.stock <= 3);
    const hasWarningVariant = product.variants.some(v => v.stock > 3 && v.stock <= (product.minStock || 6));

    if (hasCriticalVariant || totalStock <= 5) {
      return getStockStatus(Math.min(...product.variants.map(v => v.stock)), product.minStock);
    } else if (hasWarningVariant || totalStock <= 12) {
      return {
        status: "warning",
        label: "Menipis",
        badgeClass: "warning",
        color: "#f59e0b",
        message: "Sebagian Varian Menipis"
      };
    }
    return {
      status: "safe",
      label: "Stok Aman",
      badgeClass: "safe",
      color: "#10b981",
      message: "Semua Varian Aman"
    };
  }

  // --- INITIALIZATION ---
  document.addEventListener("DOMContentLoaded", () => {
    loadInitialData();
    setupEventListeners();
    renderAll();
  });

  function loadInitialData() {
    const saved = localStorage.getItem("yunda_fashion_products");
    if (saved) {
      try {
        state.products = JSON.parse(saved);
      } catch (e) {
        state.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
      }
    } else {
      state.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
      saveStateToLocalStorage();
    }
  }

  function saveStateToLocalStorage() {
    localStorage.setItem("yunda_fashion_products", JSON.stringify(state.products));
  }

  // --- RENDERING CORE ---
  function renderAll() {
    renderStats();
    renderDigitalTwinFloorplan();
    renderCategoryFilterPills();
    renderProductGrid();
    renderProductTable();
  }

  // 1. Render Summary Stats Counter
  function renderStats() {
    let totalItemsCount = 0;
    let totalStockCount = 0;
    let safeCount = 0;
    let warningCount = 0;
    let criticalCount = 0;

    state.products.forEach(p => {
      totalItemsCount++;
      const totalStock = getProductTotalStock(p);
      totalStockCount += totalStock;
      const statusObj = getProductOverallStatus(p);

      if (statusObj.status === "safe") safeCount++;
      else if (statusObj.status === "warning") warningCount++;
      else if (statusObj.status === "critical") criticalCount++;
    });

    const totalEl = document.getElementById("stat-total-products");
    const stockEl = document.getElementById("stat-total-stock");
    const safeEl = document.getElementById("stat-safe-count");
    const warningEl = document.getElementById("stat-warning-count");
    const criticalEl = document.getElementById("stat-critical-count");

    if (totalEl) totalEl.textContent = totalItemsCount;
    if (stockEl) stockEl.textContent = totalStockCount;
    if (safeEl) safeEl.textContent = safeCount;
    if (warningEl) warningEl.textContent = warningCount;
    if (criticalEl) criticalEl.textContent = criticalCount;
  }

  // 2. Render Digital Twin 2D Store Layout
  function renderDigitalTwinFloorplan() {
    const gridEl = document.getElementById("store-digital-twin-grid");
    if (!gridEl) return;

    gridEl.innerHTML = "";

    state.racks.forEach(rack => {
      // Cari produk di rak ini
      const rackProducts = state.products.filter(p => p.rackId === rack.id);
      const rackStockTotal = rackProducts.reduce((acc, p) => acc + getProductTotalStock(p), 0);
      
      // Hitung status rak
      let rackStatus = "safe";
      let statusLabel = "Stok Aman";
      
      if (rack.id === "area-kasir" || rack.id === "fitting-room") {
        rackStatus = "service";
        statusLabel = "Fasilitas";
      } else {
        const hasCritical = rackProducts.some(p => p.variants.some(v => v.stock <= 3));
        const hasWarning = rackProducts.some(p => p.variants.some(v => v.stock > 3 && v.stock <= (p.minStock || 6)));
        
        if (rackProducts.length === 0) {
          rackStatus = "safe";
          statusLabel = "Kosong";
        } else if (hasCritical) {
          rackStatus = "critical";
          statusLabel = "Ada Kritis!";
        } else if (hasWarning) {
          rackStatus = "warning";
          statusLabel = "Menipis";
        }
      }

      const percentage = rack.capacity > 0 ? Math.min(Math.round((rackStockTotal / rack.capacity) * 100), 100) : 0;
      const isSelected = state.selectedRackId === rack.id;

      const card = document.createElement("div");
      card.className = `rack-card ${rackStatus === "service" ? "service-zone" : ""} ${isSelected ? "selected" : ""}`;
      card.setAttribute("data-rack", rack.id);
      card.setAttribute("data-status", rackStatus);

      if (rackStatus === "service") {
        card.innerHTML = `
          <div class="rack-icon" style="margin: 0 auto; font-size: 1.4rem;">
            ${getIconSvg(rack.icon)}
          </div>
          <div class="rack-name" style="text-align: center; margin-top: 0.35rem;">${rack.name}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); text-align: center;">${rack.category}</div>
        `;
      } else {
        card.innerHTML = `
          <div class="rack-card-top">
            <div class="rack-title-box">
              <div class="rack-icon" style="color: ${rack.colorTheme}">
                ${getIconSvg(rack.icon)}
              </div>
              <div>
                <div class="rack-name">${rack.name}</div>
                <div class="rack-category-tag">${rack.category}</div>
              </div>
            </div>
            <span class="status-pill ${rackStatus}">
              <span class="legend-color ${rackStatus}" style="width:6px; height:6px;"></span>
              ${statusLabel}
            </span>
          </div>

          <div class="rack-metrics">
            <div class="rack-metric-row">
              <span style="color: var(--text-secondary);">Kapasitas Terisi</span>
              <span class="rack-stock-number">${rackStockTotal} <span style="font-size: 0.75rem; color: var(--text-muted);">/ ${rack.capacity} pcs</span></span>
            </div>
            <div class="stock-progress-track">
              <div class="stock-progress-fill ${rackStatus}" style="width: ${percentage}%"></div>
            </div>
          </div>

          <div class="rack-items-preview">
            <span>📦 ${rackProducts.length} Produk (${rackProducts.map(p => p.category).filter((v, i, a) => a.indexOf(v) === i).join(", ")})</span>
          </div>
        `;
      }

      card.addEventListener("click", () => {
        if (state.selectedRackId === rack.id) {
          state.selectedRackId = null; // Toggle unselect
        } else {
          state.selectedRackId = rack.id;
        }
        renderDigitalTwinFloorplan();
        renderProductGrid();
        renderProductTable();
        
        // Auto-scroll to catalog when rack is clicked
        const catalogEl = document.getElementById("catalog-section");
        if (catalogEl && state.selectedRackId) {
          catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      gridEl.appendChild(card);
    });
  }

  // 3. Render Category Filter Pills
  function renderCategoryFilterPills() {
    const container = document.getElementById("category-pills-bar");
    if (!container) return;

    container.innerHTML = "";

    CATEGORIES.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = `category-pill ${state.currentCategory === cat ? "active" : ""}`;
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        state.currentCategory = cat;
        renderCategoryFilterPills();
        renderProductGrid();
        renderProductTable();
      });
      container.appendChild(btn);
    });
  }

  // 4. Render Product Cards Grid
  function renderProductGrid() {
    const container = document.getElementById("products-grid");
    if (!container) return;

    const filtered = getFilteredProducts();
    container.innerHTML = "";

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; padding: 3rem; text-align: center; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
          <h3 style="margin-bottom: 0.25rem;">Tidak Ada Produk Ditemukan</h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem;">Coba ganti kata kunci pencarian, filter kategori, atau klik 'Reset Filter'.</p>
          <button id="btn-reset-filters" class="btn-action-primary" style="margin: 1rem auto 0;">Reset Semua Filter</button>
        </div>
      `;
      const resetBtn = document.getElementById("btn-reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          state.currentCategory = "Semua";
          state.currentStatus = "all";
          state.searchQuery = "";
          state.selectedRackId = null;
          const searchInput = document.getElementById("search-input");
          if (searchInput) searchInput.value = "";
          const statusSelect = document.getElementById("status-filter-select");
          if (statusSelect) statusSelect.value = "all";
          renderAll();
        });
      }
      return;
    }

    filtered.forEach(product => {
      const totalStock = getProductTotalStock(product);
      const overallStatus = getProductOverallStatus(product);

      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" />
          <span class="product-category-badge">${product.category}</span>
          <span class="product-status-badge">
            <span class="status-pill ${overallStatus.status}">
              <span class="legend-color ${overallStatus.status}" style="width:6px; height:6px;"></span>
              ${overallStatus.label} (${totalStock} pcs)
            </span>
          </span>
        </div>

        <div class="product-body">
          <div class="product-title-row">
            <span class="product-sku">${product.sku}</span>
            <h3 class="product-name">${product.name}</h3>
          </div>

          <div class="product-location-info">
            <span>📍 <strong>${product.rackName}</strong></span>
          </div>

          <!-- Variant Tags -->
          <div style="display: flex; flex-direction: column; gap: 0.35rem;">
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">STATUS VARIAN & STOK:</span>
            <div class="variants-tag-list">
              ${product.variants.map(v => {
                const vStatus = getStockStatus(v.stock, product.minStock);
                return `
                  <span class="variant-tag" title="${v.color} - Size ${v.size} (Stok: ${v.stock})">
                    <span class="variant-stock-dot ${vStatus.status}"></span>
                    <strong>${v.color}</strong> (${v.size}): <span style="font-weight: 700; color: ${vStatus.color};">${v.stock}</span>
                  </span>
                `;
              }).join("")}
            </div>
          </div>

          <div class="product-footer">
            <div class="product-price-box">
              <span class="price-label">Harga Jual</span>
              <span class="product-price">Rp ${formatNumber(product.price)}</span>
            </div>

            <div class="product-card-actions">
              <button class="btn-action-sm btn-view-qr" data-id="${product.id}" title="Lihat & Cetak QR Code (Modul Orang 4)">
                🔲
              </button>
              <button class="btn-action-primary btn-manage-stock" data-id="${product.id}">
                <span>⚙️ Kelola Stok</span>
              </button>
            </div>
          </div>
        </div>
      `;

      // Event Listener for Managing Stock
      const manageBtn = card.querySelector(".btn-manage-stock");
      manageBtn.addEventListener("click", () => {
        openVariantStockModal(product.id);
      });

      // Event Listener for QR Code
      const qrBtn = card.querySelector(".btn-view-qr");
      qrBtn.addEventListener("click", () => {
        openQrModal(product.id);
      });

      container.appendChild(card);
    });
  }

  // 5. Render Product Table View (Data Master View for Orang 1 & 3)
  function renderProductTable() {
    const tbody = document.getElementById("product-table-body");
    if (!tbody) return;

    const filtered = getFilteredProducts();
    tbody.innerHTML = "";

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Tidak ada data produk yang cocok</td></tr>`;
      return;
    }

    filtered.forEach((p, idx) => {
      const totalStock = getProductTotalStock(p);
      const overallStatus = getProductOverallStatus(p);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>#${idx + 1}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <img src="${p.image}" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover;" />
            <div>
              <div style="font-weight: 700; color: var(--text-primary);">${p.name}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">${p.sku}</div>
            </div>
          </div>
        </td>
        <td><span class="category-pill" style="font-size: 0.72rem; padding: 0.2rem 0.6rem;">${p.category}</span></td>
        <td><span style="font-size: 0.8rem; color: var(--text-secondary);">${p.rackName}</span></td>
        <td>
          <span class="status-pill ${overallStatus.status}">
            <span class="legend-color ${overallStatus.status}" style="width:6px; height:6px;"></span>
            ${overallStatus.label} (${totalStock} pcs)
          </span>
        </td>
        <td><strong>Rp ${formatNumber(p.price)}</strong></td>
        <td>
          <div style="display: flex; gap: 0.35rem;">
            <button class="btn-action-sm btn-tbl-manage" data-id="${p.id}" title="Restok / Jual">⚙️</button>
            <button class="btn-action-sm btn-tbl-qr" data-id="${p.id}" title="QR Code">🔲</button>
          </div>
        </td>
      `;

      tr.querySelector(".btn-tbl-manage").addEventListener("click", () => openVariantStockModal(p.id));
      tr.querySelector(".btn-tbl-qr").addEventListener("click", () => openQrModal(p.id));

      tbody.appendChild(tr);
    });
  }

  // --- FILTER HELPER ---
  function getFilteredProducts() {
    return state.products.filter(product => {
      // 1. Kategori Filter
      const matchCategory = state.currentCategory === "Semua" || product.category === state.currentCategory;

      // 2. Rack Filter (Digital Twin interaction)
      const matchRack = !state.selectedRackId || product.rackId === state.selectedRackId;

      // 3. Search Filter (Search name, SKU, category, variant color)
      const q = state.searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        product.name.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.variants.some(v => v.color.toLowerCase().includes(q) || v.size.toLowerCase().includes(q))
      );

      // 4. Status Filter (Aman, Menipis, Kritis)
      const overallStatus = getProductOverallStatus(product);
      let matchStatus = true;
      if (state.currentStatus === "safe") matchStatus = overallStatus.status === "safe";
      else if (state.currentStatus === "warning") matchStatus = overallStatus.status === "warning";
      else if (state.currentStatus === "critical") matchStatus = overallStatus.status === "critical";

      return matchCategory && matchRack && matchSearch && matchStatus;
    });
  }

  // --- MODAL DIALOGS ---

  /**
   * Modal Kelola Stok Varian & Simulasi Restok / Terjual
   */
  function openVariantStockModal(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("stock-modal");
    const modalTitle = document.getElementById("stock-modal-title");
    const modalBody = document.getElementById("stock-modal-body");

    modalTitle.innerHTML = `📦 Kelola Stok: <span style="color: var(--brand-primary);">${product.name}</span>`;

    modalBody.innerHTML = `
      <div style="display: flex; gap: 1rem; align-items: center; background: var(--bg-surface-elevated); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
        <img src="${product.image}" style="width: 56px; height: 56px; border-radius: 8px; object-fit: cover;" />
        <div style="flex: 1;">
          <div style="font-size: 0.78rem; color: var(--text-muted); font-family: monospace;">SKU: ${product.sku} | Rak: ${product.rackName}</div>
          <div style="font-weight: 700; font-size: 1rem;">Batas Minimum Reorder: ${product.minStock} pcs</div>
        </div>
      </div>

      <table class="variant-table">
        <thead>
          <tr>
            <th>Varian & Warna</th>
            <th>Ukuran</th>
            <th>Stok Saat Ini</th>
            <th>Indikator</th>
            <th style="text-align: right;">Aksi Cepat</th>
          </tr>
        </thead>
        <tbody>
          ${product.variants.map((v, index) => {
            const vStatus = getStockStatus(v.stock, product.minStock);
            return `
              <tr>
                <td><strong>${v.color}</strong></td>
                <td><span class="category-pill" style="padding: 0.15rem 0.5rem; font-size: 0.75rem;">${v.size}</span></td>
                <td>
                  <span id="stock-val-${product.id}-${index}" style="font-size: 1.1rem; font-weight: 800; font-family: 'Outfit', sans-serif; color: ${vStatus.color};">
                    ${v.stock}
                  </span> pcs
                </td>
                <td>
                  <span id="badge-val-${product.id}-${index}" class="status-pill ${vStatus.status}">
                    ${vStatus.label}
                  </span>
                </td>
                <td style="text-align: right;">
                  <div class="stock-stepper">
                    <button class="step-btn btn-stock-dec" data-prod-id="${product.id}" data-var-index="${index}" title="Jual 1 pcs (Stok Berkurang)">-</button>
                    <span class="step-value" id="stepper-count-${product.id}-${index}">${v.stock}</span>
                    <button class="step-btn btn-stock-inc" data-prod-id="${product.id}" data-var-index="${index}" title="Restok +1 pcs (Stok Bertambah)">+</button>
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>

      <div style="background: rgba(129, 140, 248, 0.08); border: 1px dashed var(--border-glow); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--text-secondary);">
        💡 <strong>Simulasi Transaksi Terhubung:</strong> Saat stok diubah di sini, indikator warna di Etalase Digital Twin, badge kartu, dan notifikasi Smart WhatsApp (Orang 4) akan terupdate secara real-time.
      </div>
    `;

    // Attach Stepper Listeners
    modalBody.querySelectorAll(".btn-stock-dec").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const pId = e.currentTarget.getAttribute("data-prod-id");
        const vIdx = parseInt(e.currentTarget.getAttribute("data-var-index"), 10);
        adjustVariantStock(pId, vIdx, -1);
      });
    });

    modalBody.querySelectorAll(".btn-stock-inc").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const pId = e.currentTarget.getAttribute("data-prod-id");
        const vIdx = parseInt(e.currentTarget.getAttribute("data-var-index"), 10);
        adjustVariantStock(pId, vIdx, +1);
      });
    });

    modal.classList.add("active");
  }

  /**
   * Update stock for a specific variant with live color status check
   */
  function adjustVariantStock(productId, variantIndex, delta) {
    const product = state.products.find(p => p.id === productId);
    if (!product || !product.variants[variantIndex]) return;

    const current = Number(product.variants[variantIndex].stock || 0);
    const newStock = Math.max(0, current + delta);
    product.variants[variantIndex].stock = newStock;

    saveStateToLocalStorage();
    renderAll();

    // If modal is currently open, update its elements
    const stockValEl = document.getElementById(`stock-val-${productId}-${variantIndex}`);
    const badgeValEl = document.getElementById(`badge-val-${productId}-${variantIndex}`);
    const stepperCountEl = document.getElementById(`stepper-count-${productId}-${variantIndex}`);

    if (stockValEl && badgeValEl && stepperCountEl) {
      const vStatus = getStockStatus(newStock, product.minStock);
      stockValEl.textContent = newStock;
      stockValEl.style.color = vStatus.color;
      stepperCountEl.textContent = newStock;
      
      badgeValEl.className = `status-pill ${vStatus.status}`;
      badgeValEl.textContent = vStatus.label;
    }

    // Cek apakah stok baru memicu Merah / Kritis -> Trigger WhatsApp Alert Simulation
    if (newStock <= 3 && delta < 0) {
      triggerWhatsAppAlertNotification(product, product.variants[variantIndex]);
    }
  }

  /**
   * WhatsApp Alert Simulation (Orang 4 Gateway Integration)
   */
  function triggerWhatsAppAlertNotification(product, variant) {
    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const alertMsg = `🚨 *[PERINGATAN STOK KRITIS YUNDA FASHION]*\n\nProduk: *${product.name}*\nVarian: *${variant.color} (${variant.size})*\nLokasi: *${product.rackName}*\nSisa Stok: *${variant.stock} PCS (KRITIS)*\n\n_Pesan otomatis dikirim dari Smart Stock Alert Gateway pada ${timestamp}._ Segera lakukan pemesanan restok ke supplier!`;

    state.waAlertLogs.unshift({
      time: timestamp,
      productName: product.name,
      variantName: `${variant.color} (${variant.size})`,
      stock: variant.stock,
      rackName: product.rackName,
      fullMessage: alertMsg
    });

    showToastNotification(`⚠️ Stok Kritis: ${product.name} (${variant.color}) sisa ${variant.stock} pcs! Notifikasi WA disiapkan.`, "critical");
  }

  /**
   * QR Code Sticker Generator Modal (Orang 4 Scanner Feature)
   */
  function openQrModal(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("qr-modal");
    const modalTitle = document.getElementById("qr-modal-title");
    const modalBody = document.getElementById("qr-modal-body");

    modalTitle.innerHTML = `🔲 QR Code Varian: <span style="color: var(--brand-primary);">${product.name}</span>`;

    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <p style="font-size: 0.85rem; color: var(--text-secondary);">Stiker QR Code unik per varian untuk dipindai oleh Kamera HP / Barcode Scanner (Modul Orang 4).</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
        ${product.variants.map(v => `
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.6rem;">
            <div style="background: white; padding: 0.75rem; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
              <!-- SVG QR Placeholder with Real QR Matrix Pattern -->
              <svg width="120" height="120" viewBox="0 0 100 100" fill="#000000">
                <rect width="100" height="100" fill="#ffffff"/>
                <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" fill="#000"/>
                <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" fill="#000"/>
                <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" fill="#000"/>
                <rect x="45" y="15" width="8" height="15"/>
                <rect x="45" y="45" width="10" height="10"/>
                <rect x="65" y="45" width="20" height="8"/>
                <rect x="55" y="65" width="12" height="20"/>
                <rect x="75" y="70" width="15" height="15"/>
              </svg>
            </div>
            <div style="font-weight: 700; font-size: 0.9rem;">${v.color} - ${v.size}</div>
            <div style="font-family: monospace; font-size: 0.75rem; color: var(--text-muted);">${v.qrCode}</div>
            <span class="status-pill safe" style="font-size: 0.7rem;">Stok: ${v.stock} pcs</span>
          </div>
        `).join("")}
      </div>
    `;

    modal.classList.add("active");
  }

  /**
   * Toast Notification Popup
   */
  function showToastNotification(message, type = "safe") {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `stat-card ${type}`;
    toast.style.cssText = `
      min-width: 300px;
      padding: 0.85rem 1.15rem;
      box-shadow: var(--shadow-lg);
      border-left: 4px solid ${type === 'critical' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981'};
      background: var(--bg-surface);
      margin-top: 0.5rem;
      animation: fadeIn 0.3s ease;
    `;
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.2rem;">${type === 'critical' ? '🚨' : type === 'warning' ? '⚠️' : '✅'}</span>
        <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-primary);">${message}</div>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Navigation Tabs
    const navTabs = document.querySelectorAll(".nav-tab-btn");
    navTabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        navTabs.forEach(t => t.classList.remove("active"));
        e.currentTarget.classList.add("active");
        const targetView = e.currentTarget.getAttribute("data-view");
        switchView(targetView);
      });
    });

    // Search Input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        renderProductGrid();
        renderProductTable();
      });
    }

    // Stock Status Filter Select
    const statusSelect = document.getElementById("status-filter-select");
    if (statusSelect) {
      statusSelect.addEventListener("change", (e) => {
        state.currentStatus = e.target.value;
        renderProductGrid();
        renderProductTable();
      });
    }

    // Theme Toggle
    const themeToggleBtn = document.getElementById("btn-theme-toggle");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const isDark = document.body.getAttribute("data-theme") !== "light";
        const newTheme = isDark ? "light" : "dark";
        document.body.setAttribute("data-theme", newTheme);
        themeToggleBtn.textContent = newTheme === "light" ? "🌙" : "☀️";
      });
    }

    // Close Modals
    document.querySelectorAll(".modal-close-btn, .modal-overlay").forEach(el => {
      el.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal-overlay") || e.target.classList.contains("modal-close-btn") || e.target.closest(".modal-close-btn")) {
          document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
        }
      });
    });

    // WA Alert History Modal Trigger
    const waModalBtn = document.getElementById("btn-wa-alerts");
    if (waModalBtn) {
      waModalBtn.addEventListener("click", () => {
        openWhatsAppAlertHistoryModal();
      });
    }

    // Simulation Trigger: Mass Sale (Kritis Trigger)
    const simSaleBtn = document.getElementById("btn-sim-critical");
    if (simSaleBtn) {
      simSaleBtn.addEventListener("click", () => {
        // Simulate heavy sales on Gamis Abaya & Kemeja Rayon to trigger Merah
        state.products.forEach(p => {
          if (p.id === "PROD-005" || p.id === "PROD-001" || p.id === "PROD-004") {
            p.variants.forEach(v => {
              v.stock = Math.min(v.stock, Math.floor(Math.random() * 3));
            });
          }
        });
        saveStateToLocalStorage();
        renderAll();
        showToastNotification("💥 Simulasi Terjual Massal: Beberapa produk langsung turun ke level MERAH (Kritis)!", "critical");
      });
    }

    // Simulation Trigger: Restok Semua
    const simRestockBtn = document.getElementById("btn-sim-restock");
    if (simRestockBtn) {
      simRestockBtn.addEventListener("click", () => {
        state.products.forEach(p => {
          p.variants.forEach(v => {
            v.stock = Math.max(v.stock, 15 + Math.floor(Math.random() * 10));
          });
        });
        saveStateToLocalStorage();
        renderAll();
        showToastNotification("📦 Simulasi Restok Massal: Seluruh stok produk terisi penuh (HIJAU / AMAN)!", "safe");
      });
    }

    // Reset Data to Original Initial State
    const resetDataBtn = document.getElementById("btn-reset-data");
    if (resetDataBtn) {
      resetDataBtn.addEventListener("click", () => {
        if (confirm("Kembalikan seluruh data stok dan etalase ke pengaturan awal?")) {
          state.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
          saveStateToLocalStorage();
          renderAll();
          showToastNotification("Data master & stok berhasil di-reset ke data bawaan!", "safe");
        }
      });
    }
  }

  function switchView(viewName) {
    state.activeView = viewName;
    const twinSection = document.getElementById("digital-twin-section");
    const catalogSection = document.getElementById("catalog-section");
    const tableSection = document.getElementById("table-section");

    if (viewName === "digital-twin") {
      if (twinSection) twinSection.style.display = "flex";
      if (catalogSection) catalogSection.style.display = "flex";
      if (tableSection) tableSection.style.display = "none";
    } else if (viewName === "catalog") {
      if (twinSection) twinSection.style.display = "none";
      if (catalogSection) catalogSection.style.display = "flex";
      if (tableSection) tableSection.style.display = "none";
    } else if (viewName === "table") {
      if (twinSection) twinSection.style.display = "none";
      if (catalogSection) catalogSection.style.display = "none";
      if (tableSection) tableSection.style.display = "flex";
    }
  }

  function openWhatsAppAlertHistoryModal() {
    const modal = document.getElementById("wa-modal");
    const modalBody = document.getElementById("wa-modal-body");

    if (state.waAlertLogs.length === 0) {
      modalBody.innerHTML = `
        <div style="text-align: center; padding: 2.5rem; color: var(--text-secondary);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🟢</div>
          <h4>Belum Ada Peringatan Kritis</h4>
          <p style="font-size: 0.85rem; margin-top: 0.25rem;">Semua stok dalam keadaan aman atau belum ada transaksi yang menurunkan stok ke level Merah (<= 3 pcs).</p>
        </div>
      `;
    } else {
      modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          ${state.waAlertLogs.map(log => `
            <div class="wa-alert-banner">
              <span class="wa-icon">💬</span>
              <div style="flex: 1; font-size: 0.82rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                  <strong style="color: #25d366;">WhatsApp Gateway Auto-Alert</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${log.time}</span>
                </div>
                <pre style="background: rgba(0,0,0,0.3); padding: 0.6rem; border-radius: 6px; font-family: monospace; white-space: pre-wrap; font-size: 0.78rem; border-left: 3px solid #25d366;">${log.fullMessage}</pre>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    modal.classList.add("active");
  }

  // --- UTILITIES ---
  function formatNumber(num) {
    return new Intl.NumberFormat("id-ID").format(num);
  }

  function getIconSvg(iconName) {
    switch (iconName) {
      case "sparkles":
        return "✨";
      case "shirt":
        return "👔";
      case "layers":
        return "👗";
      case "grid":
        return "👖";
      case "package":
        return "📦";
      case "credit-card":
        return "💳";
      case "user":
        return "🪞";
      default:
        return "🏷️";
    }
  }

  // Expose adjustVariantStock and openVariantStockModal to global window if needed
  window.YundaApp = {
    adjustVariantStock,
    openVariantStockModal,
    openQrModal,
    showToastNotification
  };
})();
