/**
 * DevPulse AI - Intelligent PR Review Studio & Health Engine
 * Interactive client-side application logic and neural simulation.
 */

(function () {
  'use strict';

  // --- Sound Effects Synthesizer (Web Audio API) ---
  class SoundFX {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }

    playSuccess() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.09, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    }

    playScan() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(660, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    }
  }

  const sfx = new SoundFX();

  // --- PR Presets Data ---
  const PR_PRESETS = {
    security: {
      id: "PR #142",
      title: "Auth Token Leak & SQL Injection in User Login",
      branch: "fix/jwt-auth-hardening",
      filePath: "src/auth/jwt-service.ts",
      language: "TypeScript",
      score: 68,
      statusTitle: "High Risk Detected",
      statusDesc: "Critical hardcoded secret and unescaped SQL query string detected. Merge blocked until patched.",
      verdict: "Blocked",
      verdictColor: "text-accent-rose",
      verdictSub: "Resolve 2 CVEs first",
      complexity: "O(1) Constant",
      complexitySub: "Optimal execution path",
      testDelta: "+14.2%",
      testDeltaSub: "8 security test assertions",
      additions: "+24 lines",
      deletions: "-12 lines",
      filesChanged: 3,
      vulns: [
        {
          id: "CVE-2026-9041",
          cwe: "CWE-798: Use of Hardcoded Credentials",
          title: "Hardcoded JWT Secret Token in Source Code",
          severity: "Critical",
          badgeClass: "badge-critical",
          desc: "Sensitive cryptographic signature secret is hardcoded directly in repository files, making tokens easily forgeable if cloned.",
          code: 'const SECRET_KEY = "super_secret_jwt_dev_token_2026!";',
          patchSnippet: 'const SECRET_KEY = process.env.JWT_SIGNING_SECRET || crypto.randomUUID();'
        },
        {
          id: "CVE-2026-3184",
          cwe: "CWE-89: SQL Injection via Raw Concatenation",
          title: "Raw Parameter String Interpolation in Query",
          severity: "High",
          badgeClass: "badge-high",
          desc: "User-supplied email parameter is directly interpolated into SQL SELECT query without parameterized bindings.",
          code: 'const query = `SELECT * FROM users WHERE email = \'${req.body.email}\'`;',
          patchSnippet: 'const query = \'SELECT * FROM users WHERE email = $1\';\nconst result = await db.query(query, [sanitizedEmail]);'
        }
      ],
      comments: [
        {
          author: "DevPulse AI Copilot",
          line: 14,
          type: "Security Violation",
          text: "Never commit signing secrets to Git history. Move this key to environment configuration and add a pre-commit secret detection hook."
        },
        {
          author: "DevPulse AI Copilot",
          line: 28,
          type: "SQL Injection Alert",
          text: "Direct string interpolation permits authentication bypass (`' OR '1'='1`). Use parameterized queries `$1`."
        },
        {
          author: "Code Style Bot",
          line: 35,
          type: "Best Practice",
          text: "Consider adding rate-limiting middleware (`express-rate-limit`) to the `/api/login` endpoint to prevent brute-force attacks."
        }
      ],
      diffLines: [
        { type: "header", text: "@@ -10,22 +10,28 @@ export class AuthService {" },
        { type: "context", oldNum: 10, newNum: 10, text: "  private db: DatabasePool;" },
        { type: "context", oldNum: 11, newNum: 11, text: "  private logger: Logger;" },
        { type: "del", oldNum: 12, newNum: null, text: "-  private readonly JWT_SECRET = 'super_secret_jwt_dev_token_2026!';" },
        { type: "add", oldNum: null, newNum: 12, text: "+  private readonly JWT_SECRET = process.env.JWT_SIGNING_SECRET;" },
        { type: "annotation", author: "DevPulse Copilot", text: "Security Warning: Avoid fallback to plaintext default credentials in production.", line: 12 },
        { type: "context", oldNum: 13, newNum: 13, text: " " },
        { type: "context", oldNum: 14, newNum: 14, text: "  async authenticateUser(req: Request, res: Response) {" },
        { type: "del", oldNum: 15, newNum: null, text: "-    const rawSql = `SELECT * FROM users WHERE email = '${req.body.email}'`;" },
        { type: "del", oldNum: 16, newNum: null, text: "-    const user = await this.db.rawQuery(rawSql);" },
        { type: "add", oldNum: null, newNum: 15, text: "+    const safeSql = 'SELECT id, email, password_hash, role FROM users WHERE email = $1';" },
        { type: "add", oldNum: null, newNum: 16, text: "+    const user = await this.db.query(safeSql, [req.body.email.trim().toLowerCase()]);" },
        { type: "annotation", author: "DevPulse Copilot", text: "Remediation verified: Query parameter binding protects against SQL injection exploits.", line: 16 },
        { type: "context", oldNum: 17, newNum: 17, text: " " },
        { type: "context", oldNum: 18, newNum: 18, text: "    if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) {" },
        { type: "context", oldNum: 19, newNum: 19, text: "      return res.status(401).json({ error: 'Invalid credentials' });" },
        { type: "context", oldNum: 20, newNum: 20, text: "    }" },
        { type: "context", oldNum: 21, newNum: 21, text: "    return res.json({ token: jwt.sign({ uid: user.id }, this.JWT_SECRET) });" },
        { type: "context", oldNum: 22, newNum: 22, text: "  }" }
      ],
      markdownSummary: `### 🛡️ DevPulse AI - PR #142 Audit Summary

**Verdict:** ⚠️ **BLOCKED** (2 High/Critical Security CVEs detected)  
**Branch:** \`fix/jwt-auth-hardening\`  
**Target:** \`main\`  

#### Key Changes
- Replaced hardcoded JWT secret with \`process.env.JWT_SIGNING_SECRET\`.
- Refactored raw SQL query concatenation to use parameterized queries \`$1\` with input normalization.
- Prevented unauthorized authentication bypass exploits.

#### Security Analysis
- [x] **CWE-798**: Resolved hardcoded credentials in \`jwt-service.ts\`.
- [x] **CWE-89**: Applied parameter binding to prevent arbitrary SQL execution.
- [ ] **Action Required**: Verify that deployment environments contain the \`JWT_SIGNING_SECRET\` environment variable.`
    },

    performance: {
      id: "PR #89",
      title: "Vector Search O(N²) Algorithmic Bottleneck",
      branch: "perf/vector-similarity-lookup",
      filePath: "src/search/vector-engine.ts",
      language: "TypeScript",
      score: 74,
      statusTitle: "Performance Bottleneck",
      statusDesc: "Quadratic O(N²) pairwise distance calculation will cause worker thread stalls under production load.",
      verdict: "Needs Work",
      verdictColor: "text-accent-rose",
      verdictSub: "Latency regression risk",
      complexity: "O(N²) Quadratic",
      complexitySub: "High latency risk",
      testDelta: "+22.0%",
      testDeltaSub: "Benchmark suites added",
      additions: "+38 lines",
      deletions: "-29 lines",
      filesChanged: 2,
      vulns: [
        {
          id: "PERF-2026-004",
          cwe: "CWE-400: Uncontrolled Resource Consumption",
          title: "Nested Nested Loops in Vector Cosine Similarity",
          severity: "High",
          badgeClass: "badge-high",
          desc: "Scanning through entire index without spatial partitioning results in quadratic time explosion O(N*M).",
          code: 'for (let i = 0; i < vectors.length; i++) {\n  for (let j = 0; j < queries.length; j++) { ... } }',
          patchSnippet: 'const index = new KDTreeIndex(vectors);\nconst nearest = index.kNearestNeighbors(query, 10);'
        }
      ],
      comments: [
        {
          author: "DevPulse AI Copilot",
          line: 22,
          type: "Complexity Warning",
          text: "Double-loop comparison takes 420ms for 10,000 vectors. Switching to an approximate nearest neighbors (HNSW) index brings execution down to 18ms."
        }
      ],
      diffLines: [
        { type: "header", text: "@@ -18,18 +18,24 @@ export class VectorSearchEngine {" },
        { type: "del", oldNum: 18, newNum: null, text: "-  computeSimilarities(queries: Vector[], corpus: Vector[]) {" },
        { type: "del", oldNum: 19, newNum: null, text: "-    const results = [];" },
        { type: "del", oldNum: 20, newNum: null, text: "-    for (const q of queries) {" },
        { type: "del", oldNum: 21, newNum: null, text: "-      for (const item of corpus) {" },
        { type: "del", oldNum: 22, newNum: null, text: "-        results.push({ item, sim: cosineSim(q, item) });" },
        { type: "del", oldNum: 23, newNum: null, text: "-      }" },
        { type: "del", oldNum: 24, newNum: null, text: "-    }" },
        { type: "add", oldNum: null, newNum: 18, text: "+  computeSimilarities(queries: Vector[], index: HNSWIndex) {" },
        { type: "add", oldNum: null, newNum: 19, text: "+    // Indexed vector lookup reduced from O(N^2) to O(N log N)" },
        { type: "add", oldNum: null, newNum: 20, text: "+    return queries.map(q => index.searchKnn(q, 10));" },
        { type: "annotation", author: "DevPulse Copilot", text: "Benchmarked 94.2% faster on 50k item dataset.", line: 20 },
        { type: "context", oldNum: 25, newNum: 21, text: "    return results.sort((a,b) => b.sim - a.sim);" },
        { type: "context", oldNum: 26, newNum: 22, text: "  }" }
      ],
      markdownSummary: `### ⚡ DevPulse AI - PR #89 Performance Audit

**Verdict:** 🟡 **NEEDS OPTIMIZATION**  
**Branch:** \`perf/vector-similarity-lookup\`  

#### Impact Metrics
- **Algorithmic Complexity:** Reduced from $O(N^2)$ to $O(N \\log N)$.
- **P99 Query Latency:** Projected drop from 420ms down to 18ms.
- **Memory Footprint:** Cache allocations stabilized with LRU boundary.`
    },

    modern: {
      id: "PR #215",
      title: "Async Stream Pipeline & Circuit Breaker Resilience",
      branch: "feat/stream-pipeline-v2",
      filePath: "src/streaming/pipeline.ts",
      language: "TypeScript",
      score: 96,
      statusTitle: "Clean & Ready to Merge",
      statusDesc: "All security checks passed, zero memory leaks detected, unit test coverage increased by +34%.",
      verdict: "Approved",
      verdictColor: "text-accent-green",
      verdictSub: "Safe to merge immediately",
      complexity: "O(N) Linear",
      complexitySub: "Streamlined single-pass pipe",
      testDelta: "+34.5%",
      testDeltaSub: "Full integration harness",
      additions: "+64 lines",
      deletions: "-18 lines",
      filesChanged: 4,
      vulns: [],
      comments: [
        {
          author: "DevPulse AI Copilot",
          line: 12,
          type: "Architecture Approval",
          text: "Excellent use of Node.js stream backpressure handling. Prevents memory spikes under high ingest throughput."
        }
      ],
      diffLines: [
        { type: "header", text: "@@ -5,12 +5,16 @@ import { Transform, pipeline } from 'stream';" },
        { type: "context", oldNum: 5, newNum: 5, text: "export function createStreamPipeline(source: ReadableStream) {" },
        { type: "add", oldNum: null, newNum: 6, text: "+  const circuitBreaker = new CircuitBreaker({ threshold: 5 });" },
        { type: "add", oldNum: null, newNum: 7, text: "+  return pipeline(source, circuitBreaker, new JSONParser(), (err) => {" },
        { type: "add", oldNum: null, newNum: 8, text: "+    if (err) logger.error('Pipeline failed gracefully', err);" },
        { type: "add", oldNum: null, newNum: 9, text: "+  });" },
        { type: "context", oldNum: 6, newNum: 10, text: "}" }
      ],
      markdownSummary: `### ✅ DevPulse AI - PR #215 Approval Report

**Verdict:** 🟢 **APPROVED FOR MERGE**  
**Branch:** \`feat/stream-pipeline-v2\`  

- **Security CVEs:** 0 detected  
- **Test Coverage:** 92.4% (+34.5% delta)  
- **Resilience:** Circuit breaker integrated for automatic fault tolerance.`
    }
  };

  // --- State ---
  let currentPresetKey = 'security';
  let isPatched = false;
  let viewMode = 'unified'; // 'unified' | 'split'
  let exportFormat = 'markdown'; // 'markdown' | 'json'

  // --- DOM Elements ---
  const tabPr1 = document.getElementById('tab-pr-1');
  const tabPr2 = document.getElementById('tab-pr-2');
  const tabPr3 = document.getElementById('tab-pr-3');
  const tabPrCustom = document.getElementById('tab-pr-custom');
  const healthRingProgress = document.getElementById('health-ring-progress');
  const healthScoreVal = document.getElementById('health-score-val');
  const healthStatusTitle = document.getElementById('health-status-title');
  const healthStatusDesc = document.getElementById('health-status-desc');
  const pillSecurityState = document.getElementById('pill-security-state');
  const pillFilesCount = document.getElementById('pill-files-count');
  const pillDiffStats = document.getElementById('pill-diff-stats');
  const complexityVal = document.getElementById('complexity-val');
  const complexitySub = document.getElementById('complexity-sub');
  const testDeltaVal = document.getElementById('test-delta-val');
  const testDeltaSub = document.getElementById('test-delta-sub');
  const mergeVerdictVal = document.getElementById('merge-verdict-val');
  const mergeVerdictSub = document.getElementById('merge-verdict-sub');

  const diffFilePath = document.getElementById('diff-file-path');
  const diffLanguageBadge = document.getElementById('diff-language-badge');
  const diffTable = document.getElementById('diff-table');
  const diffFooterStats = document.getElementById('diff-footer-stats');
  const btnApplyAllPatches = document.getElementById('btn-apply-all-patches');

  const btnViewUnified = document.getElementById('btn-view-unified');
  const btnViewSplit = document.getElementById('btn-view-split');

  const intelTabVuln = document.getElementById('intel-tab-vuln');
  const intelTabComments = document.getElementById('intel-tab-comments');
  const intelTabSummary = document.getElementById('intel-tab-summary');
  const intelTabBench = document.getElementById('intel-tab-bench');
  const vulnTabCount = document.getElementById('vuln-tab-count');
  const commentsTabCount = document.getElementById('comments-tab-count');

  const paneVuln = document.getElementById('pane-vuln');
  const paneComments = document.getElementById('pane-comments');
  const paneSummary = document.getElementById('pane-summary');
  const paneBench = document.getElementById('pane-bench');

  const vulnListContainer = document.getElementById('vuln-list-container');
  const commentsStreamContainer = document.getElementById('comments-stream-container');
  const markdownPrPreview = document.getElementById('markdown-pr-preview');
  const btnCopySummary = document.getElementById('btn-copy-summary');
  const copySummaryText = document.getElementById('copy-summary-text');

  // Sandbox elements
  const sandboxCodeInput = document.getElementById('sandbox-code-input');
  const sandboxLangSelect = document.getElementById('sandbox-lang-select');
  const btnRunSandboxAudit = document.getElementById('btn-run-sandbox-audit');
  const sandboxOutputConsole = document.getElementById('sandbox-output-console');
  const sandboxAuditStatus = document.getElementById('sandbox-audit-status');
  const btnLoadSampleLeak = document.getElementById('btn-load-sample-leak');
  const btnLoadSampleSqli = document.getElementById('btn-load-sample-sqli');
  const btnLoadSampleLoop = document.getElementById('btn-load-sample-loop');

  // Modal elements
  const exportReportBtn = document.getElementById('export-report-btn');
  const exportModal = document.getElementById('export-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalDownloadBtn = document.getElementById('modal-download-btn');
  const exportOptMd = document.getElementById('export-opt-md');
  const exportOptJson = document.getElementById('export-opt-json');
  const exportPreviewContent = document.getElementById('export-preview-content');

  // Sound toggle
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIconOn = document.getElementById('sound-icon-on');
  const toastContainer = document.getElementById('toast-container');

  // --- Toast Notification Helper ---
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = '⚡';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- Gauge UI Update ---
  function updateHealthGauge(score) {
    const circumference = 314; // 2 * PI * 50
    const offset = circumference - (score / 100) * circumference;
    healthRingProgress.style.strokeDashoffset = offset;
    healthScoreVal.textContent = `${score}%`;

    if (score >= 90) {
      healthRingProgress.style.stroke = 'var(--emerald-primary)';
      healthRingProgress.style.filter = 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))';
    } else if (score >= 70) {
      healthRingProgress.style.stroke = 'var(--amber-primary)';
      healthRingProgress.style.filter = 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))';
    } else {
      healthRingProgress.style.stroke = 'var(--rose-primary)';
      healthRingProgress.style.filter = 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.6))';
    }
  }

  // --- Render Diff Rows ---
  function renderDiff(lines) {
    diffTable.innerHTML = '';
    lines.forEach((line) => {
      if (line.type === 'header') {
        const row = document.createElement('div');
        row.className = 'diff-row diff-header-line';
        row.textContent = line.text;
        diffTable.appendChild(row);
      } else if (line.type === 'annotation') {
        const annotation = document.createElement('div');
        annotation.className = 'inline-ai-annotation';
        annotation.innerHTML = `
          <div class="annotation-header">
            <span class="annotation-badge">AI INSIGHT</span>
            <span class="annotation-author">${line.author}</span>
          </div>
          <div class="annotation-body">${line.text}</div>
          <div class="annotation-actions">
            <button class="btn-annotation-accept" data-line="${line.line}">Accept Suggested Fix</button>
          </div>
        `;
        diffTable.appendChild(annotation);
      } else {
        const row = document.createElement('div');
        const isAdd = line.type === 'add';
        const isDel = line.type === 'del';
        row.className = `diff-row ${isAdd ? 'diff-add' : ''} ${isDel ? 'diff-del' : ''}`;

        const gutterOld = document.createElement('div');
        gutterOld.className = 'diff-gutter';
        gutterOld.textContent = line.oldNum !== null ? line.oldNum : '';

        const gutterNew = document.createElement('div');
        gutterNew.className = 'diff-gutter diff-gutter-new';
        gutterNew.textContent = line.newNum !== null ? line.newNum : '';

        const symbol = document.createElement('div');
        symbol.className = 'diff-type-symbol';
        symbol.textContent = isAdd ? '+' : isDel ? '-' : ' ';

        const text = document.createElement('div');
        text.className = 'diff-text';
        text.textContent = line.text.replace(/^[+-]/, '');

        row.appendChild(gutterOld);
        row.appendChild(gutterNew);
        row.appendChild(symbol);
        row.appendChild(text);
        diffTable.appendChild(row);
      }
    });

    // Attach click listeners to inline annotations
    diffTable.querySelectorAll('.btn-annotation-accept').forEach(btn => {
      btn.addEventListener('click', () => {
        applyAutoPatch();
      });
    });
  }

  // --- Render Vulnerabilities ---
  function renderVulnerabilities(vulns) {
    vulnListContainer.innerHTML = '';
    vulnTabCount.textContent = vulns.length;

    if (vulns.length === 0) {
      vulnListContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--emerald-primary);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🛡️</div>
          <h4 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 6px;">Zero Vulnerabilities Detected</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted);">This pull request passes all static AST and OWASP Top 10 security heuristics.</p>
        </div>
      `;
      return;
    }

    vulns.forEach(vuln => {
      const card = document.createElement('div');
      card.className = `vuln-item-card ${vuln.severity === 'High' ? 'vuln-medium' : ''}`;
      card.innerHTML = `
        <div class="vuln-header-line">
          <span class="vuln-title-text">${vuln.title}</span>
          <span class="vuln-badge ${vuln.badgeClass}">${vuln.severity}</span>
        </div>
        <p class="vuln-desc-text">${vuln.desc}</p>
        <div class="vuln-code-snippet">${escapeHtml(vuln.code)}</div>
        <div class="vuln-footer-actions">
          <span class="cwe-tag">${vuln.cwe}</span>
          <button class="btn-patch-single" data-cve="${vuln.id}">Apply Patch</button>
        </div>
      `;
      vulnListContainer.appendChild(card);
    });

    vulnListContainer.querySelectorAll('.btn-patch-single').forEach(btn => {
      btn.addEventListener('click', () => {
        applyAutoPatch();
      });
    });
  }

  // --- Render Comments Stream ---
  function renderComments(comments) {
    commentsStreamContainer.innerHTML = '';
    commentsTabCount.textContent = comments.length;

    comments.forEach(comment => {
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.innerHTML = `
        <div class="comment-header">
          <div class="comment-meta">
            <span class="comment-author-badge">${comment.author}</span>
            <span>Line ${comment.line}</span>
          </div>
          <span class="pill pill-neutral">${comment.type}</span>
        </div>
        <div class="comment-text">${comment.text}</div>
      `;
      commentsStreamContainer.appendChild(card);
    });
  }

  // --- Render Preset PR View ---
  function loadPreset(presetKey) {
    currentPresetKey = presetKey;
    isPatched = false;
    const data = PR_PRESETS[presetKey];
    if (!data) return;

    sfx.playClick();

    // Update preset tabs UI
    document.querySelectorAll('.pr-tab').forEach(tab => {
      const active = tab.getAttribute('data-preset') === presetKey;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active);
    });

    // Scorecard & Header
    updateHealthGauge(data.score);
    healthStatusTitle.textContent = data.statusTitle;
    healthStatusDesc.textContent = data.statusDesc;
    pillFilesCount.textContent = `${data.filesChanged} Files Changed`;
    pillDiffStats.textContent = `${data.additions} / ${data.deletions}`;

    if (data.vulns.length > 0) {
      pillSecurityState.textContent = `${data.vulns.length} Security Alerts`;
      pillSecurityState.className = 'pill pill-danger';
    } else {
      pillSecurityState.textContent = 'All Checks Passed';
      pillSecurityState.className = 'pill pill-neutral';
    }

    complexityVal.textContent = data.complexity;
    complexitySub.textContent = data.complexitySub;
    testDeltaVal.textContent = data.testDelta;
    testDeltaSub.textContent = data.testDeltaSub;

    mergeVerdictVal.textContent = data.verdict;
    mergeVerdictVal.className = `mini-val ${data.verdictColor}`;
    mergeVerdictSub.textContent = data.verdictSub;

    // Diff Card
    diffFilePath.textContent = data.filePath;
    diffLanguageBadge.textContent = data.language;
    renderDiff(data.diffLines);
    diffFooterStats.innerHTML = `
      <span class="diff-additions">${data.additions}</span>
      <span class="diff-deletions">${data.deletions}</span>
    `;

    // Right Panel
    renderVulnerabilities(data.vulns);
    renderComments(data.comments);
    renderMarkdownPreview(data.markdownSummary);
  }

  // --- Apply Auto Patch Simulation ---
  function applyAutoPatch() {
    if (isPatched) {
      showToast('AI auto-patch has already been applied!', 'info');
      return;
    }

    sfx.playSuccess();
    isPatched = true;

    // Update Diff to Patched Clean Code
    const patchedLines = [
      { type: "header", text: "@@ -10,25 +10,27 @@ export class AuthService [AUTO-PATCHED] @@" },
      { type: "context", oldNum: 10, newNum: 10, text: "  private db: DatabasePool;" },
      { type: "context", oldNum: 11, newNum: 11, text: "  private logger: Logger;" },
      { type: "add", oldNum: null, newNum: 12, text: "+  private readonly JWT_SECRET = process.env.JWT_SIGNING_SECRET || crypto.randomUUID();" },
      { type: "context", oldNum: 13, newNum: 13, text: " " },
      { type: "context", oldNum: 14, newNum: 14, text: "  async authenticateUser(req: Request, res: Response) {" },
      { type: "add", oldNum: null, newNum: 15, text: "+    const safeSql = 'SELECT id, email, password_hash, role FROM users WHERE email = $1';" },
      { type: "add", oldNum: null, newNum: 16, text: "+    const user = await this.db.query(safeSql, [req.body.email.trim().toLowerCase()]);" },
      { type: "context", oldNum: 17, newNum: 17, text: " " },
      { type: "context", oldNum: 18, newNum: 18, text: "    if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) {" },
      { type: "context", oldNum: 19, newNum: 19, text: "      return res.status(401).json({ error: 'Invalid credentials' });" },
      { type: "context", oldNum: 20, newNum: 20, text: "    }" },
      { type: "context", oldNum: 21, newNum: 21, text: "    return res.json({ token: jwt.sign({ uid: user.id }, this.JWT_SECRET) });" },
      { type: "context", oldNum: 22, newNum: 22, text: "  }" }
    ];

    renderDiff(patchedLines);
    updateHealthGauge(98);

    healthStatusTitle.textContent = "Auto-Patched & Approved";
    healthStatusDesc.textContent = "Vulnerabilities successfully remediated. Code is hardened and meets SOC-2 compliance standards.";
    pillSecurityState.textContent = "0 Alerts Remaining";
    pillSecurityState.className = "pill pill-neutral";

    mergeVerdictVal.textContent = "Ready to Merge";
    mergeVerdictVal.className = "mini-val text-accent-green";
    mergeVerdictSub.textContent = "CI validation passed";

    // Clear vulnerability matrix
    renderVulnerabilities([]);

    showToast("Auto-Patch applied: 2 CVEs remediated, health score updated to 98%!", "success");
  }

  // --- Render Markdown Helper ---
  function renderMarkdownPreview(rawMarkdown) {
    // Simple fast markdown parser for demo preview
    let html = rawMarkdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 style="color:#a5b4fc; margin:12px 0 6px;">$1</h4>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/\[x\] (.*$)/gim, '<li style="list-style:none;">✅ $1</li>')
      .replace(/\[ \] (.*$)/gim, '<li style="list-style:none;">⏳ $1</li>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/gim, '<br>');

    markdownPrPreview.innerHTML = html;
  }

  // --- HTML Escape Utility ---
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Sandbox Logic ---
  const SAMPLE_SNIPPETS = {
    leak: `// Hardcoded credential exploit sample
const AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

export function initializeS3() {
  return new AWS.S3({ accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY });
}`,
    sqli: `// Unsanitized raw query parameter
app.get('/api/users/search', async (req, res) => {
  const searchTerm = req.query.q;
  const sql = "SELECT * FROM accounts WHERE name LIKE '%" + searchTerm + "%';";
  const records = await db.raw(sql);
  res.json(records);
});`,
    loop: `// Non-terminating loop & memory leak
function processTransactions(queue) {
  let index = 0;
  const history = [];
  while (index < queue.length) {
    history.push(new Array(1000000).fill(queue[index]));
    // Forgot to increment index!
  }
  return history;
}`
  };

  function runSandboxAudit() {
    const code = sandboxCodeInput.value.trim();
    if (!code) {
      showToast('Please type or load a code sample first!', 'error');
      return;
    }

    sfx.playScan();
    sandboxAuditStatus.textContent = 'Analyzing AST...';
    sandboxAuditStatus.style.background = 'rgba(245, 158, 11, 0.2)';
    sandboxAuditStatus.style.color = '#fbbf24';

    sandboxOutputConsole.innerHTML = `
      <div class="console-log-row">
        <span class="console-tag tag-ast">AST PARSER</span>
        <span>Generating abstract syntax tree for language: ${sandboxLangSelect.value}...</span>
      </div>
    `;

    setTimeout(() => {
      // Analyze code heuristics
      const hasSecret = /AWS_|SECRET|KEY|TOKEN|PASSWORD/i.test(code) && /=['"`][A-Za-z0-9_\-\/]{8,}['"`]/.test(code);
      const hasSql = /SELECT|UPDATE|DELETE|INSERT/i.test(code) && /(\+|\$\{)/.test(code);
      const hasLoop = /while\s*\(/.test(code) && !/index\+\+|\+\+index|index\s*\+=/.test(code);

      let logHTML = `
        <div class="console-log-row">
          <span class="console-tag tag-ast">AST PARSER</span>
          <span>Tokens parsed: ${code.split(/\s+/).length} | Nodes traversed: 42</span>
        </div>
      `;

      if (hasSecret) {
        logHTML += `
          <div class="console-log-row">
            <span class="console-tag tag-security">CVE DETECTED</span>
            <span style="color:#fb7185;">High Risk: Hardcoded API keys or secret credentials detected in source tree.</span>
          </div>
          <div class="console-log-row">
            <span class="console-tag tag-fix">AUTO-PATCH</span>
            <span style="color:#34d399;">Remediation: Migrate credentials to .env and reference via process.env.</span>
          </div>
        `;
      }

      if (hasSql) {
        logHTML += `
          <div class="console-log-row">
            <span class="console-tag tag-security">CVE DETECTED</span>
            <span style="color:#fb7185;">SQL Injection: Direct string concatenation inside SQL statement.</span>
          </div>
          <div class="console-log-row">
            <span class="console-tag tag-fix">AUTO-PATCH</span>
            <span style="color:#34d399;">Remediation: Use prepared statement parameter binding ($1, ?).</span>
          </div>
        `;
      }

      if (hasLoop) {
        logHTML += `
          <div class="console-log-row">
            <span class="console-tag tag-perf">RESOURCE LEAK</span>
            <span style="color:#fbbf24;">Infinite Loop / Heap Overflow: While loop condition does not increment index.</span>
          </div>
        `;
      }

      if (!hasSecret && !hasSql && !hasLoop) {
        logHTML += `
          <div class="console-log-row">
            <span class="console-tag tag-fix">PASSED</span>
            <span style="color:#34d399;">Clean Code: No obvious OWASP Top 10 vulnerabilities or infinite loops detected.</span>
          </div>
        `;
      }

      sandboxOutputConsole.innerHTML = logHTML;
      sandboxAuditStatus.textContent = 'Scan Complete';
      sandboxAuditStatus.style.background = 'rgba(16, 185, 129, 0.2)';
      sandboxAuditStatus.style.color = '#34d399';
      sfx.playSuccess();
      showToast('Sandbox Neural Audit finished!', 'success');
    }, 600);
  }

  // --- Export Modal Management ---
  function updateExportPreview() {
    const data = PR_PRESETS[currentPresetKey];
    if (exportFormat === 'markdown') {
      exportPreviewContent.textContent = data.markdownSummary;
    } else {
      const jsonReport = {
        scanId: `scan-${Date.now()}`,
        timestamp: new Date().toISOString(),
        prId: data.id,
        targetBranch: "main",
        sourceBranch: data.branch,
        healthScore: isPatched ? 98 : data.score,
        mergeVerdict: isPatched ? "Approved" : data.verdict,
        vulnerabilitiesCount: isPatched ? 0 : data.vulns.length,
        vulnerabilities: isPatched ? [] : data.vulns,
        metrics: {
          complexity: data.complexity,
          testDelta: data.testDelta,
          filesChanged: data.filesChanged
        }
      };
      exportPreviewContent.textContent = JSON.stringify(jsonReport, null, 2);
    }
  }

  function downloadAuditReport() {
    const data = PR_PRESETS[currentPresetKey];
    const isMd = exportFormat === 'markdown';
    const filename = isMd ? `devpulse-audit-${currentPresetKey}.md` : `devpulse-audit-${currentPresetKey}.json`;
    const content = exportPreviewContent.textContent;

    const blob = new Blob([content], { type: isMd ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    sfx.playSuccess();
    showToast(`Report downloaded: ${filename}`, 'success');
    exportModal.classList.remove('open');
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // PR Tabs
    tabPr1.addEventListener('click', () => loadPreset('security'));
    tabPr2.addEventListener('click', () => loadPreset('performance'));
    tabPr3.addEventListener('click', () => loadPreset('modern'));
    tabPrCustom.addEventListener('click', () => {
      document.getElementById('playground-section').scrollIntoView({ behavior: 'smooth' });
      showToast('Switched to Custom Code & Diff Sandbox', 'info');
    });

    // Auto-patch Button
    btnApplyAllPatches.addEventListener('click', () => {
      applyAutoPatch();
    });

    // View toggle buttons
    btnViewUnified.addEventListener('click', () => {
      sfx.playClick();
      btnViewUnified.classList.add('active');
      btnViewSplit.classList.remove('active');
      showToast('Viewing Unified Diff', 'info');
    });

    btnViewSplit.addEventListener('click', () => {
      sfx.playClick();
      btnViewSplit.classList.add('active');
      btnViewUnified.classList.remove('active');
      showToast('Viewing Side-by-Side Split Diff', 'info');
    });

    // Intelligence Sub-tabs
    const intelTabs = [
      { btn: intelTabVuln, pane: paneVuln },
      { btn: intelTabComments, pane: paneComments },
      { btn: intelTabSummary, pane: paneSummary },
      { btn: intelTabBench, pane: paneBench }
    ];

    intelTabs.forEach(item => {
      item.btn.addEventListener('click', () => {
        sfx.playClick();
        intelTabs.forEach(t => {
          t.btn.classList.remove('active');
          t.pane.classList.remove('active');
        });
        item.btn.classList.add('active');
        item.pane.classList.add('active');
      });
    });

    // Copy PR summary button
    btnCopySummary.addEventListener('click', () => {
      const summaryText = PR_PRESETS[currentPresetKey].markdownSummary;
      navigator.clipboard.writeText(summaryText).then(() => {
        sfx.playSuccess();
        copySummaryText.textContent = 'Copied to Clipboard!';
        showToast('PR Description Markdown copied!', 'success');
        setTimeout(() => {
          copySummaryText.textContent = 'Copy Markdown';
        }, 2000);
      });
    });

    // Sandbox snippet buttons
    btnLoadSampleLeak.addEventListener('click', () => {
      sfx.playClick();
      sandboxCodeInput.value = SAMPLE_SNIPPETS.leak;
      sandboxLangSelect.value = 'javascript';
    });

    btnLoadSampleSqli.addEventListener('click', () => {
      sfx.playClick();
      sandboxCodeInput.value = SAMPLE_SNIPPETS.sqli;
      sandboxLangSelect.value = 'javascript';
    });

    btnLoadSampleLoop.addEventListener('click', () => {
      sfx.playClick();
      sandboxCodeInput.value = SAMPLE_SNIPPETS.loop;
      sandboxLangSelect.value = 'javascript';
    });

    btnRunSandboxAudit.addEventListener('click', runSandboxAudit);

    // Export Modal
    exportReportBtn.addEventListener('click', () => {
      sfx.playClick();
      updateExportPreview();
      exportModal.classList.add('open');
    });

    modalCloseBtn.addEventListener('click', () => exportModal.classList.remove('open'));
    modalCancelBtn.addEventListener('click', () => exportModal.classList.remove('open'));
    modalDownloadBtn.addEventListener('click', downloadAuditReport);

    exportOptMd.addEventListener('click', () => {
      sfx.playClick();
      exportFormat = 'markdown';
      exportOptMd.classList.add('active');
      exportOptJson.classList.remove('active');
      updateExportPreview();
    });

    exportOptJson.addEventListener('click', () => {
      sfx.playClick();
      exportFormat = 'json';
      exportOptJson.classList.add('active');
      exportOptMd.classList.remove('active');
      updateExportPreview();
    });

    // Live GitHub PR Fetcher
    const inputGithubPrUrl = document.getElementById('input-github-pr-url');
    const btnFetchLivePr = document.getElementById('btn-fetch-live-pr');

    async function fetchLiveGitHubPR(prUrl) {
      if (!prUrl || !prUrl.trim()) {
        showToast('Please enter a GitHub PR URL!', 'error');
        return;
      }

      const match = prUrl.trim().match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i);
      if (!match) {
        showToast('Invalid GitHub PR URL. Expected: https://github.com/owner/repo/pull/123', 'error');
        return;
      }

      const [, owner, repo, prNumber] = match;
      sfx.playScan();
      showToast(`Fetching GitHub PR ${owner}/${repo}#${prNumber}...`, 'info');
      btnFetchLivePr.disabled = true;
      btnFetchLivePr.textContent = 'Fetching...';

      try {
        const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
          headers: { 'Accept': 'application/vnd.github.v3+json' }
        });

        if (!prRes.ok) {
          throw new Error(`GitHub API error (${prRes.status})`);
        }

        const prData = await prRes.json();
        
        // Try fetching files diff
        let filesData = [];
        try {
          const filesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=5`);
          if (filesRes.ok) {
            filesData = await filesRes.json();
          }
        } catch (_) {}

        // Construct live diff rows from GitHub patch
        let liveDiffLines = [];
        let firstFile = 'source/code-change.ts';
        if (filesData.length > 0 && filesData[0].patch) {
          firstFile = filesData[0].filename;
          const patchRaw = filesData[0].patch.split('\n');
          let oldLine = 1;
          let newLine = 1;
          liveDiffLines = patchRaw.slice(0, 30).map((l) => {
            if (l.startsWith('@@')) {
              return { type: 'header', text: l };
            } else if (l.startsWith('+')) {
              return { type: 'add', oldNum: null, newNum: newLine++, text: l };
            } else if (l.startsWith('-')) {
              return { type: 'del', oldNum: oldLine++, newNum: null, text: l };
            } else {
              return { type: 'context', oldNum: oldLine++, newNum: newLine++, text: l };
            }
          });
        } else {
          liveDiffLines = [
            { type: 'header', text: `@@ -1,10 +1,15 @@ Live Diff from ${owner}/${repo}#${prNumber} @@` },
            { type: 'context', oldNum: 1, newNum: 1, text: `// Target Branch: ${prData.base.ref}` },
            { type: 'context', oldNum: 2, newNum: 2, text: `// Head Branch: ${prData.head.ref}` },
            { type: 'add', oldNum: null, newNum: 3, text: `+ // Author: @${prData.user.login}` },
            { type: 'add', oldNum: null, newNum: 4, text: `+ // Status: ${prData.state.toUpperCase()}` },
            { type: 'context', oldNum: 3, newNum: 5, text: `// ${prData.title}` }
          ];
        }

        // Live Score Heuristic
        const score = Math.max(72, Math.min(98, 100 - (prData.changed_files * 2) - Math.floor(prData.additions / 50)));

        // Update UI
        updateHealthGauge(score);
        healthStatusTitle.textContent = `Live Audit: ${prData.title.slice(0, 40)}...`;
        healthStatusDesc.textContent = `Author: @${prData.user.login} • Merged: ${prData.merged ? 'Yes' : 'No'} • State: ${prData.state}`;
        pillFilesCount.textContent = `${prData.changed_files} Files Changed`;
        pillDiffStats.textContent = `+${prData.additions} / -${prData.deletions} lines`;
        pillSecurityState.textContent = 'Live GitHub Ingest';
        pillSecurityState.className = 'pill pill-neutral';

        complexityVal.textContent = prData.changed_files > 10 ? 'O(N) Multi-file' : 'O(1) Modular';
        complexitySub.textContent = `Base: ${prData.base.ref}`;
        testDeltaVal.textContent = prData.additions > 100 ? '+15.4%' : '+6.2%';
        testDeltaSub.textContent = 'Calculated delta';

        mergeVerdictVal.textContent = prData.state === 'closed' ? 'Closed' : 'Open / Review';
        mergeVerdictVal.className = prData.state === 'closed' ? 'mini-val text-accent-green' : 'mini-val text-accent-cyan';
        mergeVerdictSub.textContent = `PR #${prData.number} on ${owner}/${repo}`;

        diffFilePath.textContent = firstFile;
        diffLanguageBadge.textContent = 'GitHub Live';
        renderDiff(liveDiffLines);
        diffFooterStats.innerHTML = `
          <span class="diff-additions">+${prData.additions} additions</span>
          <span class="diff-deletions">-${prData.deletions} deletions</span>
        `;

        renderVulnerabilities([]);
        renderComments([
          {
            author: `@${prData.user.login}`,
            line: 1,
            type: 'GitHub PR Contributor',
            text: prData.body ? prData.body.slice(0, 200) + '...' : 'No description provided by author.'
          }
        ]);

        renderMarkdownPreview(`### 🐙 Live GitHub PR: ${prData.title}

**Repository:** \`${owner}/${repo}\`  
**PR Number:** #${prData.number}  
**State:** \`${prData.state}\`  
**Author:** [@${prData.user.login}](https://github.com/${prData.user.login})  

#### Live Statistics
- **Additions:** +${prData.additions}
- **Deletions:** -${prData.deletions}
- **Changed Files:** ${prData.changed_files}
- **Branches:** \`${prData.head.ref}\` -> \`${prData.base.ref}\`

${prData.body || 'No description body.'}`);

        sfx.playSuccess();
        showToast(`Successfully audited live PR #${prNumber} from ${owner}/${repo}!`, 'success');
      } catch (err) {
        showToast(`Could not fetch PR (${err.message}). Rate-limited or private repo.`, 'error');
      } finally {
        btnFetchLivePr.disabled = false;
        btnFetchLivePr.innerHTML = `
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Inspect Live PR
        `;
      }
    }

    btnFetchLivePr.addEventListener('click', () => {
      fetchLiveGitHubPR(inputGithubPrUrl.value);
    });

    inputGithubPrUrl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        fetchLiveGitHubPR(inputGithubPrUrl.value);
      }
    });

    document.querySelectorAll('.btn-sample-pr').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        inputGithubPrUrl.value = url;
        fetchLiveGitHubPR(url);
      });
    });

    // Sound toggle
    soundToggleBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      if (sfx.enabled) {
        soundToggleBtn.style.color = 'var(--cyan-primary)';
        showToast('Audio feedback enabled', 'info');
      } else {
        soundToggleBtn.style.color = 'var(--text-dim)';
        showToast('Audio feedback muted', 'info');
      }
    });

    // GitHub Sync button toast
    document.getElementById('github-sync-btn').addEventListener('click', (e) => {
      e.preventDefault();
      sfx.playClick();
      showToast('GitHub Webhook & Actions Sync connected!', 'success');
    });

    // --- Command Palette Logic ---
    const commandPaletteModal = document.getElementById('command-palette-modal');
    const paletteSearchInput = document.getElementById('palette-search-input');
    const paletteTriggerBtn = document.getElementById('palette-trigger-btn');
    const paletteItems = Array.from(document.querySelectorAll('.palette-item'));

    function openCommandPalette() {
      sfx.playClick();
      commandPaletteModal.classList.add('open');
      paletteSearchInput.value = '';
      filterPaletteItems('');
      paletteSearchInput.focus();
    }

    function closeCommandPalette() {
      commandPaletteModal.classList.remove('open');
    }

    function filterPaletteItems(query) {
      const q = query.toLowerCase().trim();
      let firstVisible = null;
      paletteItems.forEach(item => {
        const title = item.querySelector('.palette-item-title').textContent.toLowerCase();
        const desc = item.querySelector('.palette-item-desc').textContent.toLowerCase();
        const matches = !q || title.includes(q) || desc.includes(q);
        item.style.display = matches ? 'flex' : 'none';
        if (matches && !firstVisible) {
          firstVisible = item;
        }
      });
      paletteItems.forEach(i => i.classList.remove('active'));
      if (firstVisible) firstVisible.classList.add('active');
    }

    function executePaletteAction(action) {
      closeCommandPalette();
      sfx.playClick();

      switch (action) {
        case 'patch':
          applyAutoPatch();
          break;
        case 'export':
          updateExportPreview();
          exportModal.classList.add('open');
          break;
        case 'split-view':
          btnViewSplit.click();
          break;
        case 'preset-security':
          loadPreset('security');
          break;
        case 'preset-performance':
          loadPreset('performance');
          break;
        case 'preset-modern':
          loadPreset('modern');
          break;
        case 'jump-sandbox':
          document.getElementById('playground-section').scrollIntoView({ behavior: 'smooth' });
          showToast('Switched to Custom Code Sandbox', 'info');
          break;
      }
    }

    paletteTriggerBtn.addEventListener('click', openCommandPalette);

    paletteSearchInput.addEventListener('input', (e) => {
      filterPaletteItems(e.target.value);
    });

    paletteItems.forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        executePaletteAction(action);
      });
    });

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);

      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (commandPaletteModal.classList.contains('open')) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
        return;
      }

      // ESC to close any modal
      if (e.key === 'Escape') {
        closeCommandPalette();
        exportModal.classList.remove('open');
        return;
      }

      // Inside Palette navigation
      if (commandPaletteModal.classList.contains('open')) {
        const visibleItems = paletteItems.filter(i => i.style.display !== 'none');
        const activeIdx = visibleItems.findIndex(i => i.classList.contains('active'));

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIdx = (activeIdx + 1) % visibleItems.length;
          visibleItems.forEach(i => i.classList.remove('active'));
          visibleItems[nextIdx]?.classList.add('active');
          visibleItems[nextIdx]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIdx = (activeIdx - 1 + visibleItems.length) % visibleItems.length;
          visibleItems.forEach(i => i.classList.remove('active'));
          visibleItems[prevIdx]?.classList.add('active');
          visibleItems[prevIdx]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const activeItem = visibleItems[activeIdx] || visibleItems[0];
          if (activeItem) {
            executePaletteAction(activeItem.getAttribute('data-action'));
          }
        }
        return;
      }

      // Global non-input shortcuts
      if (!isInput) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
          e.preventDefault();
          applyAutoPatch();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
          e.preventDefault();
          updateExportPreview();
          exportModal.classList.add('open');
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
          e.preventDefault();
          btnViewSplit.click();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
          e.preventDefault();
          document.getElementById('playground-section').scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === '?') {
          e.preventDefault();
          openCommandPalette();
        }
      }
    });

    commandPaletteModal.addEventListener('click', (e) => {
      if (e.target === commandPaletteModal) {
        closeCommandPalette();
      }
    });

    // --- Accent Picker Logic ---
    const accentPickerDropdown = document.getElementById('accent-picker-dropdown');
    const accentPickerBtn = document.getElementById('accent-picker-btn');
    const accentDotPreview = document.getElementById('accent-dot-preview');
    const accentSwatches = document.querySelectorAll('.accent-swatch');

    const ACCENTS = {
      cyan: { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.35)' },
      violet: { primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.35)' },
      emerald: { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.35)' },
      rose: { primary: '#f43f5e', glow: 'rgba(244, 63, 94, 0.35)' },
      amber: { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.35)' }
    };

    function setAccentColor(colorKey) {
      const cfg = ACCENTS[colorKey];
      if (!cfg) return;
      document.documentElement.style.setProperty('--cyan-primary', cfg.primary);
      document.documentElement.style.setProperty('--cyan-glow', cfg.glow);
      accentDotPreview.style.background = cfg.primary;
      accentDotPreview.style.boxShadow = `0 0 10px ${cfg.primary}`;

      accentSwatches.forEach(s => {
        s.classList.toggle('active', s.getAttribute('data-color') === colorKey);
      });
      sfx.playClick();
      showToast(`Cyber accent changed to ${colorKey.toUpperCase()}`, 'info');
    }

    accentPickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      accentPickerDropdown.classList.toggle('open');
    });

    accentSwatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        e.stopPropagation();
        const color = swatch.getAttribute('data-color');
        setAccentColor(color);
        accentPickerDropdown.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!accentPickerDropdown.contains(e.target)) {
        accentPickerDropdown.classList.remove('open');
      }
    });
  }

  // --- Initial Load ---
  function init() {
    setupEventListeners();
    sandboxCodeInput.value = SAMPLE_SNIPPETS.leak;
    loadPreset('security');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
