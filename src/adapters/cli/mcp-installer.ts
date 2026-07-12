import fs from 'fs/promises';
import path from 'path';
import os from 'os';

type InstallTarget = 'claude' | 'cursor' | 'codex' | 'vscode' | 'windsurf' | 'all';

/**
 * Safely read and parse a JSON config file.
 * Returns an empty object if the file doesn't exist or is invalid.
 */
async function readJsonConfig(filePath: string): Promise<any> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Write a JSON config file, creating parent directories if needed.
 */
async function writeJsonConfig(filePath: string, config: any): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(config, null, 2), 'utf8');
}

/**
 * Inject a standard mcpServers entry into a JSON config.
 */
function injectStdioMcp(config: any, key: string, entry: Record<string, any>): any {
  if (!config[key]) config[key] = {};
  config[key]['dotstack'] = entry;
  return config;
}

export async function installMcpServer(target: InstallTarget, binaryPath: string): Promise<string[]> {
  const installed: string[] = [];
  const bin = path.resolve(binaryPath);
  const home = os.homedir();
  const isWin = process.platform === 'win32';
  const isMac = process.platform === 'darwin';

  let appData = '';
  if (isWin) {
    appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
  } else if (isMac) {
    appData = path.join(home, 'Library', 'Application Support');
  } else {
    appData = path.join(home, '.config');
  }

  const stdEntry = { command: 'node', args: [bin, 'mcp', 'start'] };

  // ──────────────────────────────────────────────
  // 1. Claude Desktop  (claude_desktop_config.json)
  // ──────────────────────────────────────────────
  if (target === 'claude' || target === 'all') {
    const claudeDir = isWin ? path.join(appData, 'Claude')
                    : isMac ? path.join(home, 'Library', 'Application Support', 'Claude')
                    :         path.join(home, '.config', 'Claude');
    const cfgPath = path.join(claudeDir, 'claude_desktop_config.json');
    try {
      const cfg = await readJsonConfig(cfgPath);
      injectStdioMcp(cfg, 'mcpServers', { ...stdEntry, env: {} });
      await writeJsonConfig(cfgPath, cfg);
      installed.push(`✔ Claude Desktop  → ${cfgPath}`);
    } catch (e: any) { console.error(`✘ Claude Desktop failed: ${e.message}`); }

    // 1b. Claude Code CLI  (~/.claude.json)
    const ccPath = path.join(home, '.claude.json');
    try {
      const cfg = await readJsonConfig(ccPath);
      injectStdioMcp(cfg, 'mcpServers', stdEntry);
      await writeJsonConfig(ccPath, cfg);
      installed.push(`✔ Claude Code CLI → ${ccPath}`);
    } catch (e: any) { console.error(`✘ Claude Code CLI failed: ${e.message}`); }
  }

  // ──────────────────────────────────────────────
  // 2. Cursor  (storage.json under mcpServers)
  // ──────────────────────────────────────────────
  if (target === 'cursor' || target === 'all') {
    const cfgPath = path.join(appData, 'Cursor', 'User', 'globalStorage', 'storage.json');
    try {
      const cfg = await readJsonConfig(cfgPath);
      injectStdioMcp(cfg, 'mcpServers', {
        name: 'dotstack', type: 'stdio', ...stdEntry, env: {}, enabled: true
      });
      await writeJsonConfig(cfgPath, cfg);
      installed.push(`✔ Cursor          → ${cfgPath}`);
    } catch (e: any) { console.error(`✘ Cursor failed: ${e.message}`); }
  }

  // ──────────────────────────────────────────────
  // 3. VS Code / GitHub Copilot  (settings.json)
  // ──────────────────────────────────────────────
  if (target === 'vscode' || target === 'all') {
    const vsDir = isWin ? path.join(appData, 'Code', 'User')
                : isMac ? path.join(home, 'Library', 'Application Support', 'Code', 'User')
                :         path.join(home, '.config', 'Code', 'User');
    const cfgPath = path.join(vsDir, 'settings.json');
    try {
      const cfg = await readJsonConfig(cfgPath);
      if (!cfg['github.copilot.chat.mcp.servers']) cfg['github.copilot.chat.mcp.servers'] = {};
      cfg['github.copilot.chat.mcp.servers']['dotstack'] = stdEntry;
      await writeJsonConfig(cfgPath, cfg);
      installed.push(`✔ VS Code Copilot → ${cfgPath}`);
    } catch (e: any) { console.error(`✘ VS Code Copilot failed: ${e.message}`); }
  }

  // ──────────────────────────────────────────────
  // 4. Windsurf  (mcp_config.json)
  // ──────────────────────────────────────────────
  if (target === 'windsurf' || target === 'all') {
    const wsDir = isWin ? path.join(appData, 'Windsurf')
               : isMac ? path.join(home, 'Library', 'Application Support', 'Windsurf')
               :         path.join(home, '.config', 'Windsurf');
    const cfgPath = path.join(wsDir, 'mcp_config.json');
    try {
      const cfg = await readJsonConfig(cfgPath);
      injectStdioMcp(cfg, 'mcpServers', { ...stdEntry, env: {} });
      await writeJsonConfig(cfgPath, cfg);
      installed.push(`✔ Windsurf        → ${cfgPath}`);
    } catch (e: any) { console.error(`✘ Windsurf failed: ${e.message}`); }
  }

  // ──────────────────────────────────────────────
  // 5. Codex CLI  (~/.codex/config.json)
  // ──────────────────────────────────────────────
  if (target === 'codex' || target === 'all') {
    const cfgPath = path.join(home, '.codex', 'config.json');
    try {
      const cfg = await readJsonConfig(cfgPath);
      if (!cfg.mcp_servers) cfg.mcp_servers = {};
      cfg.mcp_servers['dotstack'] = stdEntry;
      await writeJsonConfig(cfgPath, cfg);
      installed.push(`✔ Codex CLI       → ${cfgPath}`);
    } catch (e: any) { console.error(`✘ Codex CLI failed: ${e.message}`); }
  }

  // ──────────────────────────────────────────────
  // 6. Project-level .mcp.json  (works with any MCP-compatible agent)
  // ──────────────────────────────────────────────
  if (target === 'all') {
    const projectMcpPath = path.join(process.cwd(), '.mcp.json');
    try {
      const cfg = await readJsonConfig(projectMcpPath);
      injectStdioMcp(cfg, 'mcpServers', stdEntry);
      await writeJsonConfig(projectMcpPath, cfg);
      installed.push(`✔ Project .mcp.json → ${projectMcpPath}`);
    } catch (e: any) { console.error(`✘ Project .mcp.json failed: ${e.message}`); }
  }

  return installed;
}
