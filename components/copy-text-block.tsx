import CopyButton from "./copy-button";

interface CopyTextBlockProps {
  text: string;
}

const CopyTextBlock: React.FC<CopyTextBlockProps> = ({ text }) => {
  return (
    <div className="copy-text-block position-relative border rounded bg-body-secondary p-3">
      <CopyButton text={text} className="position-absolute top-0 end-0 m-2" />
      <div className="text-wrap pe-5" style={{ whiteSpace: "pre-line" }}>{text}</div>
    </div>
  );
}

export default CopyTextBlock;