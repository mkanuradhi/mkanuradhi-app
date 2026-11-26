import CopyButton from "./copy-button";

interface CopyCodeBlockProps {
  code: string;
}

const CopyCodeBlock: React.FC<CopyCodeBlockProps> = ({ code }) => {
  return (
    <div className="copy-code-block position-relative">
      <CopyButton text={code} className="position-absolute top-0 end-0 m-2" />

      <pre
        className="p-3 pe-5 rounded bg-body-secondary text-body fw-normal lh-sm" 
        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default CopyCodeBlock;