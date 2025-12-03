// @ts-check
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,svelte,js,ts}',
  ],
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        pageBg: 'var(--page-bg)',
        bgSection: 'var(--bg-section)',
        tableHeader: 'var(--table-header)',
        primaryDark: 'var(--primary-dark)',
        primaryDarker: 'var(--primary-darker)',
        primaryBase: 'var(--primary-base)',
        primaryAlpha16: 'var(--primary-alpha-16)',
        primaryAlpha10: 'var(--primary-alpha-10)',

        secondaryDark: 'var(--secondary-dark)',
        secondaryDarker: 'var(--secondary-darker)',
        secondaryBase: 'var(--secondary-base)',
        secondaryAlpha24: 'var(--secondary-alpha-24)',
        secondaryAlpha16: 'var(--secondary-alpha-16)',
        secondaryAlpha10: 'var(--secondary-alpha-10)',

        staticBlack: 'var(--static-black)',
        staticWhite: 'var(--static-white)',

        bgStrong950: 'var(--bg-strong-950)',
        bgSurface800: 'var(--bg-surface-800)',
        bgSub300: 'var(--bg-sub-300)',
        bgSoft200: 'var(--bg-soft-200)',
        bgWeak50: 'var(--bg-weak-50)',
        bgWhite0: 'var(--bg-white-0)',

        textStrong950: 'var(--text-strong-950)',
        textSub600: 'var(--text-sub-600)',
        textSoft400: 'var(--text-soft-400)',
        textDisabled300: 'var(--text-disabled-300)',
        textWhite0: 'var(--text-white-0)',

        strokeStrong950: 'var(--stroke-strong-950)',
        strokeSub300: 'var(--stroke-sub-300)',
        strokeSoft200: 'var(--stroke-soft-200)',
        strokeWhite0: 'var(--stroke-white-0)',

        iconStrong950: 'var(--icon-strong-950)',
        iconSub600: 'var(--icon-sub-600)',
        iconSoft400: 'var(--icon-soft-400)',
        iconDisabled300: 'var(--icon-disabled-300)',
        iconWhite0: 'var(--icon-white-0)',

        fadedDark: 'var(--faded-dark)',
        fadedBase: 'var(--faded-base)',
        fadedLight: 'var(--faded-light)',
        fadedLighter: 'var(--faded-lighter)',

        informationDark: 'var(--information-dark)',
        informationBase: 'var(--information-base)',
        informationLight: 'var(--information-light)',
        informationLighter: 'var(--information-lighter)',

        warningDark: 'var(--warning-dark)',
        warningBase: 'var(--warning-base)',
        warningLight: 'var(--warning-light)',
        warningLighter: 'var(--warning-lighter)',

        errorDark: 'var(--error-dark)',
        errorBase: 'var(--error-base)',
        errorLight: 'var(--error-light)',
        errorLighter: 'var(--error-lighter)',

        successDark: 'var(--success-dark)',
        successBase: 'var(--success-base)',
        successLight: 'var(--success-light)',
        successLighter: 'var(--success-lighter)',

        awayDark: 'var(--away-dark)',
        awayBase: 'var(--away-base)',
        awayLight: 'var(--away-light)',
        awayLighter: 'var(--away-lighter)',

        featureDark: 'var(--feature-dark)',
        featureBase: 'var(--feature-base)',
        featureLight: 'var(--feature-light)',
        featureLighter: 'var(--feature-lighter)',

        verifiedDark: 'var(--verified-dark)',
        verifiedBase: 'var(--verified-base)',
        verifiedLight: 'var(--verified-light)',
        verifiedLighter: 'var(--verified-lighter)',

        highlightedDark: 'var(--highlighted-dark)',
        highlightedBase: 'var(--highlighted-base)',
        highlightedLight: 'var(--highlighted-light)',
        highlightedLighter: 'var(--highlighted-lighter)',

        stableDark: 'var(--stable-dark)',
        stableBase: 'var(--stable-base)',
        stableLight: 'var(--stable-light)',
        stableLighter: 'var(--stable-lighter)',
      },
      boxShadow: {
        'custom': 'rgba(10, 13, 20, 0.03)',
        'xs': '0px 1px 2px 0px rgba(10, 13, 20, 0.03)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        '14px': '14px',
      },
      fontWeight: {
        '500': '500',
      },
      lineHeight: {
        '20px': '20px',
      },
      letterSpacing: {
        'tight': '-0.084px',
      },
      borderRadius: {
        'lg': 'var(--radius-12, 12px)',
      },
      backgroundColor: {
        'custom-bg-gray': 'var(--bg-soft-200, #222530)',
      },
      height: {
        '26': '11rem', // Default for h-26
        '30': '11rem', // Default for sm:h-30
        '36': '11rem',   // Default for md:h-36
        '32': '11rem',   // Custom height
        '40': '11rem',  // Default for lg:h-40
        '48': '11rem',  // Custom height
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.font-feature-custom': {
          'font-feature-settings': "'ss11' on, 'cv09' on, 'liga' off, 'calt' off",
        },
        '.text-strong': {
          color: 'var(--text-strong-950, #FFF)',
        },
      }
      addUtilities(newUtilities)
    },

  ],
}
