<p align="center"><img src="https://statamic.com/assets/branding/Statamic-Logo+Wordmark-Rad.svg" width="400" alt="Statamic Logo" /></p>

## Statamic Documentation

This is the source of the official [Statamic docs][docs].


## Local Development

If you want to work on this project on your local machine, you may follow the instructions below. These instructions assume you are serving the site using [Laravel Valet](https://laravel.com/docs/valet) out of your `~/Sites` directory:

1. Fork this repository
2. Open your terminal and cd to your `~/Sites` folder
3. Clone your fork into the `~/Sites/docs` folder, by running the following command with your username placed into the {username} slot:
    git clone git@github.com:{username}/docs statamic-docs
4. CD into the new directory you just created.
5. Run the following commands:
  ```
  composer install
  nvm use
  npm ci --ignore-scripts
  cp .env.example .env
  php artisan key:generate
  npm run dev
  ```

Use PHP 8.4 and Node 22.23.3 (`.nvmrc`). Vite 8 and Laravel Vite Plugin 3
replace Laravel Mix; run `npm run build` (or `npm run production`) for deployment.
Publish `public/build/` with its manifest. Templates use the Statamic `vite` tag;
the previous Mix manifest, Webpack patch and BrowserSync proxy are removed.
For local development, serve Laravel separately, then run `npm run dev` without
`CI=true`. Vite reloads template/content edits. The old `watch-poll` command is
removed; use `server.watch.usePolling` in `vite.config.mjs` if needed.

Stop the Vite development server before generating a deployable static export;
otherwise its active hot file makes templates reference development assets.
Run `php vendor/bin/phpunit`, then `php artisan statamic:ssg:generate` and
`npm run test:static`. The static export copies the Vite build directory, and the
asset checks verify that generated pages reference files present in that export.

Tailwind 4 uses `@tailwindcss/vite`. The custom palette, shadows, fonts and list
columns remain in `tailwind.config.js`, loaded by `@config`; source paths,
important utilities, the dark variant and custom font sizes live in
`resources/css/tailwind.css`. The legacy PostCSS pipeline is removed. Full npm,
runtime npm and Composer audits are clean; CI blocks every npm audit severity.

**Breaking browser requirement:** Tailwind 4 CSS requires Safari 16.4+, Chrome
111+ and Firefox 128+. The older JavaScript build targets do not lower this CSS
requirement. Confirm browser support before deployment. See the
[Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

With built assets served at `APP_URL`, run
`RUN_BROWSER_TESTS=1 npm run test:browser`. Set `BROWSERSHOT_CHROME_PATH` to an
installed Chrome binary, or install Puppeteer's browser separately. The test
covers the home, installation and Antlers pages at mobile/desktop sizes in both
themes. It checks custom callout colors/shadows, heading sizes, nested TOC
spacing, inline-code line boxes, anchors, gradients and horizontal overflow.
External resources are blocked to keep it independent of fonts, ads and live
search. CI uses the runner's installed Chrome; browser downloads are unnecessary.

Live search results, Torchlight authorization and hosting still require their
intended service configuration. Existing missing image paths and one PHPUnit
deprecation remain outside this dependency migration.

## Providing Feedback

We love it when people provide thoughtful feedback! Feel free to open issues on for any content you find confusing or incomplete. We are happy to consider anything you feel will make the docs and CMS better.


## Contributing

Thank you for considering contributing to Statamic! Every page in the [docs site](https://statamic.dev) has a link at the bottom that will take you right to the exact content file that renders the page. Click the edit button and submit those PRs!

**We simply ask that you please review the [contribution guide][contribution] before you send pull requests.**


## Code of Conduct

In order to ensure that the Statamic community is welcoming to all and generally a rad place to belong, please review and abide by the [Code of Conduct](https://github.com/statamic/cms/wiki/Code-of-Conduct).


## Important Links

- [Statamic Main Site](https://statamic.com)
- [Statamic Documentation][docs]
- [Statamic CMS Repo][cms-repo] (that we maintain)
- [Statamic Application Repo][app-repo] (that you clone)
- [Statamic Migrator](https://github.com/statamic/migrator)
- [Statamic Discord][discord]

[docs]: https://statamic.dev/
[discord]: https://statamic.com/discord
[contribution]: https://github.com/statamic/cms/blob/master/CONTRIBUTING.md
[app-repo]: https://github.com/statamic/statamic
[cms-repo]: https://github.com/statamic/cms
