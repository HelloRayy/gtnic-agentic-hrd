import SectionMessage from '@atlaskit/section-message';

interface ClarificationPromptsTabProps {
  clarificationPrompts: string[];
}

export function ClarificationPromptsTab({ clarificationPrompts }: ClarificationPromptsTabProps) {
  if (clarificationPrompts.length === 0) {
    return (
      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: 13, color: '#6B778C' }}>Tidak ada ambiguitas yang memerlukan klarifikasi.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {clarificationPrompts.map((prompt, idx) => (
        <SectionMessage key={idx} appearance="warning" title={`Poin Klarifikasi #${idx + 1}`}>
          <p>{prompt}</p>
        </SectionMessage>
      ))}
    </div>
  );
}
