import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SITE_URL = 'https://www.hotelmarinabeach.com'
const SITE_NAME = 'Hotel Marina Beach Toamasina'
const OG_IMAGE = `${SITE_URL}/images/Photo-Gallerie-1-1200.jpg`

const pages = {
  '/': {
    fr: {
      title: 'Hôtel Marina Beach Toamasina | Séjour à Madagascar',
      description: 'Découvrez l’hôtel Marina Beach à Toamasina, Madagascar : chambres et suites, restaurant, piscine, spa et espaces événementiels. Préparez votre séjour.',
    },
    en: {
      title: 'Marina Beach Hotel Toamasina | Stay in Madagascar',
      description: 'Discover Marina Beach Hotel in Toamasina, Madagascar, with rooms and suites, a restaurant, swimming pool, spa and event spaces. Plan your stay.',
    },
  },
  '/chambres-suites': {
    fr: {
      title: 'Chambres & Suites à Toamasina | Marina Beach',
      description: 'Découvrez les chambres et suites de l’hôtel Marina Beach à Toamasina, Madagascar, et choisissez l’hébergement adapté à votre séjour.',
    },
    en: {
      title: 'Rooms & Suites in Toamasina | Marina Beach',
      description: 'Explore the rooms and suites at Marina Beach Hotel in Toamasina, Madagascar, and find the right accommodation for your stay.',
    },
  },
  '/restaurant': {
    fr: {
      title: 'Restaurant à Toamasina | Marina Beach',
      description: 'Découvrez le restaurant Marina Beach à Toamasina : recettes locales, inspirations internationales et moments conviviaux à Madagascar.',
    },
    en: {
      title: 'Restaurant in Toamasina | Marina Beach',
      description: 'Discover the Marina Beach restaurant in Toamasina, serving local recipes and international inspirations in a welcoming setting.',
    },
  },
  '/piscine-bien-etre': {
    fr: {
      title: 'Piscine & Bien-être à Toamasina | Marina Beach',
      description: 'Profitez de la piscine, du spa et des soins bien-être de Marina Beach à Toamasina, Madagascar.',
    },
    en: {
      title: 'Pool & Wellness in Toamasina | Marina Beach',
      description: 'Enjoy the swimming pool, spa and wellness treatments at Marina Beach in Toamasina, Madagascar.',
    },
  },
  '/reunions-evenements': {
    fr: {
      title: 'Réunions & Événements à Toamasina | Marina Beach',
      description: 'Organisez une réunion ou un événement à Marina Beach, à Toamasina. Découvrez les espaces et équipements proposés.',
    },
    en: {
      title: 'Meetings & Events in Toamasina | Marina Beach',
      description: 'Plan a meeting or event at Marina Beach in Toamasina. Explore the available spaces and equipment.',
    },
  },
  '/decouvrir-toamasina': {
    fr: {
      title: 'Découvrir Toamasina, Madagascar | Marina Beach',
      description: 'Découvrez Toamasina et ses environs depuis Marina Beach, votre point de départ pour un séjour à Madagascar.',
    },
    en: {
      title: 'Discover Toamasina, Madagascar | Marina Beach',
      description: 'Discover Toamasina and its surroundings from Marina Beach, and plan your stay in Madagascar.',
    },
  },
  '/contact': {
    fr: {
      title: 'Contact & Réservation | Hôtel Marina Beach Toamasina',
      description: 'Contactez l’hôtel Marina Beach à Toamasina pour préparer votre séjour, réserver une chambre ou poser vos questions.',
    },
    en: {
      title: 'Contact & Reservations | Marina Beach Hotel Toamasina',
      description: 'Contact Marina Beach Hotel in Toamasina to plan your stay, book a room or ask a question.',
    },
  },
} as const

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

function setCanonical(url: string | null) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!url) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }
  element.href = url
}

export default function Seo() {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    const isAdmin = pathname.startsWith('/admin')
    const normalizedPathname = pathname === '/' ? '/' : pathname.replace(/\/+$/, '') || '/'
    const page = pages[normalizedPathname as keyof typeof pages]
    const english = i18n.resolvedLanguage?.startsWith('en') || i18n.language.startsWith('en')
    const locale = english ? 'en' : 'fr'
    const metadata = page?.[locale]
    const title = isAdmin
      ? 'Administration | Marina Beach'
      : metadata?.title ?? 'Page introuvable | Marina Beach'
    const description = metadata?.description ?? ''
    const canonical = !isAdmin && metadata ? new URL(normalizedPathname, `${SITE_URL}/`).href : null
    const language = english ? 'en' : 'fr'

    document.title = title
    document.documentElement.lang = language
    setMeta('name', 'description', description)
    setMeta('name', 'robots', metadata && !isAdmin ? 'index, follow' : 'noindex, nofollow')
    setCanonical(canonical)

    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonical ?? SITE_URL)
    setMeta('property', 'og:image', OG_IMAGE)
    setMeta('property', 'og:image:alt', 'Façade du Marina Beach Toamasina')
    setMeta('property', 'og:locale', english ? 'en_GB' : 'fr_FR')
    setMeta('property', 'og:locale:alternate', english ? 'fr_FR' : 'en_GB')

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', OG_IMAGE)

    const structuredData = document.getElementById('structured-data')
    if (structuredData) {
      structuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: SITE_NAME,
            inLanguage: language,
            publisher: { '@id': `${SITE_URL}/#hotel` },
          },
          {
            '@type': 'Hotel',
            '@id': `${SITE_URL}/#hotel`,
            name: SITE_NAME,
            url: `${SITE_URL}/`,
            image: OG_IMAGE,
            description: metadata?.description ?? pages['/'].fr.description,
            telephone: '+261344904040',
            email: 'marinabeach.resa@moov.mg',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'RN7, Lot 512 C 61 Tsarasaotra, Route d’Ambositra',
              addressLocality: 'Toamasina',
              postalCode: '110',
              addressCountry: 'MG',
            },
            amenityFeature: ['Restaurant', 'Spa', 'Piscine', 'Wi-Fi gratuit', 'Salles de réunion'].map((name) => ({
              '@type': 'LocationFeatureSpecification',
              name,
              value: true,
            })),
          },
        ],
      })
    }
  }, [i18n.language, i18n.resolvedLanguage, pathname])

  return null
}
