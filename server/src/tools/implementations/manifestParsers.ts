export function parseManifestContent(manifestPath: string, content: string): string[] {
  const lowerPath = manifestPath.toLowerCase();

  // 1. JavaScript / TypeScript (package.json)
  if (lowerPath.endsWith('package.json')) {
    try {
      const parsed = JSON.parse(content) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        peerDependencies?: Record<string, string>;
      };
      return Object.keys({
        ...parsed.dependencies,
        ...parsed.devDependencies,
        ...parsed.peerDependencies,
      }).slice(0, 30);
    } catch {
      return [];
    }
  }

  // 2. Python (requirements.txt, Pipfile, pyproject.toml)
  if (lowerPath.endsWith('requirements.txt') || lowerPath.endsWith('pipfile')) {
    return content
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#') && !l.startsWith('-'))
      .map((l) => {
        // Strip version specifiers like ==, >=, <=, ~=, !=
        const clean = l.split(/[=><~!;]/)[0]?.trim();
        // Strip extras like [crypto]
        return clean ? clean.split('[')[0]?.trim() || '' : '';
      })
      .filter((l) => l.length > 0)
      .slice(0, 30);
  }

  if (lowerPath.endsWith('pyproject.toml')) {
    const lines = content.split('\n');
    const deps: string[] = [];
    let inDepsSection = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('[') && line.endsWith(']')) {
        inDepsSection = line.includes('dependencies');
        continue;
      }
      if (inDepsSection && line && !line.startsWith('#')) {
        const pkgName = line.split('=')[0]?.trim().replace(/["']/g, '');
        if (pkgName && pkgName !== 'python') {
          deps.push(pkgName);
        }
      }
    }
    return deps.slice(0, 30);
  }

  // 3. Go (go.mod)
  if (lowerPath.endsWith('go.mod')) {
    const lines = content.split('\n');
    const deps: string[] = [];
    let inRequireBlock = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('require (')) {
        inRequireBlock = true;
        continue;
      }
      if (inRequireBlock && line === ')') {
        inRequireBlock = false;
        continue;
      }
      if (line.startsWith('require ') || inRequireBlock) {
        const parts = line.replace('require ', '').trim().split(/\s+/);
        if (parts[0] && !parts[0].startsWith('//')) {
          // Extract base module name (e.g. github.com/gin-gonic/gin -> gin)
          const mod = parts[0];
          const shortName = mod.split('/').pop() || mod;
          deps.push(shortName);
        }
      }
    }
    return deps.slice(0, 30);
  }

  // 4. Rust (Cargo.toml)
  if (lowerPath.endsWith('cargo.toml')) {
    const lines = content.split('\n');
    const deps: string[] = [];
    let inDepsSection = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('[dependencies]') || line.startsWith('[dev-dependencies]')) {
        inDepsSection = true;
        continue;
      }
      if (line.startsWith('[') && line.endsWith(']')) {
        inDepsSection = false;
        continue;
      }
      if (inDepsSection && line && !line.startsWith('#')) {
        const crate = line.split('=')[0]?.trim().replace(/["']/g, '');
        if (crate) deps.push(crate);
      }
    }
    return deps.slice(0, 30);
  }

  // Generic fallback: split non-empty lines
  return content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('//') && !l.startsWith('#'))
    .slice(0, 20);
}
