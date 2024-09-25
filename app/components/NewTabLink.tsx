import { Link } from "@/i18n/routing";
import "./NewTabLink.scss";

interface NewTabLinkProps {
  href: string;
  children: React.ReactNode;
}

const NewTabLink: React.FC<NewTabLinkProps> = ({ href, children }) => {
  return (
    <>
      <Link href={href} target="_blank" rel="noopener noreferrer" className="new-tab-link">
        <span className="link-text">{children}</span>
        <span className="arrow-icon">&#8599;</span>
      </Link>
    </>
  )
}

export default NewTabLink;