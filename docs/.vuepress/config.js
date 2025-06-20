import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  base: '/insee-sirene-docs/',
  lang: 'fr',

  title: 'Documentation INSEE Sirene',
  description: 'Documentation de la librairie php INSEE Sirene.',

  theme: defaultTheme({
    logo: '/images/insee-sirene-logo.png',

    navbar: [
      {
        text: "GitHub",
        link: "https://github.com/lufiipe/insee-sierene",
      },
    ],

    sidebar: [
      {
        text: 'Introduction',
        link: 'README.md',
      },
      'detail-siren-siret.md',
      {
        text: 'Recherche Siren/Siret',
        link: 'advanced-search-siren-siret.md'
      },
      'succession-links.md',
      'service_info.md',
      'facettes.md',
      'responses.md',
      'rate-limiting.md',
      'events.md'
    ],
  }),

  bundler: viteBundler(),
})

