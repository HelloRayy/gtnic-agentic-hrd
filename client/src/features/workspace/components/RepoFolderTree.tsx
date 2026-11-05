import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  FileSpreadsheet,
  FileCheck,
} from 'lucide-react';
import type { IdeFileSnippet } from '../types.js';

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children?: TreeNode[];
  snippetId?: string;
  isVerified?: boolean;
}

interface RepoFolderTreeProps {
  repoName: string;
  filePaths?: string[];
  snippets: IdeFileSnippet[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  searchQuery?: string;
  isAudited?: boolean;
  defaultOpen?: boolean;
}

function getFileIcon(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.json')) return <FileJson size={13} className="text-[#e2a36b] shrink-0" />;
  if (lower.endsWith('.yml') || lower.endsWith('.yaml') || lower.endsWith('.md')) {
    return <FileText size={13} className="text-[#d9756c] shrink-0" />;
  }
  if (lower.endsWith('.csv') || lower.endsWith('.xlsx')) {
    return <FileSpreadsheet size={13} className="text-[#2b8a3e] shrink-0" />;
  }
  if (lower.includes('test') || lower.includes('spec')) {
    return <FileCheck size={13} className="text-[#7285d5] shrink-0" />;
  }
  return <FileCode size={13} className="text-[#58a6ff] shrink-0" />;
}

function buildTree(
  filePaths: string[] = [],
  snippets: IdeFileSnippet[] = [],
  repoName: string
): TreeNode[] {
  const rootNodes: TreeNode[] = [];

  const getOrCreateFolder = (parentChildren: TreeNode[], folderName: string, folderPath: string): TreeNode => {
    let folder = parentChildren.find((c) => c.isFolder && c.name === folderName);
    if (!folder) {
      folder = { name: folderName, path: folderPath, isFolder: true, children: [] };
      parentChildren.push(folder);
    }
    return folder;
  };

  const pathSet = new Set<string>();
  for (const p of filePaths) {
    const clean = p.replace(new RegExp(`^${repoName}/`), '').trim();
    if (clean) pathSet.add(clean);
  }
  for (const s of snippets) {
    const clean = s.filePath.replace(new RegExp(`^${repoName}/`), '').trim();
    if (clean) pathSet.add(clean);
  }

  if (pathSet.size === 0) {
    pathSet.add('src/index.ts');
    pathSet.add('package.json');
    pathSet.add('README.md');
  }

  for (const fullPath of pathSet) {
    const parts = fullPath.split('/').filter(Boolean);
    let currentChildren = rootNodes;
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = i === parts.length - 1;

      if (isLast) {
        const matchingSnippet = snippets.find(
          (s) =>
            s.fileName.toLowerCase() === part.toLowerCase() ||
            s.filePath.endsWith(fullPath) ||
            s.id === part
        );
        currentChildren.push({
          name: part,
          path: currentPath,
          isFolder: false,
          snippetId: matchingSnippet?.id,
          isVerified: matchingSnippet?.callouts.some((c) => c.type === 'VERIFIED'),
        });
      } else {
        const folder = getOrCreateFolder(currentChildren, part, currentPath);
        currentChildren = folder.children!;
      }
    }
  }

  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    nodes.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    });
    for (const n of nodes) {
      if (n.children) sortNodes(n.children);
    }
    return nodes;
  };

  return sortNodes(rootNodes);
}

export const RepoFolderTree: React.FC<RepoFolderTreeProps> = ({
  repoName,
  filePaths = [],
  snippets,
  activeTabId,
  onSelectTab,
  searchQuery = '',
  isAudited = true,
  defaultOpen = true,
}) => {
  const [isRepoOpen, setIsRepoOpen] = useState(defaultOpen);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    src: true,
    '.github': true,
    workflows: true,
  });

  const tree = useMemo(() => buildTree(filePaths, snippets, repoName), [filePaths, snippets, repoName]);
  const q = searchQuery.toLowerCase().trim();

  const toggleFolder = (folderPath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: prev[folderPath] === undefined ? false : !prev[folderPath],
    }));
  };

  const renderNode = (node: TreeNode, depth: number): React.ReactNode => {
    if (q) {
      const matchesSelf = node.name.toLowerCase().includes(q);
      const hasMatchingChild = (n: TreeNode): boolean =>
        n.name.toLowerCase().includes(q) || (n.children?.some(hasMatchingChild) ?? false);
      if (!matchesSelf && !hasMatchingChild(node)) return null;
    }

    const paddingLeft = depth * 14 + 10;

    if (node.isFolder) {
      const isOpen = openFolders[node.path] !== false;
      const count = node.children?.length || 0;

      return (
        <div key={node.path} className="select-none min-w-0">
          <button
            type="button"
            onClick={(e) => toggleFolder(node.path, e)}
            style={{ paddingLeft: `${paddingLeft}px` }}
            className="w-full flex items-center justify-between gap-1.5 py-1 pr-2 rounded text-[#4d5160] hover:text-[#181a20] hover:bg-[#edece6] text-xs cursor-pointer transition-colors min-w-0"
          >
            <div className="flex items-center gap-1.5 truncate min-w-0">
              {isOpen ? <ChevronDown size={12} className="shrink-0 text-[#8c909e]" /> : <ChevronRight size={12} className="shrink-0 text-[#8c909e]" />}
              {isOpen ? (
                <FolderOpen size={13} className="text-[#7285d5] shrink-0" />
              ) : (
                <Folder size={13} className="text-[#7285d5] shrink-0" />
              )}
              <span className="truncate text-xs font-medium">{node.name}</span>
            </div>
            <span className="text-[10px] text-[#8c909e] font-mono shrink-0">{count}</span>
          </button>
          {isOpen && node.children && (
            <div className="space-y-0.5 min-w-0">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    const tabKey = node.snippetId ? `code:${node.snippetId}` : `code:${node.path}`;
    const isActive = activeTabId === tabKey;

    return (
      <button
        key={node.path}
        type="button"
        onClick={() => onSelectTab(tabKey)}
        style={{ paddingLeft: `${paddingLeft + 14}px` }}
        className={`w-full flex items-center justify-between gap-1.5 py-1 pr-2 rounded text-left transition-colors cursor-pointer min-w-0 ${
          isActive
            ? 'bg-[#e8ebf8] text-[#384c98] font-semibold border-l-2 border-[#7285d5]'
            : 'text-[#4d5160] hover:text-[#181a20] hover:bg-[#edece6]'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate min-w-0">
          {getFileIcon(node.name)}
          <span className="truncate text-xs">{node.name}</span>
        </div>
        {node.isVerified && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#2b8a3e] shrink-0" title="AST Verified" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-0.5 min-w-0">
      {/* Root Repo Folder Header */}
      <button
        type="button"
        onClick={() => setIsRepoOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-1.5 px-2 py-1.5 rounded text-[#333641] hover:text-[#181a20] hover:bg-[#edece6] font-semibold text-xs tracking-wider transition-colors cursor-pointer min-w-0"
      >
        <div className="flex items-center gap-1.5 truncate min-w-0">
          {isRepoOpen ? <ChevronDown size={13} className="shrink-0" /> : <ChevronRight size={13} className="shrink-0" />}
          {isRepoOpen ? (
            <FolderOpen size={14} className="text-[#596aa9] shrink-0" />
          ) : (
            <Folder size={14} className="text-[#596aa9] shrink-0" />
          )}
          <span className="truncate font-bold text-xs">{repoName}</span>
        </div>
        {isAudited ? (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#e7f5ea] text-[#2b8a3e] font-mono shrink-0">
            repo
          </span>
        ) : null}
      </button>

      {/* Expanded Repo Contents */}
      {isRepoOpen && (
        <div className="border-l border-[#e5e3dc] ml-3.5 space-y-0.5 min-w-0">
          {tree.map((node) => renderNode(node, 0))}
        </div>
      )}
    </div>
  );
};

export default RepoFolderTree;
