export default function manifest() {
  return {
    name: 'SWISH IT — The Standard for Effortless Clean',
    short_name: 'SWISH IT',
    description:
      'High-performance, plant-powered dishwashing dew engineered for effortless clean.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF7EC',
    theme_color: '#173E4A',
    icons: [
      {
        src: '/img/logo - swishit-01.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/img/logo - swishit-01.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
