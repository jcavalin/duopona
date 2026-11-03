// Icon PNGs from public/icon.svg: `npx @vite-pwa/assets-generator@2` (run once, commit the PNGs).
// The source is full-bleed, so no padding (no white ring on Android); research R6.
const resizeOptions = { fit: 'contain', background: '#2da44e' }
export default {
  headLinkOptions: { preset: '2023' },
  preset: {
    transparent: { sizes: [192, 512], padding: 0, resizeOptions, favicons: [] },
    maskable: { sizes: [512], padding: 0, resizeOptions },
    apple: { sizes: [180], padding: 0, resizeOptions },
  },
  images: ['public/icon.svg'],
}
