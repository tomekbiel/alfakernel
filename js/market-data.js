document.addEventListener("DOMContentLoaded", () => {
  const symbols = [
    "US.100+", "OIL.WTI+", "VIX+", "EURUSD+", "MEXComp+", "GOLDs+", "SILVERs+",
    "BRAComp+", "CZKCASH+", "DE.30+", "EU.50+", "FRA.40+", "ITA.40+",
    "NED25+", "SPA.35+", "SUI20+", "UK.100+", "US.30+", "COTTONs+", "US2000+",
    "W.20+", "WHEAT+", "COCOA+", "COFFEE+", "COPPER+", "CORN+", "EMISS+", "NICKEL+", "OILs+",
    "NATGAS+", "PLATINUM+", "SOYBEAN+", "SUGARs+", "ZINC+", "BUND10Y+", "SCHATZ2Y+", "USDIDX+",
    "AUT20+", "PALLADIUM+", "DE40+", "AUDUSD+", "EURCHF+", "EURGBP+", "EURJPY+", "GBPUSD+",
    "NZDUSD+", "USDCAD+", "USDCHF+", "USDJPY+", "US.500+"
  ];

  const HFD_SYMBOLS = [
    "US.100+", "EURUSD+", "OIL.WTI+", "OILs+", "GOLDs+", "US.500+",
    "US.30+", "DE.30+", "JAP225+", "VIX+", "W.20+", "EURPLN+", "USDJPY+"
  ];

  const symbolSelect = document.getElementById("symbol-select");
  const timeframeSelect = document.getElementById("timeframe-select");
  const loadBtn = document.getElementById("load-data-btn");
  const downloadBtn = document.getElementById("download-data-btn");
  const metaDiv = document.getElementById("data-meta");
  const previewDiv = document.getElementById("data-preview");

  // Populate symbols in the dropdown
  symbols.forEach(symbol => {
    const option = document.createElement("option");
    option.value = symbol;
    option.textContent = symbol;
    symbolSelect.appendChild(option);
  });

  // Wypełnij wszystkie selektory symboli tą samą listą
  ['symbol-select', 'hfd-symbol-select', 'hfd-cleaned-symbol-select'].forEach(selectId => {
    const select = document.getElementById(selectId);
    if (select) {
        symbols.forEach(symbol => {
            const option = document.createElement("option");
            option.value = symbol;
            option.textContent = symbol;
            select.appendChild(option);
        });
    }
});

  // Function to fetch the latest CSV file URL and last commit date
  const getLatestFileUrl = async (symbol, timeframe) => {
    const folderSymbol = encodeURIComponent(symbol);
    const apiUrl = `https://api.github.com/repos/tomekbiel/MT4_Trading_System/contents/data/historical/${folderSymbol}/${timeframe}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Could not fetch file list");
      const files = await response.json();
      const csvFiles = files.filter(file => file.name.endsWith('.csv'));
      if (csvFiles.length === 0) throw new Error("No CSV files found");

      // We take the first file (or you can sort if needed)
      const file = csvFiles[0];

      // Get last commit date for this file
      let lastUpdated = 'Unknown';
      try {
        const commitsApi = `https://api.github.com/repos/tomekbiel/MT4_Trading_System/commits?path=data/historical/${folderSymbol}/${timeframe}/${file.name}&per_page=1`;
        const commitsRes = await fetch(commitsApi);
        if (commitsRes.ok) {
          const commits = await commitsRes.json();
          if (commits.length > 0) {
            lastUpdated = new Date(commits[0].commit.committer.date).toLocaleString() + ' UTC';
          }
        }
      } catch (e) {
        // leave as Unknown
      }

      return {
        rawUrl: file.download_url,
        githubUrl: `https://github.com/tomekbiel/MT4_Trading_System/blob/master/data/historical/${folderSymbol}/${timeframe}/${file.name}`,
        filename: file.name,
        lastUpdated
      };
    } catch (error) {
      console.error("Error fetching file list:", error);
      throw error;
    }
  };

  // Parse CSV and extract metadata, show last 20 rows (newest first)
  const parseCSV = (csv) => {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map(line => line.split(","));
    // Show last 20 rows, newest first
    const previewRows = rows.slice(-20).reverse();

    // Extract metadata
    const timestamps = rows.map(r => r[0]);
    const fromDate = timestamps[0];
    const toDate = timestamps[timestamps.length - 1];
    const naCount = rows.reduce((count, row) =>
      count + row.filter(cell => cell.trim() === 'NA').length, 0);

    return {
      headers,
      rows: previewRows,
      meta: {
        fromDate,
        toDate,
        rowCount: rows.length,
        naCount,
        columnDescriptions: {
          '0': 'Timestamp (UTC)',
          '1': 'Open price',
          '2': 'High price',
          '3': 'Low price',
          '4': 'Close price',
          '5': 'Volume'
        }
      }
    };
  };

  // Load data and show preview
  loadBtn.addEventListener("click", async () => {
    const symbol = symbolSelect.value;
    const tf = timeframeSelect.value;
    try {
      const { rawUrl, filename, lastUpdated } = await getLatestFileUrl(symbol, tf);
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error("Could not fetch CSV data");
      const csv = await response.text();
      const { headers, rows, meta } = parseCSV(csv);

      metaDiv.innerHTML = `
        <div class="meta-container">
          <div class="meta-item">
            <strong>Selected Data:</strong> ${symbol} (${tf})
          </div>
          <div class="meta-item">
            <strong>Time Range:</strong> ${meta.fromDate} to ${meta.toDate}
          </div>
          <div class="meta-item">
            <strong>Records:</strong> ${meta.rowCount} entities
          </div>
          <div class="meta-item">
            <strong>Columns:</strong> ${headers.join(', ')}
          </div>
          <div class="meta-item">
            <strong>Data Quality:</strong> ${meta.naCount > 0 ?
              `Contains ${meta.naCount} NA values` : 'No NA values detected'}
          </div>
          <div class="meta-item">
            <strong>Source:</strong> MetaTrader 4 (XTB Demo Server)
          </div>
          <div class="meta-item">
            <strong>Last Updated:</strong> ${lastUpdated}
          </div>
          <div class="meta-item">
            <strong>Filename:</strong> ${filename}
          </div>
        </div>
      `;

      // Display preview table
      let table = "<table><thead><tr>";
      headers.forEach(h => table += `<th>${h}</th>`);
      table += "</tr></thead><tbody>";
      rows.forEach(r => {
        table += "<tr>";
        r.forEach((cell, i) => {
          const isNA = cell.trim() === 'NA';
          table += `<td class="${isNA ? 'na-value' : ''}">${cell}</td>`;
        });
        table += "</tr>";
      });
      table += "</tbody></table>";
      previewDiv.innerHTML = table;

    } catch (error) {
      metaDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
      previewDiv.innerHTML = "";
    }
  });

  // Download CSV from GitHub
  downloadBtn.addEventListener("click", async () => {
    const symbol = symbolSelect.value;
    const tf = timeframeSelect.value;
    try {
      const { rawUrl, filename } = await getLatestFileUrl(symbol, tf);

      // Pobierz plik jako blob
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error("Could not fetch CSV data");
      const blob = await response.blob();

      // Utwórz tymczasowy link do pobrania blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      metaDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
  });

  // Funkcja do pobierania CSV
  document.getElementById('download-data-btn').onclick = function () {
    const symbol = document.getElementById('symbol-select').value;
    const tf = document.getElementById('timeframe-select').value;
    // Zakładamy, że pliki CSV są w folderze /csv/ o nazwie SYMBOL_TF.csv
    const url = `csv/${symbol}_${tf}.csv`;
    // Tworzymy ukryty link do pobrania
    const a = document.createElement('a');
    a.href = url;
    a.download = `${symbol}_${tf}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Funkcja do wyświetlania podglądu od końca (najświeższe dane na górze)
  function showPreviewTable(data) {
    // data to tablica obiektów lub tablica tablic (wiersze)
    // Odwracamy kolejność
    const reversed = data.slice().reverse();
    // ...tworzenie tabeli na podstawie reversed...
    // Przykład:
    let html = '<table class="preview-table"><tbody>';
    reversed.forEach(row => {
        html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
    });
    html += '</tbody></table>';
    document.getElementById('data-preview').innerHTML = html;
  }

  // Wypełnij selektor symboli HFD
  const hfdSymbolSelect = document.getElementById("hfd-symbol-select");
  HFD_SYMBOLS.forEach(symbol => {
    const option = document.createElement("option");
    option.value = symbol;
    option.textContent = symbol;
    hfdSymbolSelect.appendChild(option);
  });

  // Po zmianie symbolu pobierz dostępne foldery/pliki
  hfdSymbolSelect.addEventListener("change", updateHfdFolders);
  updateHfdFolders(); // wywołaj na starcie

  async function updateHfdFolders() {
    const symbol = hfdSymbolSelect.value;
    const encodedSymbol = encodeURIComponent(symbol);
    const dateSelect = document.getElementById("date-select");
    dateSelect.innerHTML = '<option>Loading...</option>';

    // Pobierz listę plików z GitHub API (rekurencyjnie)
    const apiUrl = "https://api.github.com/repos/tomekbiel/MT4_Trading_System/contents/data/live";
    let folders = [];
    let foundFiles = [];

    async function fetchFolder(url, folderName = "") {
      const res = await fetch(url);
      const data = await res.json();
      for (const item of data) {
        if (item.type === "file" && (item.name === `${symbol}.csv` || item.name === `${symbol.replace('+','%2B')}.csv` || item.name === `${encodedSymbol}.csv`)) {
          foundFiles.push({
            folder: folderName || "live",
            path: item.path,
            download_url: item.download_url
          });
        }
        if (item.type === "dir") {
          await fetchFolder(item.url, item.name);
        }
      }
    }

    await fetchFolder(apiUrl);

    // Usuń duplikaty folderów
    folders = [...new Set(foundFiles.map(f => f.folder))];

    // Wypełnij selektor dat/folderów
    dateSelect.innerHTML = "";
    foundFiles.forEach(file => {
      const opt = document.createElement("option");
      opt.value = file.folder;
      opt.textContent = file.folder;
      opt.dataset.downloadUrl = file.download_url;
      dateSelect.appendChild(opt);
    });

    // Ustaw obsługę przycisku pobierania
    updateHfdDownloadBtn(foundFiles);
  }

  function updateHfdDownloadBtn(foundFiles) {
    const dateSelect = document.getElementById("date-select");
    const downloadBtn = document.getElementById("download-hfd-btn");
    if (!dateSelect || !downloadBtn) return;
    dateSelect.addEventListener("change", function() {
      const selected = dateSelect.selectedIndex;
      if (selected >= 0) {
        const url = dateSelect.options[selected].dataset.downloadUrl;
        downloadBtn.onclick = () => window.open(url, "_blank");
      }
    });
    // Ustaw od razu dla pierwszego wyboru
    if (dateSelect.options.length > 0) {
      const url = dateSelect.options[0].dataset.downloadUrl;
      downloadBtn.onclick = () => window.open(url, "_blank");
    }
  }

  function fillHfdSelects() {
    ["hfd-symbol-select", "hfd-cleaned-symbol-select"].forEach(selectId => {
      const select = document.getElementById(selectId);
      if (select) {
        select.innerHTML = "";
        HFD_SYMBOLS.forEach(symbol => {
          const option = document.createElement("option");
          option.value = symbol;
          option.textContent = symbol;
          select.appendChild(option);
        });
      }
    });
  }

  fillHfdSelects();

  function forceDownload(url, filename) {
    fetch(url)
      .then(resp => resp.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
  }

  // Przykład użycia:
  document.getElementById('download-hfd-btn').addEventListener('click', function(e) {
      e.preventDefault();
      const url = this.href;
      const filename = url.split('/').pop();
      forceDownload(url, filename);
  });

  // Funkcja do podglądu HFD (Raw)
  function previewHfdData(csv, previewDivId = "hfd-preview") {
    const lines = csv.trim().split("\n");
    if (lines.length < 2) return;
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map(line => line.split(","));
    // Ostatnie 20 wierszy, najnowsze na górze
    const previewRows = rows.slice(-20).reverse();

    let table = '<table class="preview-table"><thead><tr>';
    headers.forEach(h => table += `<th>${h}</th>`);
    table += "</tr></thead><tbody>";
    previewRows.forEach(r => {
        table += "<tr>";
        r.forEach(cell => {
            const isNA = cell.trim() === 'NA' || cell.trim() === 'NaN' || cell.trim() === 'null';
            table += `<td class="${isNA ? 'na-value' : ''}">${cell}</td>`;
        });
        table += "</tr>";
    });
    table += "</tbody></table>";

    document.getElementById(previewDivId).innerHTML = table;
  }

  // Funkcja do wyświetlania metadanych HFD
  function showHfdMeta({symbol, folder, filename, csv, lastUpdated, source="MetaTrader 4 (XTB Demo Server)"}) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1);
    const records = rows.length;
    const columns = headers.join(", ");
    const firstRow = rows[0] ? rows[0].split(",")[0] : "";
    const lastRow = rows[rows.length-1] ? rows[rows.length-1].split(",")[0] : "";
    const hasNA = csv.includes("NA") || csv.includes("NaN") || csv.includes("null");
    const dataQuality = hasNA ? "Missing values detected" : "No NA values detected";
    document.getElementById("hfd-meta").innerHTML = `
        <div class="meta-container">
          <div class="meta-item"><strong>Selected Data:</strong> ${symbol} (${folder})</div>
          <div class="meta-item"><strong>Time Range:</strong> ${firstRow} to ${lastRow}</div>
          <div class="meta-item"><strong>Records:</strong> ${records} entities</div>
          <div class="meta-item"><strong>Columns:</strong> ${columns}</div>
          <div class="meta-item"><strong>Data Quality:</strong> ${dataQuality}</div>
          <div class="meta-item"><strong>Source:</strong> ${source}</div>
          <div class="meta-item"><strong>Last Updated:</strong> ${lastUpdated || "Unknown"}</div>
          <div class="meta-item"><strong>Filename:</strong> ${filename}</div>
        </div>
    `;
}

// Przykład użycia w obsłudze przycisku Preview Data dla HFD (Raw)
document.getElementById('load-hfd-btn').addEventListener('click', async function() {
    const symbol = document.getElementById('hfd-symbol-select').value;
    const dateSelect = document.getElementById('date-select');
    const selected = dateSelect.selectedIndex;
    if (selected < 0) return;
    const folder = dateSelect.options[selected].value;
    const url = dateSelect.options[selected].dataset.downloadUrl;
    const filename = url.split('/').pop();
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Could not fetch CSV data");
        const csv = await response.text();
        // Jeśli masz info o dacie aktualizacji, pobierz je tutaj (np. z API GitHub)
        const lastUpdated = "Unknown";
        showHfdMeta({symbol, folder, filename, csv, lastUpdated});
        previewHfdData(csv, "hfd-preview");
    } catch (error) {
        document.getElementById("hfd-preview").innerHTML = `<div class="error">Error: ${error.message}</div>`;
        document.getElementById("hfd-meta").innerHTML = "";
    }
});
});
