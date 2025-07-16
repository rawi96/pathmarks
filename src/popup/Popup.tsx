import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';

type Pathmark = { title: string; path: string };
type Env = { label: string; origin: string };

function usePathmarks() {
  const [pathmarks, setPathmarks] = useState<Pathmark[]>([]);
  const [envs, setEnvs] = useState<Env[]>([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    chrome.storage.local.get('pathmarks', (res) => {
      const stored = res.pathmarks || {};
      const paths = Array.isArray(stored) ? stored : stored.pathmarks || [];
      const envList = Array.isArray(stored?.envs) ? stored.envs : [];
      setPathmarks(paths);
      setEnvs(envList);
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.url) {
        try {
          const url = new URL(tab.url);
          setBaseUrl(url.origin);
          setCurrentPath(url.pathname + url.search + url.hash);
        } catch {
          setBaseUrl('');
        }
      }
    });
  }, []);

  const openSamePathInEnv = (targetOrigin: string) => {
    const fullUrl = targetOrigin + currentPath;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (!currentTab) return;
      chrome.tabs.create({
        url: fullUrl,
        index: currentTab.index + 1,
        active: true,
      });
    });
  };

  const openNextToCurrentTab = (relativePath: string) => {
    const fullUrl = baseUrl + relativePath;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (!currentTab) return;
      chrome.tabs.create({
        url: fullUrl,
        index: currentTab.index + 1,
        active: true,
      });
    });
  };

  return { pathmarks, envs, currentPath, openSamePathInEnv, openNextToCurrentTab };
}

const PathmarkItem = ({
  title,
  path,
  onClick,
}: {
  title: string;
  path: string;
  onClick: () => void;
}) => (
  <li>
    <button
      onClick={onClick}
      className="w-full text-left bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded break-words"
    >
      <div className="font-medium">{title}</div>
      <div className="text-xs text-gray-500">{path}</div>
    </button>
  </li>
);

const PathmarkList = ({
  pathmarks,
  onGo,
}: {
  pathmarks: Pathmark[];
  onGo: (path: string) => void;
}) =>
  pathmarks.length === 0 ? (
    <div className="text-gray-500 text-sm">
      <p>No pathmarks found.</p>
      <button
        onClick={() => chrome.runtime.openOptionsPage()}
        className="mt-1 text-blue-600 hover:underline"
      >
        Add some
      </button>
    </div>
  ) : (
    <ul className="space-y-2">
      {pathmarks.map((pm, idx) => (
        <PathmarkItem key={idx} title={pm.title} path={pm.path} onClick={() => onGo(pm.path)} />
      ))}
    </ul>
  );

const EnvSelector = ({
  envs,
  onSelect,
  currentPath,
}: {
  envs: Env[];
  onSelect: (origin: string) => void;
  currentPath: string;
}) =>
  envs.length === 0 ? null : (
    <div className="mb-4">
      <label className="block text-xs text-gray-500 mb-1">Switch Environment</label>
      <select
        defaultValue=""
        onChange={(e) => e.target.value && onSelect(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
      >
        <option value="" disabled></option>
        {envs.map((env, idx) => (
          <option key={idx} value={env.origin}>
            {env.label} – {env.origin + currentPath}
          </option>
        ))}
      </select>
    </div>
  );

const Popup = () => {
  const { pathmarks, envs, openSamePathInEnv, openNextToCurrentTab, currentPath } = usePathmarks();

  return (
    <div className="w-96 p-4 bg-white text-sm font-sans text-gray-900">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="rocket-container">
            <img src="icons/icon128.png" alt="Pathmarks Logo" className="rocket rounded" />
          </div>
          <h1 className="text-lg font-semibold">Pathmarks</h1>
        </div>
        <div className="flex gap-4 items-center text-sm">
          <a
            href="https://github.com/rawi96/pathmarks"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub
          </a>
          <button
            onClick={() => chrome.runtime.openOptionsPage()}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
        </div>
      </div>

      <EnvSelector envs={envs} onSelect={openSamePathInEnv} currentPath={currentPath} />

      {pathmarks.length > 0 && <div className="block text-xs text-gray-500 mb-1">Switch Path</div>}

      <PathmarkList pathmarks={pathmarks} onGo={openNextToCurrentTab} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Popup />);
