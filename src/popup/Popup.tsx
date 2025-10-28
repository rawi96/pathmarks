import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';

type Pathmark = { title: string; path: string };

function usePathmarks() {
  const [pathmarks, setPathmarks] = useState<Pathmark[]>([]);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    chrome.storage.local.get('pathmarks', (res) => {
      const stored = res.pathmarks || {};
      const paths = Array.isArray(stored) ? stored : stored.pathmarks || [];
      setPathmarks(paths);
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.url) {
        try {
          const url = new URL(tab.url);
          setBaseUrl(url.origin);
        } catch {
          setBaseUrl('');
        }
      }
    });
  }, []);

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

  return { pathmarks, openNextToCurrentTab };
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
  isFiltered,
}: {
  pathmarks: Pathmark[];
  onGo: (path: string) => void;
  isFiltered: boolean;
}) =>
  pathmarks.length === 0 ? (
    <div className="text-gray-500 text-sm">
      {isFiltered ? (
        <p>No pathmarks match your search.</p>
      ) : (
        <>
          <p>No pathmarks found.</p>
          <button
            onClick={() => chrome.runtime.openOptionsPage()}
            className="mt-1 text-blue-600 hover:underline"
          >
            Add some
          </button>
        </>
      )}
    </div>
  ) : (
    <ul className="space-y-2">
      {pathmarks.map((pm, idx) => (
        <PathmarkItem key={idx} title={pm.title} path={pm.path} onClick={() => onGo(pm.path)} />
      ))}
    </ul>
  );

const SearchInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="mb-4">
    <input
      type="text"
      placeholder="Search pathmarks..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Popup = () => {
  const { pathmarks, openNextToCurrentTab } = usePathmarks();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPathmarks = useMemo(
    () =>
      pathmarks.filter(
        (pm) =>
          pm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pm.path.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [pathmarks, searchQuery]
  );

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

      {pathmarks.length > 0 && <SearchInput value={searchQuery} onChange={setSearchQuery} />}

      <PathmarkList
        pathmarks={filteredPathmarks}
        onGo={openNextToCurrentTab}
        isFiltered={searchQuery.length > 0}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Popup />);
