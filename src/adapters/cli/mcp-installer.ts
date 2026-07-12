import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export async function installMcpServer(target: 'cursor' | 'claude' | 'all', binaryPath: string): Promise<string[]> {
  const installedTargets: string[] = [];
  const resolvedBinaryPath = path.resolve(binaryPath);

  const home = os.homedir();
  let appData = '';

  if (process.platform === 'win32') {
    appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
  } else if (process.platform === 'darwin') {
    appData = path.join(home, 'Library', 'Application Support');
  } else {
    appData = path.join(home, '.config');
  }

  // 1. Install Claude Desktop MCP
  if (target === 'claude' || target === 'all') {
    let claudeConfigPath = '';
    if (process.platform === 'win32') {
      claudeConfigPath = path.join(appData, 'Claude', 'claude_desktop_config.json');
    } else if (process.platform === 'darwin') {
      claudeConfigPath = path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    } else {
      claudeConfigPath = path.join(home, '.config', 'Claude', 'claude_desktop_config.json');
    }

    try {
      await fs.mkdir(path.dirname(claudeConfigPath), { recursive: true });
      let config: any = {};
      try {
        const existing = await fs.readFile(claudeConfigPath, 'utf8');
        config = JSON.parse(existing);
      } catch {
        // No existing config, start fresh
      }

      if (!config.mcpServers) config.mcpServers = {};
      config.mcpServers['dotstack'] = {
        command: 'node',
        args: [resolvedBinaryPath, 'mcp', 'start'],
        env: {}
      };

      await fs.writeFile(claudeConfigPath, JSON.stringify(config, null, 2), 'utf8');
      installedTargets.push(`Claude Desktop config updated at: ${claudeConfigPath}`);
    } catch (err: any) {
      console.error(`Failed to install Claude Desktop MCP: ${err.message}`);
    }

    // 1b. Install Claude Code CLI MCP (~/.claude.json)
    const claudeCodePath = path.join(home, '.claude.json');
    try {
      let config: any = {};
      try {
        const existing = await fs.readFile(claudeCodePath, 'utf8');
        config = JSON.parse(existing);
      } catch {
        // No existing config
      }

      if (!config.mcpServers) config.mcpServers = {};
      config.mcpServers['dotstack'] = {
        command: 'node',
        args: [resolvedBinaryPath, 'mcp', 'start']
      };

      await fs.writeFile(claudeCodePath, JSON.stringify(config, null, 2), 'utf8');
      installedTargets.push(`Claude Code CLI config updated at: ${claudeCodePath}`);
    } catch (err: any) {
      console.error(`Failed to install Claude Code MCP: ${err.message}`);
    }
  }

  // 2. Install Cursor MCP
  if (target === 'cursor' || target === 'all') {
    const cursorConfigPath = path.join(appData, 'Cursor', 'User', 'globalStorage', 'storage.json');
    try {
      await fs.mkdir(path.dirname(cursorConfigPath), { recursive: true });
      let config: any = {};
      try {
        const existing = await fs.readFile(cursorConfigPath, 'utf8');
        config = JSON.parse(existing);
      } catch {
        // No existing config
      }

      // Cursor's storage.json structure uses "mcpServers" key
      if (!config.mcpServers) {
        config.mcpServers = {};
      }
      
      config.mcpServers['dotstack'] = {
        name: 'dotstack',
        type: 'stdio',
        command: 'node',
        args: [resolvedBinaryPath, 'mcp', 'start'],
        env: {},
        enabled: true
      };

      await fs.writeFile(cursorConfigPath, JSON.stringify(config, null, 2), 'utf8');
      installedTargets.push(`Cursor configuration updated at: ${cursorConfigPath}`);
    } catch (err: any) {
      console.error(`Failed to install Cursor MCP: ${err.message}`);
    }
  }

  return installedTargets;
}
