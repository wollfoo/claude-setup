#!/usr/bin/env node
/*
  SDK sidecar – UserPromptSubmit hook entrypoint (đa nền tảng)
  - Đọc JSON payload từ stdin (Claude Code hook event)
  - Quyết định Sub‑Agent + confidence + reasons + flags + waves theo heuristic đơn giản (demo)
  - In kết quả ra stdout để hiển thị ngay trong CLI
  - Không cần phụ thuộc ngoài; có thể nâng cấp để parse agents/**, MCP.md, commands/ sau
*/

const fs = require('fs');

function readStdin(timeoutMs = 250) {
  return new Promise((resolve) => {
    // Nếu chạy trực tiếp trong terminal (không có dữ liệu từ stdin), trả về rỗng ngay để tránh treo
    if (process.stdin.isTTY) {
      return resolve('');
    }
    const chunks = [];
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve(Buffer.concat(chunks).toString('utf8'));
    };
    const timer = setTimeout(() => finish(), timeoutMs);
    process.stdin.on('data', (c) => {
      chunks.push(Buffer.from(c));
    });
    process.stdin.on('end', () => {
      clearTimeout(timer);
      finish();
    });
    process.stdin.on('error', () => {
      clearTimeout(timer);
      finish();
    });
  });
}

function normalizePrompt(event) {
  if (!event || typeof event !== 'object') return '';
  // Thử các tên trường phổ biến; fallback rỗng nếu không có
  return (
    event.prompt ||
    event.user_prompt ||
    event.message ||
    event.input ||
    ''
  );
}

function readCliPromptArg() {
  const i = process.argv.findIndex(a => a === '--prompt' || a === '-p');
  if (i >= 0 && i + 1 < process.argv.length) return process.argv[i + 1];
  return '';
}

function decide(prompt) {
  const p = (prompt || '').toLowerCase();
  const reasons = [];
  let agent = 'universal-agent';
  let confidence = 0.62; // dưới ngưỡng 0.7 sẽ fallback
  const flags = ['--seq'];
  const waves = ['planning'];

  // Heuristic demo – có thể thay bằng mapping từ ORCHESTRATOR.md
  if (/react|component|frontend|ui|jsx|tsx|tailwind/.test(p)) {
    agent = 'react-component-architect';
    confidence = 0.82;
    reasons.push('domain:frontend', 'pattern:ui');
    waves.push('implementation');
  } else if (/django|fastapi|rails|laravel|api|endpoint|sql|database|db|query/.test(p)) {
    agent = 'backend-api-expert';
    confidence = 0.8;
    reasons.push('domain:backend', 'pattern:api/db');
    waves.push('implementation');
  } else if (/optimi[sz]e|performance|latency|throughput|memory|cpu|profil(e|ing)/.test(p)) {
    agent = 'performance-engineer';
    confidence = 0.8;
    reasons.push('domain:performance');
    waves.push('optimization');
    flags.push('--perf-watch');
  } else if (/test|unit|integration|e2e|playwright|jest|pytest/.test(p)) {
    agent = 'qa-automation';
    confidence = 0.78;
    reasons.push('domain:quality', 'pattern:testing');
    waves.push('validation');
  } else if (/document|docs|readme|guide|how to|hướng dẫn/.test(p)) {
    agent = 'documentation-scribe';
    confidence = 0.74;
    reasons.push('domain:documentation');
  } else {
    reasons.push('fallback:universal');
  }

  return { agent, confidence, reasons, flags, waves };
}

(async () => {
  try {
    const raw = await readStdin();
    let event = {};
    try { event = JSON.parse(raw); } catch (_) { /* ignore malformed */ }
    const prompt = normalizePrompt(event) || readCliPromptArg();
    if (!prompt) {
      console.log('[router] no prompt payload detected');
      console.log('[hint] use via Claude Code hook (UserPromptSubmit) OR run:');
      console.log('       node sdk/main.js --prompt "Your prompt here"');
      process.exit(0);
    }
    const decision = decide(prompt);

    // In kết quả (Claude Code sẽ hiển thị ngay bên dưới prompt)
    console.log(`[router] agent=${decision.agent} conf=${decision.confidence}`);
    console.log(`[router] reasons=${decision.reasons.join(', ')}`);
    console.log(`[router] flags=${decision.flags.join(' ')}`);
    console.log(`[router] waves=${decision.waves.join(' -> ')}`);

    // JSON để tích hợp nâng cao nếu cần (grep dễ):
    console.log('::router-decision:: ' + JSON.stringify(decision));

    // Exit code 0 để không chặn flow bình thường của Claude Code
    process.exit(0);
  } catch (err) {
    // Không làm gián đoạn CLI – log tối thiểu
    try { fs.appendFileSync('.router-errors.log', String(err) + '\n'); } catch(_) {}
    process.exit(0);
  }
})();
