import React from 'react';

interface FormattedChatMessageProps {
  content: string;
  isUser?: boolean;
}

/**
 * Parses inline formatting like **bold** and `code` without crashing on partial streaming tokens.
 */
function renderInlineFormatting(text: string): React.ReactNode[] {
  // Matches either **bold** or `code`
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold text-[#1e2028]">
          {boldText}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const codeText = part.slice(1, -1);
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded-[5px] bg-[#ecebe5] text-[#2c303d] text-[12px] font-mono border border-[#dedcd5]"
        >
          {codeText}
        </code>
      );
    }
    // Clean up lone rogue asterisks if any remain
    const sanitized = part.replace(/^\s*\*\s+/g, '• ');
    return <span key={index}>{sanitized}</span>;
  });
}

export const FormattedChatMessage: React.FC<FormattedChatMessageProps> = ({
  content,
  isUser = false,
}) => {
  if (isUser) {
    return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
  }

  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 text-[13px] leading-relaxed text-[#2f323e]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line -> vertical space
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Headings (#, ##, ###) -> convert to prominent bold title without raw #
        const headingMatch = trimmed.match(/^#{1,6}\s*(.*)/);
        if (headingMatch) {
          return (
            <div
              key={idx}
              className="font-semibold text-[13.5px] text-[#1e2028] pt-1.5 pb-0.5 tracking-tight border-b border-[#f0eee9]"
            >
              {renderInlineFormatting(headingMatch[1])}
            </div>
          );
        }

        // Bullet point (- or *)
        const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5 text-[12.8px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7285d5] mt-1.5 shrink-0" />
              <div className="flex-1">{renderInlineFormatting(bulletMatch[1])}</div>
            </div>
          );
        }

        // Numbered list (1., 2., etc.)
        const numberedMatch = trimmed.match(/^(\d+\.)\s+(.*)/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5 text-[12.8px]">
              <span className="font-semibold text-[#5269bb] shrink-0 text-xs">
                {numberedMatch[1]}
              </span>
              <div className="flex-1">{renderInlineFormatting(numberedMatch[2])}</div>
            </div>
          );
        }

        // Standard paragraph line
        return <div key={idx}>{renderInlineFormatting(line)}</div>;
      })}
    </div>
  );
};
