import { site } from '@/content/site.config';
import { siteUrl } from '@/lib/site-url';

/**
 * Микроразметка организации для поисковиков.
 *
 * Отдаётся ТОЛЬКО в боевой версии. В демо все данные — placeholders, и
 * публиковать структурированные данные несуществующей компании с чужим
 * телефоном и ИНН нельзя: поисковик воспринимает их как факты о реальном
 * бизнесе. По той же причине демо закрыто от индексации.
 */
export function localBusinessSchema(): object | null {
  if (site.isDemo) return null;

  const { company, products } = site;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: company.name,
    legalName: company.legalName,
    url: siteUrl,
    telephone: company.phone,
    address: { '@type': 'PostalAddress', streetAddress: company.address },
    areaServed: company.geo,
    openingHours: company.workHours,
    image: `${siteUrl}/media/demo/og.jpg`,
    makesOffer: products.map((product) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: product.title },
      ...(product.priceFrom !== null
        ? {
            priceSpecification: {
              '@type': 'PriceSpecification',
              minPrice: product.priceFrom,
              priceCurrency: 'RUB',
            },
          }
        : {}),
    })),
  };
}
