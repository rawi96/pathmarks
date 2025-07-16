import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';

type Env = { label: string; origin: string };
type Pathmark = { title: string; path: string };
type Config = { envs?: Env[]; pathmarks: Pathmark[] };

function usePathmarksConfig() {
  const [rawInput, setRawInput] = useState('');
  const [status, setStatus] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    chrome.storage.local.get('pathmarks', (res) => {
      const initial: Config = res.pathmarks || { pathmarks: [] };
      const formatted = JSON.stringify(initial, null, 2);
      setRawInput(formatted);
      setIsValid(Array.isArray(initial.pathmarks));
    });
  }, []);

  const validateJson = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      const valid = Array.isArray(parsed?.pathmarks);
      setIsValid(valid);
    } catch {
      setIsValid(false);
    }
  };

  const updateInput = (value: string) => {
    setRawInput(value);
    validateJson(value);
  };

  const save = () => {
    try {
      const parsed = JSON.parse(rawInput);
      const formatted = JSON.stringify(parsed, null, 2);
      chrome.storage.local.set({ pathmarks: parsed }, () => {
        setRawInput(formatted);
        setIsValid(true);
        setStatus('✅ Saved!');
        setTimeout(() => setStatus(''), 2000);
      });
    } catch {
      setStatus('❌ Invalid JSON');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rawInput);
    setStatus('📋 Copied!');
    setTimeout(() => setStatus(''), 1500);
  };

  return { rawInput, updateInput, save, isValid, status, copyToClipboard };
}

const ConfigEditor = ({
  value,
  onChange,
  isValid,
}: {
  value: string;
  onChange: (val: string) => void;
  isValid: boolean;
}) => (
  <div className="relative">
    <textarea
      className={`w-full h-[500px] p-4 border rounded font-mono text-sm resize-none bg-gray-50 focus:outline-none focus:ring-2 ${
        isValid ? 'border-gray-300 focus:ring-blue-500' : 'border-red-500 focus:ring-red-400'
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {!isValid && <div className="absolute bottom-2 right-2 text-xs text-red-500">Invalid JSON</div>}
  </div>
);

const SaveButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded shadow ${
      disabled
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 text-white'
    }`}
  >
    Save
  </button>
);

const CopyButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="text-xs text-blue-600 hover:underline absolute right-0 top-0 mt-2 mr-2"
    title="Copy code to clipboard"
  >
    Copy
  </button>
);

const StatusMessage = ({ text }: { text: string }) =>
  text ? (
    <span
      className={`text-sm ${
        text.includes('✅') || text.includes('📋') ? 'text-green-600' : 'text-red-600'
      }`}
    >
      {text}
    </span>
  ) : null;

const HelperBox = () => (
  <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded p-4">
    <strong>What is this?</strong>
    <br />
    This is your <em>Pathmarks</em> configuration. Define shortcuts to useful paths and environments
    for your project.
    <br />
    You can define:
    <ul className="list-disc ml-5 my-2">
      <li>
        <code>pathmarks</code> – an array of objects with <code>title</code> and <code>path</code>
      </li>
      <li>
        <code>envs</code> – optional list of environments with <code>label</code> and{' '}
        <code>origin</code>
      </li>
    </ul>
    Example:
    <pre className="mt-2 text-[11px] bg-blue-100 p-2 rounded overflow-x-auto">
      {`{
  "envs": [
    { "label": "Production", "origin": "https://app.smartplatform.io" },
    { "label": "Staging", "origin": "https://staging.smartplatform.io" },
    { "label": "Development", "origin": "https://dev.smartplatform.io" },
    { "label": "Local", "origin": "http://localhost:3000" }
  ],
  "pathmarks": [
    { "title": "Dashboard", "path": "/dashboard" },
    { "title": "User Management", "path": "/config/users" },
    { "title": "Admin Panel", "path": "/admin" },
    { "title": "Audit Logs", "path": "/logs/audit" },
    { "title": "Feature Flags", "path": "/config/flags" },
    { "title": "Permission Settings", "path": "/config/permissions" },
    { "title": "API Explorer", "path": "/docs/api" },
    { "title": "System Monitor", "path": "/monitoring/system" },
    { "title": "Error Tracker", "path": "/errors" },
    { "title": "Support Inbox", "path": "/support/inbox" }
  ]
}`}
    </pre>
  </div>
);

const GitHubLink = () => (
  <a
    href="https://github.com/rawi96/pathmarks"
    target="_blank"
    rel="noopener noreferrer"
    className="absolute top-6 right-8 text-sm text-blue-600 hover:underline"
  >
    GitHub
  </a>
);

const Options = () => {
  const { rawInput, updateInput, save, isValid, status, copyToClipboard } = usePathmarksConfig();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 relative">
        <div className="flex items-center mb-4">
          <div className="rocket-container mr-2">
            <img
              src="icons/icon128.png"
              alt="Pathmarks Logo"
              className="rocket w-9 h-9 inline-block align-middle"
            />
          </div>
          <h1 className="text-2xl font-semibold">Pathmarks Configuration</h1>
        </div>
        <GitHubLink />
        <HelperBox />
        <div className="relative">
          <ConfigEditor value={rawInput} onChange={updateInput} isValid={isValid} />
          <CopyButton onClick={copyToClipboard} />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <SaveButton onClick={save} disabled={!isValid} />
          <StatusMessage text={status} />
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Options />);
