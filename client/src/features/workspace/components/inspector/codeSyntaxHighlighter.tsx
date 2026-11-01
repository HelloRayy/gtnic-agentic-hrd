import React from 'react';

interface TokenRule {
  type: 'comment' | 'string' | 'keyword' | 'type' | 'number' | 'function' | 'json-key' | 'text';
  pattern: RegExp;
  className: string;
}

const RULES: TokenRule[] = [
  {
    type: 'comment',
    pattern: /(\/\/.*$|#.*$)/,
    className: 'text-[#8b949e] italic',
  },
  {
    type: 'string',
    pattern: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/,
    className: 'text-[#a5d6ff]',
  },
  {
    type: 'keyword',
    pattern: /\b(import|export|from|class|interface|type|const|let|var|return|function|public|private|protected|new|async|await|default|module|package|require|if|else|runs-on|steps|uses|name|on|branches)\b/,
    className: 'text-[#ff7b72] font-semibold',
  },
  {
    type: 'type',
    pattern: /\b(string|number|boolean|any|void|object|Map|Set|Buffer|Array|Promise|Error|Record|TechnicalDossier|DispatchSession|Date)\b/,
    className: 'text-[#ffa657]',
  },
  {
    type: 'function',
    pattern: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\()/,
    className: 'text-[#d2a8ff]',
  },
  {
    type: 'number',
    pattern: /\b(\d+(\.\d+)?)\b/,
    className: 'text-[#79c0ff]',
  },
];

export function highlightCodeLine(line: string, language: string): React.ReactNode {
  if (!line || !line.trim()) {
    return ' ';
  }

  // JSON key highlighting
  if (language === 'json') {
    const jsonKeyMatch = line.match(/^(\s*"[^"]+"\s*:)(.*)$/);
    if (jsonKeyMatch) {
      return (
        <>
          <span className="text-[#7ee787] font-semibold">{jsonKeyMatch[1]}</span>
          {highlightCodeLine(jsonKeyMatch[2], 'text')}
        </>
      );
    }
  }

  // Tokenize using master regex
  const combinedRegex = new RegExp(
    RULES.map((r) => `(${r.pattern.source})`).join('|'),
    'g'
  );

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combinedRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      elements.push(line.slice(lastIndex, match.index));
    }

    const matchedText = match[0];
    let matchedClass = 'text-[#e6edf3]';

    for (const rule of RULES) {
      if (rule.pattern.test(matchedText)) {
        matchedClass = rule.className;
        break;
      }
    }

    elements.push(
      <span key={match.index} className={matchedClass}>
        {matchedText}
      </span>
    );

    lastIndex = match.index + matchedText.length;
  }

  if (lastIndex < line.length) {
    elements.push(line.slice(lastIndex));
  }

  return elements.length > 0 ? elements : line;
}
