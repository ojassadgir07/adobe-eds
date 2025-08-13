/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadSections,
} from '../../scripts/aem.js';

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    // eslint-disable-next-line no-param-reassign
    path = path.replace(/(\.plain)?\.html/, '');
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
     
       if (path === "/footer") {
        main.innerHTML = `<div>
  <p>
    <picture>
      <source type="image/webp" srcset="./media_136000767eef412a97a70f7689f069363d945a974.svg?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="./media_136000767eef412a97a70f7689f069363d945a974.svg?width=750&#x26;format=webply&#x26;optimize=medium">
      <source type="image/svg+xml" srcset="./media_136000767eef412a97a70f7689f069363d945a974.svg?width=2000&#x26;format=svg&#x26;optimize=medium" media="(min-width: 600px)">
      <img loading="lazy" alt="hero-footer-logo" src="./media_136000767eef412a97a70f7689f069363d945a974.svg?width=750&#x26;format=svg&#x26;optimize=medium" width="130" height="42">
    </picture>
  </p>
  <ul>
    <li>
      <p><a href="https://www.heromotocorp.com/en-in/about-us/company-overview.html">ABOUT US</a></p>
      <ul>
        <li><a href="https://www.heromotocorp.com/en-in/company/about-us/board-and-leadership.html?key1=board-of-directors.html">Board of Directors</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/company/about-us/board-and-leadership.html?key1=leadership-team.html">Leadership Team</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/company/reports-and-policies/key-policies.html">Key Policies</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/company/sustainability/esg-sustainability.html">Sustainability</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/company/reports-and-policies/reports.html">Our Reports</a></li>
      </ul>
    </li>
    <li>
      <p><a href="https://www.heromotocorp.com/en-in/owners-manual.html">MY HERO</a></p>
      <ul>
        <li><a href="https://www.heromotocorp.com/en-in/blogs.html">Blogs</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/services/owner-manual.html">Owner's Manual</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/services/two-wheeler-tips.html">Two Wheelers Tips</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/goodlife/">Hero Goodlife</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/xclan/">XClan</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/company/csr/htrts.html">Be A Safe Hero</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/services/service-and-maintenance.html">Service &#x26; Maintenance</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/services/hero-joyride-packages.html">Hero Joyride</a></li>
      </ul>
    </li>
    <li>
      <p><a href="https://www.heromotocorp.com/en-in/company/contact-us.html">REACH US</a></p>
      <ul>
        <li><a href="https://www.heromotocorp.com/en-in/company/contact-us.html">Contact Us</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/reach-us/find-hero-bike-dealers.html">Find a Dealer</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/company/contact-us.html?key1=general-enquiry">Corporate Enquiry</a></li>
        <li><a href="https://channel.heromotocorp.com/admin/login">Become a Channel Partner</a></li>
      </ul>
    </li>
    <li>
      <p><a href="https://www.heromotocorp.com/en-in/company/newsroom/press-release-news-and-media.html">NEWSROOM</a></p>
      <ul>
        <li><a href="https://www.heromotocorp.com/en-in/company/newsroom/media-kit.html">Media Kit</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/company/newsroom/hero-in-the-news.html">In the Press</a></li>
        <li><a href="https://www.heromotocorp.com/en-in/company/newsroom/press-release-news-and-media.html">Press Releases</a></li>
      </ul>
    </li>
  </ul>
  <div class="section-metadata">
    <div>
      <div>style</div>
      <div>hero-footer</div>
    </div>
  </div>
</div>
<div>
  <ul>
    <li>
      <ul>
        <li><a href="https://www.youtube.com/user/TheHeromotocorp"><span class="icon icon-youtube-icon"></span></a></li>
        <li><a href="https://www.facebook.com/HeroMotoCorpIndia"><span class="icon icon-facebook-icon"></span></a></li>
        <li><a href="https://www.linkedin.com/company/heromotocorp"><span class="icon icon-linkedin-icon"></span></a></li>
        <li><a href="https://www.instagram.com/heromotocorp/"><span class="icon icon-instagram-icon-hero"></span></a></li>
        <li><a href="https://x.com/heromotocorp"><span class="icon icon-twitter-icon"></span></a></li>
      </ul>
    </li>
  </ul>
  <p>
    <picture>
      <source type="image/webp" srcset="./media_1f11fea68abe5f90e8a8bd4b1e6f5d7d3ed8aae7e.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="./media_1f11fea68abe5f90e8a8bd4b1e6f5d7d3ed8aae7e.png?width=750&#x26;format=webply&#x26;optimize=medium">
      <source type="image/png" srcset="./media_1f11fea68abe5f90e8a8bd4b1e6f5d7d3ed8aae7e.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
      <img loading="lazy" alt="playstore-icon" src="./media_1f11fea68abe5f90e8a8bd4b1e6f5d7d3ed8aae7e.png?width=750&#x26;format=png&#x26;optimize=medium" width="405" height="133">
    </picture>
  </p>
  <p><a href="https://play.google.com/store/apps/details?id=com.customerapp.hero&#x26;hl=en">/</a></p>
  <p>
    <picture>
      <source type="image/webp" srcset="./media_1948ec1a12ffe05d8b63c13d26d5a9aef7b1c6ea0.png?width=2000&#x26;format=webply&#x26;optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="./media_1948ec1a12ffe05d8b63c13d26d5a9aef7b1c6ea0.png?width=750&#x26;format=webply&#x26;optimize=medium">
      <source type="image/png" srcset="./media_1948ec1a12ffe05d8b63c13d26d5a9aef7b1c6ea0.png?width=2000&#x26;format=png&#x26;optimize=medium" media="(min-width: 600px)">
      <img loading="lazy" alt="appstore-icon" src="./media_1948ec1a12ffe05d8b63c13d26d5a9aef7b1c6ea0.png?width=750&#x26;format=png&#x26;optimize=medium" width="362" height="95">
    </picture>
  </p>
  <p><a href="https://apps.apple.com/us/app/hero-app/id1079298028?mt=8">/</a></p>
  <div class="section-metadata">
    <div>
      <div>style</div>
      <div>hero-footer-icon</div>
    </div>
  </div>
</div>
<div>
  <ul>
    <li><a href="https://www.heromotocorp.com/en-in/privacy-policy.html">Privacy Policy</a></li>
    <li><a href="https://www.heromotocorp.com/en-in/disclaimer.html">Disclaimer</a></li>
    <li><a href="https://www.heromotocorp.com/en-in/terms-of-use.html">Terms of Use</a></li>
    <li><a href="https://www.heromotocorp.com/en-in/rules-and-regulations.html">Rules &#x26; Regulations</a></li>
    <li><a href="https://www.heromotocorp.com/en-in/data-collection-contract.html">Data Collection Contract</a></li>
    <li><a href="https://www.heromotocorp.com/en-in/sitemap.html">Sitemap</a></li>
  </ul>
  <p>Copyright Hero MotoCorp Ltd. 2025 . All Rights Reserved.</p>
  <div class="section-metadata">
    <div>
      <div>style</div>
      <div>hero-footer-policy</div>
    </div>
  </div>
</div>
`
      } else {
        main.innerHTML = await resp.text();
      }

      // reset base path for media to fragment base
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector(':scope .section');
    if (fragmentSection) {
      block.classList.add(...fragmentSection.classList);
      block.classList.remove('section');
      block.replaceChildren(...fragmentSection.childNodes);
    }
  }
}
