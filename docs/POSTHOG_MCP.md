# PostHog MCP in Cursor

Lets the AI query your PostHog project (events, flags, errors, insights) from chat.

**Not the same key as the app:** use a **personal API key** (`phx_...`), not the project token (`phc_...`) used in the mobile app.

---

## Option A — Run the wizard (easiest)

In **your own** PowerShell or Terminal.app (not the agent shell — the wizard needs an interactive UI):

```powershell
cd c:\dev\theob
npx @posthog/wizard mcp add
```

- Choose **Install MCP** when prompted.
- It detects **Cursor** and updates your MCP config.
- First use in Cursor: log in to PostHog (OAuth) if you did not pass `--api-key`.

**Non-interactive (if you have a personal API key):**

```powershell
$env:POSTHOG_WIZARD_CI="true"
$env:POSTHOG_WIZARD_API_KEY="phx_your_key"
$env:POSTHOG_WIZARD_PROJECT_ID="401878"
$env:POSTHOG_WIZARD_REGION="us"
npx @posthog/wizard mcp add
```

---

## Option B — Cursor PostHog plugin

1. Cursor → **Settings** → **Plugins** (or Marketplace).
2. Install **PostHog** plugin if not already enabled.
3. MCP server URL: `https://mcp.posthog.com/mcp`
4. Authenticate when first using a PostHog tool.

---

## Option C — Manual `mcp.json`

1. Create a personal API key: [PostHog → Settings → Personal API keys](https://us.posthog.com/settings/user-api-keys) → use **MCP Server** preset → scopes include `project:read`, `insight:write`, etc.
2. Copy [`.cursor/mcp.json.example`](../.cursor/mcp.json.example) to **either**:
   - **Project:** `c:\dev\theob\.cursor\mcp.json` (this repo only), or
   - **User:** `%USERPROFILE%\.cursor\mcp.json` (all projects)
3. Replace `phx_YOUR_PERSONAL_API_KEY` and save.
4. Cursor → **Settings** → **MCP** → confirm **posthog** is green.
5. Reload Cursor window.

Minimal OAuth-only config (no key in file — login on first tool use):

```json
{
  "mcpServers": {
    "posthog": {
      "url": "https://mcp.posthog.com/mcp"
    }
  }
}
```

Scoped to your default project:

```json
{
  "mcpServers": {
    "posthog": {
      "url": "https://mcp.posthog.com/mcp",
      "headers": {
        "x-posthog-project-id": "401878"
      }
    }
  }
}
```

---

## Verify

In Cursor chat, ask: *“List recent PostHog events for project 401878”* or *“What does the order_placed funnel look like?”*

If tools fail, check MCP status in Settings and re-auth.

---

## Why the agent could not run the wizard

`npx @posthog/wizard mcp add` uses a terminal UI (Ink) that requires **interactive** stdin. Cursor’s automated shell does not support that, so you see `Raw mode is not supported`. Run the same command in your normal terminal.
