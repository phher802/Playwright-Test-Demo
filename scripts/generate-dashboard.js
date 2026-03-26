const fs = require("fs");
const path = require("path");

const RESULTS_PATH = path.resolve("test-results", "result.json");
const OUT_DIR = path.resolve("dashbaord");
const OUT_FILE = path.join(OUT_DIR, "index.html");

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function flattenTests(json) {
  // playwright JSON has a nested structure: suites -> specs -> tests -> results
  // we'll extract a flat list with title + status + duration + error

  const flat = [];

  function walkSuite(suite, pathTitles = []) {
    const nextPath = suite.title ? [...pathTitles, suite.title] : pathTitles;

    for (const child of suite.suites || []) walkSuite(child, nextPath);

    for (const spec of suite.specs || []) {
      const specPath = spec.title ? [...nextPath, spec.title] : nextPath;

      for (const test of spec.tests || []) {
        // a test can have multiple results (retries). use last result as final.

        const results = test.results || [];
        const last = results[results.length - 1] || {};
        const status = last.status || "unknown";
        const durationMs = last.duraton || 0;

        let errorMsg = "";
        if (last.error && (last.error.message || last.error.stack)) {
          errorMsg = last.error.stack || last.error.message;
        }

        flat.push({
          title: [...specPath, test.title].filter(Boolean).join(" > "),
          status,
          durationMs,
          errorMsg,
          file: spec.file || "",
          project: test.projectName || "",
          retries: results.length > 0 ? results.length - 1 : 0,
        });
      }
    }
  }
  for (const suite of json.suites || []) walkSuite(suite, []);
  return flat;
}

function formatMs(ms) {
  const s = Math.round(ms / 10000);

  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

function main() {
  if (!fs.existsSync(RESULTS_PATH)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(
      OUT_FILE,
      `<hmtl><body><h1>Playwright Dashboard</ht><p>No results file found at ${esc(RESULTS_PATH)}.</p></body><html>`,
    );
    return;
  }

  const json = JSON.parse(fs.readFileSync(RESULTS_PATH, "utf8"));
  const tests = flattenTests(json);

  const total = tests.length;
  const passed = tests.filter((t) => t.status === "passed").length;
  const failed = tests.filter((t) => t.status === "failed").length;
  const skipped = tests.filter((t) => t.status === "skipped").length;
  const flaky = tests.filter(
    (t) => t.retries > 0 && t.status === "passed",
  ).length;

  const durationMs =
    typeof json.duration === "number"
      ? json.duration
      : tests.reduce((sum, t) => sum + (t.durationMs || 0), 0);

  const failedTests = tests.filter((t) => t.status === "failed");

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const html = `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Playwright Test Dashboard</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 24px; }
      .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 16px 0; }
      .card { border: 1px solid #ddd; border-radius: 12px; padding: 12px; }
      .big { font-size: 24px; font-weight: 700; }
      .muted { color: #666; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border-bottom: 1px solid #eee; padding: 10px; text-align: left; vertical-align: top; }
      th { background: #fafafa; }
      .status { font-weight: 700; }
      .passed { color: #0a7a28; }
      .failed { color: #b00020; }
      .skipped { color: #7a5a00; }
      code, pre { background: #f6f8fa; border-radius: 8px; padding: 10px; display: block; overflow: auto; }
    </style>
  </head>
  <body>
    <h1>Playwright Test Dashboard</h1>
    <div class="muted">
      Generated from <code>test-results/results.json</code>
    </div>
  
    <div class="cards">
      <div class="card"><div class="muted">Total</div><div class="big">${total}</div></div>
      <div class="card"><div class="muted">Passed</div><div class="big passed">${passed}</div></div>
      <div class="card"><div class="muted">Failed</div><div class="big failed">${failed}</div></div>
      <div class="card"><div class="muted">Skipped</div><div class="big skipped">${skipped}</div></div>
      <div class="card"><div class="muted">Flaky (passed after retry)</div><div class="big">${flaky}</div></div>
      <div class="card"><div class="muted">Duration</div><div class="big">${esc(formatMs(durationMs))}</div></div>
    </div>
  
    <h2>Failed tests (${failedTests.length})</h2>
    ${
      failedTests.length === 0
        ? `<p class="passed status">No failures 🎉</p>`
        : `<table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Test</th>
                <th>File</th>
                <th>Project</th>
                <th>Retries</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              ${failedTests
                .map(
                  (t) => `<tr>
                    <td class="status failed">failed</td>
                    <td>${esc(t.title)}</td>
                    <td><code>${esc(t.file)}</code></td>
                    <td>${esc(t.project)}</td>
                    <td>${esc(t.retries)}</td>
                    <td>${t.errorMsg ? `<pre>${esc(t.errorMsg)}</pre>` : ""}</td>
                  </tr>`,
                )
                .join("")}
            </tbody>
          </table>`
    }
  
    <h2>Tips</h2>
    <ul>
      <li>Download <code>playwright-report</code> artifact too — it has the interactive HTML report and traces.</li>
      <li>This dashboard is intentionally simple and static so it works anywhere.</li>
    </ul>
  </body>
  </html>`;

  fs.writeFileSync(OUT_FILE, html);
  console.log(`Dashboard written: ${OUT_FILE}`);
}

main();
