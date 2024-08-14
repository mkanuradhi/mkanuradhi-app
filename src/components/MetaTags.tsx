import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const MAX_DESCRIPTION_CHARS = 150;

const getIdealDescription = (desc: string) => {
  if (desc.length > MAX_DESCRIPTION_CHARS) {
    const trimmed = desc.substring(0, MAX_DESCRIPTION_CHARS);

    const lastSentenceEnd = Math.max(
      trimmed.lastIndexOf('.'),
      trimmed.lastIndexOf('!'),
      trimmed.lastIndexOf('?')
    );

    if (lastSentenceEnd > 0) {
      return trimmed.substring(0, lastSentenceEnd + 1); // Include the punctuation
    }

    // If no sentence-ending punctuation is found within the range, fallback to word-based truncation
    const lastSpaceIndex = trimmed.lastIndexOf(' ');
    return trimmed.substring(0, lastSpaceIndex);
  }
  return desc;
}

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
  const idelDesc = getIdealDescription(description);

  return (
    <Helmet>
      <title>{completeTitle}</title>
      <meta name="author" content="Anuradha" />
      <meta name="description" content={idelDesc} />
      <meta property="og:title" content={completeTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:description" content={idelDesc} />
      <meta property="og:site_name" content="mkanuradhi" />
      <meta property="og:locale" content="en_US" />
    </Helmet>
  );
};

export default MetaTags;