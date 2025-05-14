document.addEventListener("DOMContentLoaded", () => {
  const symbols = [
    "US.100+", "OIL.WTI+", "VIX+", "EURUSD+", "MEXComp+", "GOLDs+", "SILVERs+", "AUS200+"
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

  // Function to fetch the latest CSV file URL
  const getLatestFileUrl = async (symbol, timeframe) => {
    const folderSymbol = encodeURIComponent(symbol);
    const apiUrl = `https://api.github.com/repos/tomekbiel/MT4_Trading_System/contents/data/historical/${folderSymbol}/${timeframe}`;
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Could not fetch file list");
      
      const files = await response.json();
      const csvFiles = files.filter(file => file.name.endsWith('.csv'));
      
      if (csvFiles.length === 0) throw new Error("No CSV files found");
      
      // Sort files by date (newest first)
      csvFiles.sort((a, b) => new Date(b.name) - new Date(a.name));
      
      return {
        rawUrl: csvFiles[0].download_url,
        githubUrl: `https://github.com/tomekbiel/MT4_Trading_System/blob/master/data/historical/${folderSymbol}/${timeframe}/${csvFiles[0].name}`,
        filename: csvFiles[0].name,
        lastUpdated: csvFiles[0].name.match(/\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/)[0].replace(/_/g, ' ')
      };
    } catch (error) {
      console.error("Error fetching file list:", error);
      throw error;
    }
  };

  // Function to parse CSV and extract metadata
  const parseCSV = (csv) => {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map(line => line.split(","));
    
    // Extract metadata
    const timestamps = rows.map(r => r[0]);
    const fromDate = timestamps[0];
    const toDate = timestamps[timestamps.length - 1];
    const naCount = rows.reduce((count, row) => 
      count + row.filter(cell => cell.trim() === 'NA').length, 0);
    
    return {
      headers,
      rows: rows.slice(0, 20), // Display only the first 20 rows
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

  // Load data
  loadBtn.addEventListener("click", async () => {
    const symbol = symbolSelect.value;
    const tf = timeframeSelect.value;
    
    try {
      const { rawUrl, filename, lastUpdated } = await getLatestFileUrl(symbol, tf);
      
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error("Could not fetch CSV data");
      
      const csv = await response.text();
      const { headers, rows, meta } = parseCSV(csv);
      
      // Display metadata
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
            <strong>Last Updated:</strong> ${lastUpdated} UTC
          </div>
          <div class="meta-item">
            <strong>Filename:</strong> ${filename}
          </div>
        </div>
      `;
      
      // Display data preview
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

  // Download data
  downloadBtn.addEventListener("click", async () => {
    const symbol = symbolSelect.value;
    const tf = timeframeSelect.value;
    
    try {
      const { rawUrl, filename } = await getLatestFileUrl(symbol, tf);
      
      // Create a temporary link for download
      const a = document.createElement('a');
      a.href = rawUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (error) {
      metaDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
  });
});
