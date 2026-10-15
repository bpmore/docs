import Alpine from 'alpinejs';
import docsearch from '@docsearch/js';
import '@docsearch/css';

import './anchors.js';
import './cookies.js';
import './external-links.js';
import './language-badges.js';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
dayjs.extend(relativeTime)

window.dayjs = dayjs;


docsearch({
  container: '#docsearch',
  appId: '90UJMUR5MX',
  indexName: 'statamic_3',
  apiKey: '2cea01a83bd805b6c642d3bda0b91437',
  transformItems(items) {
    return items.map((item) => {
        // Transform the absolute URL into a relative URL so it works locally.
        const a = document.createElement('a');
        a.href = item.url;

        // If the result is the h1, remove the hash
        const hash = a.hash === '#content' ? '' : a.hash;

        return {...item, url: `${a.pathname}${hash}`}
    });
  },
});

window.bodyData = function() {
    let primaryKeyBind = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? 'meta' : 'ctrl';
    return {
        showNav: false,
        showSearch: false,
        showEasterEgg: false,
        nearTop: true,
    };
}

window.htmlData = function() {
    return {
        themePickerOpen: false,
        themePreference: localStorage.getItem('theme') || 'system',
        systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        setSystemTheme(theme) {
            this.systemTheme = theme
        },
        setThemePreference(theme) {
            this.themePreference = theme
            localStorage.setItem('theme', theme)
        },
        get darkMode() {
            return this.themePreference === 'dark' || (this.themePreference === 'system' && this.systemTheme === 'dark')
        },
    }
}

Alpine.start();
window.Alpine = Alpine;
