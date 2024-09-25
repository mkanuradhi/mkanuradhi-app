import { Link } from "@/i18n/routing";
import "./SameTabLink.scss";

interface NewTabLinkProps {
  href: string;
  children: React.ReactNode;
}

const SameTabLink: React.FC<NewTabLinkProps> = ({ href, children }) => {
  return (
    <>
      <Link href={href} className="same-tab-link">
        {children}
      </Link>
    </>
  )
}

export default SameTabLink;