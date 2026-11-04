// Not used for the current icons: since feature 012 the icons are hand-made in
// docs/design/app-icon/ (a different mascot scale per purpose) and copied into public/.
// Don't regenerate them with `npx @vite-pwa/assets-generator@2`; copy the design files instead.
const resizeOptions = { fit: 'contain', background: '#16151f' }
export default {
  headLinkOptions: { preset: '2023' },
  preset: {
    transparent: { sizes: [192, 512], padding: 0, resizeOptions, favicons: [] },
    maskable: { sizes: [512], padding: 0, resizeOptions },
    apple: { sizes: [180], padding: 0, resizeOptions },
  },
  images: ['public/icon.svg'],
}
