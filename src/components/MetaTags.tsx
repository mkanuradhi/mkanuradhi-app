import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface MetaTagsProps {
  title: string;
  subTitle?: string;
  description: string;
  image: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({ title, subTitle, description, image }) => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;
  const absoluteImageUrl = `${window.location.origin}${image}`;

  const completeTitle = subTitle ? title + " - " + subTitle : title;

  return (
    <Helmet>
      <title>{completeTitle}</title>
      <meta name="author" content="Anuradha" />
      <meta name="description" content={description} />
      <meta property="og:title" content={completeTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="mkanuradhi" />
      <meta property="og:locale" content="en_US" />
    </Helmet>
  );
};

export default MetaTags;