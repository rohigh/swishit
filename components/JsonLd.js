import React from 'react';

export default function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SWISH IT',
    url: 'https://swishit.app',
    logo: 'https://swishit.app/img/logo%20-%20swishit-01.png',
    description: 'The Standard for Effortless Clean. High-performance, plant-powered hygiene products.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@swishit.app',
      contactType: 'customer support',
    },
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'SWISH IT High-Performance Hand Dishwash Dew',
    image: [
      'https://swishit.app/img/blue-nobg.jpeg',
      'https://swishit.app/img/green-nobg.jpeg',
      'https://swishit.app/img/yellow-nobg.jpeg',
    ],
    description:
      'Plant-powered, dermatologically tested hand dishwash liquid with Perfume-Lock™ technology.',
    sku: 'SWISH-DEW-500ML',
    brand: {
      '@type': 'Brand',
      name: 'SWISH IT',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://swishit.app/shop',
      priceCurrency: 'INR',
      price: '135',
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'SWISH IT',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2500',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}
