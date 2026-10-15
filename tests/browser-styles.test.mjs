import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';

const enabled = process.env.RUN_BROWSER_TESTS === '1';
const baseUrl = process.env.APP_URL ?? 'http://127.0.0.1:4313';

test('custom documentation styles survive on desktop and mobile in both themes', { skip: !enabled }, async () => {
    const browser = await puppeteer.launch({
        executablePath: process.env.BROWSERSHOT_CHROME_PATH,
    });
    try {
        for (const width of [390, 1280]) {
            for (const theme of ['light', 'dark']) {
                const page = await browser.newPage();
                try {
                    await page.setViewport({ width, height: 844 });
                    // Keep the regression check independent of fonts, ads and live search services.
                    await page.setRequestInterception(true);
                    page.on('request', request => {
                        if (new URL(request.url()).origin === new URL(baseUrl).origin) {
                            request.continue();
                        } else {
                            request.abort();
                        }
                    });
                    await page.evaluateOnNewDocument(value => localStorage.setItem('theme', value), theme);
                    await page.goto(`${baseUrl}/antlers`, { waitUntil: 'networkidle0' });
                    const styles = await page.evaluate(() => {
                        const style = selector => getComputedStyle(document.querySelector(selector));
                        const tip = style('article .hint.tip');
                        return {
                            overflow: document.documentElement.scrollWidth > innerWidth,
                            heading: style('h1').fontSize,
                            h2: style('article h2').fontSize,
                            nestedTocLine: style('.toc li ol li').lineHeight,
                            codeLine: style('article p code').lineHeight,
                            parentLine: getComputedStyle(document.querySelector('article p code').parentElement).lineHeight,
                            tipBackground: tip.backgroundColor,
                            tipBorder: tip.borderTopColor,
                            tipShadow: tip.boxShadow,
                            tocShadow: style('#table-of-contents').boxShadow,
                            dark: document.documentElement.classList.contains('dark'),
                            headingColor: style('h1').color,
                            anchorCount: document.querySelectorAll('article a.anchor').length,
                        };
                    });
                    const context = `${width}px / ${theme}`;
                    assert.equal(styles.overflow, false, context);
                    assert.equal(styles.heading, width === 390 ? '48px' : '60px', context);
                    assert.equal(styles.h2, '32px', context);
                    assert.equal(styles.nestedTocLine, '24px', context);
                    assert.equal(styles.codeLine, styles.parentLine, context);
                    assert.equal(styles.tipBackground, 'rgb(255, 252, 254)', context);
                    assert.equal(styles.tipBorder, 'rgb(25, 26, 27)', context);
                    assert.match(styles.tipShadow, /rgb\(255, 38, 158\) 3px 3px/, context);
                    assert.doesNotMatch(styles.tocShadow, /[1-9]\d*(?:\.\d+)?px/, context);
                    assert.equal(styles.dark, theme === 'dark', context);
                    assert.equal(styles.headingColor, theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(25, 26, 27)', context);
                    assert.equal(styles.anchorCount, 88, context);

                    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
                    const home = await page.evaluate(() => ({
                        overflow: document.documentElement.scrollWidth > innerWidth,
                        heading: document.querySelector('h1').textContent,
                        gradient: getComputedStyle(document.querySelector('[class*="bg-linear"]')).backgroundImage,
                    }));
                    assert.equal(home.overflow, false, context);
                    assert.equal(home.heading.trim(), 'Learn Statamic', context);
                    if (theme === 'light') {
                        assert.match(home.gradient, /linear-gradient/, context);
                        assert.match(home.gradient, /rgb\(184, 255, 243\)/, context);
                    } else {
                        assert.equal(home.gradient, 'none', context);
                    }

                    await page.goto(`${baseUrl}/installing`, { waitUntil: 'networkidle0' });
                    const installing = await page.evaluate(() => ({
                        overflow: document.documentElement.scrollWidth > innerWidth,
                        cards: document.querySelectorAll('[class*="bg-linear"]').length,
                        heading: document.querySelector('h1').textContent,
                    }));
                    assert.equal(installing.overflow, false, context);
                    assert.equal(installing.heading.trim(), 'How to Install Statamic', context);
                    assert.ok(installing.cards >= 5, context);
                } finally {
                    await page.close();
                }
            }
        }
    } finally {
        await browser.close();
    }
});
