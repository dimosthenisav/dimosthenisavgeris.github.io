import type { Locale } from './i18n';

export const siteConfig = {
  name: 'Dimosthenis Avgeris',
  shortName: 'Dimos Avgeris',
  description: 'On the quest to master my craft — a pragmatic product management journey.',
  author: {
    name: 'Dimosthenis Avgeris',
    title: {
      en: 'Head of Product at instacar'
    },
    description: {
      en: 'On the Quest to Master My Craft: “A Pragmatic Product Management Journey”'
    },
    avatar: '/favicon.svg',
    social: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/dimosthenis-avgeris/', icon: 'simple-icons:linkedin' },
      { name: 'GitHub', url: 'https://github.com/dimosthenisav', icon: 'simple-icons:github' }
    ]
  },
  contentWidth: '56rem',
  ui: {
    navbar: {
      sticky: true
    },
    dock: {
      enabled: true
    }
  },
  // Items are either a registered route id ('posts' | 'projects' | 'archives')
  // or an inline link. Inline links accept internal paths and external URLs:
  // { label: 'Astro', href: 'https://astro.build/', icon: 'lucide:rocket' }
  // { label: { en: 'About', 'zh-cn': '关于' }, href: '/about/' }
  nav: [
    'posts',
    'archives',
    { label: 'Reads', href: '/reads/' },
    { label: 'About', href: '/about/' }
  ],
  footerNav: ['archives', { label: 'About', href: '/about/' }],
  home: {
    recentPosts: {
      enabled: true,
      limit: 5
    }
  },
  list: {
    pageSize: 10
  },
  comments: {
    enabled: false,
    provider: 'giscus',
    giscus: {
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme'
    }
  },
  analytics: {
    enabled: false,
    provider: 'umami',
    umami: {
      src: '',
      websiteId: '',
      domains: ''
    }
  },
  gallery: {
    enabled: true,
    defaultLayout: 'justified',
    gap: 10,
    targetRowHeight: 220,
    lastRowBehavior: 'center',
    columnWidth: 220,
    columns: 'auto'
  },
  lightbox: {
    enabled: true
  },
  post: {
    relatedCount: 3,
    license: {
      enabled: true,
      name: 'CC BY-NC-SA 4.0',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      description:
        'This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.'
    }
  }
} satisfies {
  name: string;
  shortName: string;
  description: string;
  author: {
    name: string;
    title: Record<Locale, string>;
    description: Record<Locale, string>;
    avatar: string;
    social: Array<{ name: string; url: string; icon: string }>;
  };
  contentWidth: `${number}rem`;
  ui: {
    navbar: {
      sticky: boolean;
    };
    dock: {
      enabled: boolean;
    };
  };
  nav: Array<string | { label: string | Record<Locale, string>; href: string; icon?: string }>;
  footerNav: Array<
    string | { label: string | Record<Locale, string>; href: string; icon?: string }
  >;
  home: {
    recentPosts: { enabled: boolean; limit: number };
  };
  list: {
    pageSize: number;
  };
  comments: Record<string, any>;
  analytics: Record<string, any>;
  gallery: Record<string, any>;
  lightbox: Record<string, any>;
  post: Record<string, any>;
};
