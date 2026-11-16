export const REMOTE_CSS = `
:host { display: block; }

.angular-app { color: var(--demo-fg); font-family: system-ui, sans-serif; }
.angular-app .card { background: var(--demo-surface); border: 1px solid var(--demo-border); border-radius: 8px; padding: 16px; margin-bottom: 16px; }
.angular-app .btn { background: var(--demo-primary); color: var(--demo-on-primary); border: 0; border-radius: 6px; padding: 8px 14px; margin-right: 8px; font: inherit; cursor: pointer; }
.angular-app .actions { margin-top: 12px; }
.angular-app a { color: var(--demo-primary); }
.angular-app nav a { margin-right: 16px; text-decoration: none; }
.angular-app nav a.active { font-weight: 700; }

/* Intentionally unscoped: without Shadow DOM this rule also hits the shell's own .probe element. */
.probe { background: gold; color: #000; }
`;
