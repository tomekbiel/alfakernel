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

  
});
