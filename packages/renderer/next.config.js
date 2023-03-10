const dontenv = require('dotenv');
const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';

dontenv.config({
  path: path.resolve(__dirname, `../../env/.env.${process.env.NODE_ENV}`),
});

/**
 * Next Config Options
 * @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: isProduction
      ? {
          exclude: ['error', 'debug'],
        }
      : false,
  },
  trailingSlash: true,
  // * 이용자에게 제공되는 헤더에 nextjs 로 개발되었음을 노출하지 않습니다.
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  // https://nextjs.org/docs/basic-features/built-in-css-support#sass-support
  // sassOptions: {
  //   // scss module 설정
  //   includePaths: [path.resolve(__dirname, 'node_modules')],
  // },
  // * Next.js는 렌더링 된 콘텐츠와 정적 파일을 압축하기 위해 gzip 압축을 제공합니다.
  // https://nextjs.org/docs/api-reference/next.config.js/compression
  compress: true,
  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
