export const DEMO_STOCK_VIDEOS = {
  luxuryWatch: {
    url: 'https://videos.pexels.com/video-files/39108088/16639006_1920_1080_25fps.mp4',
    thumbnailUrl: 'https://images.pexels.com/videos/39108088/blue-hour-dial-high-speed-slow-motion-39108088.jpeg',
    creditUrl: 'https://www.pexels.com/video/elegant-blue-dial-watch-with-leather-strap-39108088/',
  },
  fashionRunway: {
    url: 'https://videos.pexels.com/video-files/9509328/9509328-uhd_2732_1440_25fps.mp4',
    thumbnailUrl: 'https://images.pexels.com/videos/9509328/pexels-photo-9509328.jpeg',
    creditUrl: 'https://www.pexels.com/video/a-model-wearing-a-white-dress-9509328/',
  },
  carDrifting: {
    url: 'https://videos.pexels.com/video-files/35662147/15112698_1920_1080_120fps.mp4',
    thumbnailUrl: 'https://images.pexels.com/videos/35662147/pexels-photo-35662147.jpeg',
    creditUrl: 'https://www.pexels.com/video/thrilling-car-drifting-race-at-outdoor-venue-35662147/',
  },
  carDriftingAlt: {
    url: 'https://videos.pexels.com/video-files/26050311/11925790_1440_2560_60fps.mp4',
    thumbnailUrl: 'https://images.pexels.com/videos/26050311/pexels-photo-26050311.jpeg',
    creditUrl: 'https://www.pexels.com/video/a-man-is-standing-in-the-middle-of-a-track-with-a-car-26050311/',
  },
  beverage: {
    url: 'https://videos.pexels.com/video-files/30112299/12915073_1920_1080_60fps.mp4',
    thumbnailUrl: 'https://images.pexels.com/videos/30112299/soda-30112299.jpeg',
    creditUrl: 'https://www.pexels.com/video/female-athlete-drinks-energy-drink-on-field-30112299/',
  },
  productBottles: {
    url: 'https://videos.pexels.com/video-files/7102208/7102208-uhd_2560_1440_30fps.mp4',
    thumbnailUrl: 'https://images.pexels.com/videos/7102208/bottle-bright-drink-drinking-7102208.jpeg',
    creditUrl: 'https://www.pexels.com/video/clear-plastic-bottles-with-water-7102208/',
  },
} as const;

export const DEMO_VIDEO_URL = DEMO_STOCK_VIDEOS.productBottles.url;
export const DEMO_VIDEO_THUMBNAIL_URL = DEMO_STOCK_VIDEOS.productBottles.thumbnailUrl;

const legacyDemoVideoHost = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';
const legacyVideoReplacements: Record<string, string> = {
  'ForBiggerBlazes.mp4': DEMO_STOCK_VIDEOS.carDriftingAlt.url,
  'ForBiggerEscapes.mp4': DEMO_STOCK_VIDEOS.fashionRunway.url,
  'ForBiggerFun.mp4': DEMO_STOCK_VIDEOS.carDrifting.url,
  'ForBiggerJoyBlazes.mp4': DEMO_STOCK_VIDEOS.beverage.url,
};

export function getPlayableVideoUrl(url: string): string {
  if (!url.startsWith(legacyDemoVideoHost)) return url;
  const filename = url.slice(legacyDemoVideoHost.length);
  return legacyVideoReplacements[filename] || DEMO_VIDEO_URL;
}

export function getDemoVideoThumbnail(url: string, fallback: string): string {
  const playableUrl = getPlayableVideoUrl(url);
  return Object.values(DEMO_STOCK_VIDEOS).find(video => video.url === playableUrl)?.thumbnailUrl || fallback;
}

export function getDemoVideoCredit(url: string): string | undefined {
  return Object.values(DEMO_STOCK_VIDEOS).find(video => video.url === url)?.creditUrl;
}
