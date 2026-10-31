import React from 'react';
import { ForensicCalloutPin } from './ForensicCalloutPin.js';
import type { ForensicCallout } from '../../types.js';

interface IdeCodeViewerProps {
  code: string;
  language: string;
  callouts: ForensicCallout[];
  highlightedLine?: number;
}

export const IdeCodeViewer: React.FC<IdeCodeViewerProps> = ({
  code,
  callouts,
  highlightedLine,
}) => {
  const lines = code.split('\n');

  // Find callouts ending at a specific line number to render pin right after
  const calloutsByEndLine = new Map<number, ForensicCallout>();
  callouts.forEach((c) => {
    calloutsByEndLine.set(c.endLine, c);
  });

  const isLineHighlighted = (lineNum: number) => {
    if (highlightedLine === lineNum) return true;
    return callouts.some((c) => lineNum >= c.startLine && lineNum <= c.endLine);
  };

  const getLineCallout = (lineNum: number) => {
    return callouts.find((c) => lineNum >= c.startLine && lineNum <= c.endLine);
  };

  return (
    <div className="bg-[#1c1d22] text-[#e1e4ee] font-mono text-xs overflow-x-auto overflow-y-auto max-h-[520px] select-text border-t border-[#2e313d] rounded-b-xl">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((lineText, idx) => {
            const lineNum = idx + 1;
            const highlighted = isLineHighlighted(lineNum);
            const calloutOnLine = getLineCallout(lineNum);
            const endCallout = calloutsByEndLine.get(lineNum);

            let rowBg = 'hover:bg-[#252730]/60';
            if (highlighted) {
              if (calloutOnLine?.type === 'VERIFIED') {
                rowBg = 'bg-[#7285d5]/15 border-l-2 border-[#7285d5]';
              } else if (calloutOnLine?.type === 'PARTIAL') {
                rowBg = 'bg-[#d9a441]/15 border-l-2 border-[#d9a441]';
              } else {
                rowBg = 'bg-[#d9756c]/15 border-l-2 border-[#d9756c]';
              }
            }

            return (
              <React.Fragment key={lineNum}>
                <tr className={`transition-colors ${rowBg}`}>
                  {/* Line Number Gutter */}
                  <td className="w-10 px-2.5 py-0.5 text-right text-[#575a6c] select-none text-[11px] font-mono border-r border-[#2d303d] shrink-0 align-top">
                    {lineNum}
                  </td>
                  {/* Code Line Content */}
                  <td className="px-3 py-0.5 whitespace-pre leading-relaxed font-mono text-[12px] text-[#d6d9e8] align-top">
                    {lineText || ' '}
                  </td>
                </tr>

                {/* Inline Forensic Callout Pin Box */}
                {endCallout && (
                  <tr>
                    <td colSpan={2} className="p-0 bg-[#21232b]">
                      <ForensicCalloutPin callout={endCallout} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
