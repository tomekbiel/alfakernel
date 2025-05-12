document.addEventListener("DOMContentLoaded", () => {
  const symbols = [
    "US.100+", "OIL.WTI+", "VIX+", "EURUSD+", "MEXComp+", "GOLDs+", "SILVERs+", "AUS200+",
    "BRAComp+", "CHNComp+", "CZKCASH+", "DE.30+", "EU.50+", "FRA.40+", "HKComp+", "ITA.40+",
    "KOSP200+", "NED25+", "SPA.35+", "SUI20+", "UK.100+", "US.30+", "COTTONs+", "US2000+",
    "W.20+", "WHEAT+", "COCOA+", "COFFEE+", "COPPER+", "CORN+", "EMISS+", "NICKEL+", "OILs+",
    "NATGAS+", "PLATINUM+", "SOYBEAN+", "SUGARs+", "ZINC+", "BUND10Y+", "SCHATZ2Y+", "USDIDX+",
    "AUT20+", "PALLADIUM+", "DE40+", "AUDUSD+", "EURCHF+", "EURGBP+", "EURJPY+", "GBPUSD+",
    "NZDUSD+", "USDCAD+", "USDCHF+", "USDJPY+"
  ];

  const symbolSelect = document.getElementById("symbol-select");
  const timeframeSelect = document.getElementById("timeframe-select");
  const loadBtn = document.getElementById("load-data-btn");
  const metaDiv = document.getElementById("data-meta");
  const previewDiv = document.getElementById("data-preview");

  // Wypełnij listę symboli
  symbols.forEach(symbol => {
    const option = document.createElement("option");
    option.value = symbol;
    option.textContent = symbol;
    symbolSelect.appendChild(option);
  });

  loadBtn.addEventListener("click", () => {
    const symbol = symbolSelect.value;
    const tf = timeframeSelect.value;
    const folderSymbol = encodeURIComponent(symbol);
    const url = `https://raw.githubusercontent.com/tomekbiel/MT4_Trading_System/master/data/historical/${folderSymbol}/${tf}/${folderSymbol}_${tf}_latest.csv`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("File not found or inaccessible.");
        return res.text();
      })
      .then(csv => {
        const lines = csv.trim().split("\n");
        const headers = lines[0].split(",");
        const rows = lines.slice(1, 21).map(line => line.split(","));

        const timestamps = rows.map(r => r[0]);
        const fromDate = timestamps[0];
        const toDate = timestamps[timestamps.length - 1];

        metaDiv.innerHTML = `
          <strong>Market data for <span style="color:var(--accent)">${symbol}</span> on timeframe <span style="color:var(--accent)">${tf}</span></strong><br>
          Last updated: ${new Date().toLocaleString()}<br>
          Columns: ${headers.length} (${headers.join(", ")})<br>
          Date range: ${fromDate} — ${toDate}
        `;

        let table = "<table><thead><tr>";
        headers.forEach(h => table += `<th>${h}</th>`);
        table += "</tr></thead><tbody>";
        rows.forEach(r => {
          table += "<tr>";
          r.forEach(cell => table += `<td>${cell}</td>`);
          table += "</tr>";
        });
        table += "</tbody></table>";

        previewDiv.innerHTML = table;
      })
      .catch(err => {
        metaDiv.innerHTML = `<span style="color: red">Error: ${err.message}</span>`;
        previewDiv.innerHTML = "";
      });
  });
});
