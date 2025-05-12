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
  const previewDiv = document.getElementById("data-preview");
  const metaDiv = document.getElementById("data-meta");
  
  symbols.forEach(sym => {
    const opt = document.createElement("option");
    opt.value = sym;
    opt.textContent = sym;
    symbolSelect.appendChild(opt);
  });
  
  document.getElementById("load-data-btn").addEventListener("click", () => {
    const sym = symbolSelect.value;
    const tf = timeframeSelect.value;
  
    const filename = `${encodeURIComponent(sym)}_${tf}_2025-04-28_00-28-15.csv`;  // tymczasowy sztywny przykład
    const path = `https://raw.githubusercontent.com/tomekbiel/MT4_Trading_System/master/data/historical/${encodeURIComponent(sym)}/${tf}/${filename}`;
  
    fetch(path)
      .then(res => {
        if (!res.ok) throw new Error("File not found");
        return res.text();
      })
      .then(csv => {
        const lines = csv.trim().split("\n");
        const headers = lines[0].split(",");
        const rows = lines.slice(1, 21); // tylko 20 pierwszych
  
        // Meta info
        metaDiv.innerHTML = `
          <p><strong>Symbol:</strong> ${sym}</p>
          <p><strong>Timeframe:</strong> ${tf}</p>
          <p><strong>Records:</strong> ${lines.length - 1}</p>
          <p><strong>Columns:</strong> ${headers.join(", ")}</p>
          <p><a href="${path}" target="_blank">Download CSV</a></p>
        `;
  
        // Podgląd tabeli
        let html = "<table><thead><tr>";
        headers.forEach(h => html += `<th>${h}</th>`);
        html += "</tr></thead><tbody>";
        rows.forEach(r => {
          html += "<tr>";
          r.split(",").forEach(c => html += `<td>${c}</td>`);
          html += "</tr>";
        });
        html += "</tbody></table>";
        previewDiv.innerHTML = html;
      })
      .catch(err => {
        metaDiv.innerHTML = "";
        previewDiv.innerHTML = `<p style="color:red;">Błąd: nie znaleziono pliku lub brak danych.</p>`;
        console.error(err);
      });
  });
  