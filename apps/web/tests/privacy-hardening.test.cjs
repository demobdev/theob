const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

// Exercise the real components with isolated auth/analytics dependencies.
// No real tracker, backend, subscriptions, credentials or outbound calls.
function loadComponent(relativePath, dependencies, env = {}) {
  const filename = path.join(__dirname, "..", relativePath);
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText;
  const logs = [];
  const exports = {};
  const sandbox = {
    exports,
    process: { env },
    console: {
      log: (...args) => logs.push(args),
      warn: (...args) => logs.push(args),
      error: (...args) => logs.push(args),
    },
    require: (name) => {
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      if (name === "react/jsx-runtime") return require(name);
      throw new Error(`Unexpected dependency: ${name}`);
    },
  };
  vm.runInNewContext(compiled, sandbox, { filename });
  return { component: exports.default, logs };
}

function authHarness(isSignedIn, configured) {
  const calls = [];
  const effects = [];
  const privateProfile = {
    id: "user_fixture_stable",
    fullName: "Privacy Fixture Person",
    primaryEmailAddress: { emailAddress: "privacy-fixture@example.invalid" },
  };
  const loaded = loadComponent("src/components/PostHogAuthSync.tsx", {
    react: { useEffect: (effect, deps) => effects.push({ effect, deps }) },
    "@clerk/nextjs": { useUser: () => ({ user: privateProfile, isSignedIn }) },
    "posthog-js": {
      identify: (...args) => calls.push({ method: "identify", args }),
      reset: (...args) => calls.push({ method: "reset", args }),
    },
  }, configured ? { NEXT_PUBLIC_POSTHOG_KEY: "mock-configured-only" } : {});
  loaded.component();
  effects.forEach(({ effect }) => effect());
  return { ...loaded, calls, effects, privateProfile };
}

test("configured identity sends only stable ID; no profile PII or logs", () => {
  const result = authHarness(true, true);
  assert.equal(result.calls.length, 1);
  assert.equal(result.calls[0].method, "identify");
  assert.equal(result.calls[0].args.length, 1);
  assert.equal(result.calls[0].args[0], result.privateProfile.id);
  const payloads = JSON.stringify(result.calls);
  assert.equal(payloads.includes(result.privateProfile.fullName), false);
  assert.equal(payloads.includes(result.privateProfile.primaryEmailAddress.emailAddress), false);
  assert.equal(result.logs.length, 0);
  assert.equal(result.effects[0].deps.length, 2);
});

test("unconfigured tracking stays silent even with signed-in profile", () => {
  const result = authHarness(true, false);
  assert.equal(result.calls.length, 0);
  assert.equal(result.logs.length, 0);
});

test("signed-out configured tracking resets without an identity payload", () => {
  const result = authHarness(false, true);
  assert.equal(result.calls.length, 1);
  assert.equal(result.calls[0].method, "reset");
  assert.equal(result.calls[0].args.length, 0);
  assert.equal(result.logs.length, 0);
});

const { component: Footer, logs: footerLogs } = loadComponent(
  "src/components/home-alt/AltHomeFooter.tsx",
  {
    "next/link": ({ children, ...props }) => React.createElement("a", props, children),
    "next/image": ({ children, ...props }) => React.createElement("img", props, children),
    "lucide-react": require("lucide-react"),
    "@/lib/localSeo": {
      OB_GOOGLE_REVIEW_URL: "https://maps.app.goo.gl/7R7p87W2GwNvQ9cb7",
      OB_SOCIAL: {
        instagram: "https://www.instagram.com/ownersbox.gvl/",
        facebook: "https://www.facebook.com/people/The-Owners-Box/61572349191177/",
      },
    },
  },
);
const footerHtml = renderToStaticMarkup(React.createElement(Footer));

test("unavailable newsletter has no submission/PII entry path or success claim", () => {
  assert.match(footerHtml, /Email signup is not available yet/);
  assert.doesNotMatch(footerHtml, /<(form|input|textarea)\b/i);
  assert.doesNotMatch(footerHtml, /\baction=|name="(?:firstName|lastName|email)"/i);
  assert.doesNotMatch(footerHtml, /subscribed|thank you|signup complete/i);
  assert.match(footerHtml, /Follow on Instagram/);
  assert.equal(footerLogs.length, 0);
});

if (process.env.PRIVACY_FIXTURE_PATH) {
  fs.writeFileSync(process.env.PRIVACY_FIXTURE_PATH,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Owners Box footer privacy fixture</title></head><body>${footerHtml}</body></html>`);
}
