import { Helmet } from 'react-helmet-async'
import { DEFAULT_OG_IMAGE, SEO_KEYWORDS, resolveSeoUrl } from '../utils/seo'

function Seo({
  title,
  description,
  path = '/',
  keywords = SEO_KEYWORDS,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  jsonLd,
}) {
  const canonicalUrl = resolveSeoUrl(path)
  const imageUrl = resolveSeoUrl(image)
  const keywordContent = Array.isArray(keywords) ? keywords.join(', ') : keywords

  return (
    <Helmet>
      <html lang="ru" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordContent} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="ru_RU" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )
}

export default Seo
