import { fetchPlaceholders, getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";


// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia("(min-width: 900px)");
const placeholders = await fetchPlaceholders("/form");
const { headerXf, helpAndSupportPageUrl } = placeholders;
function closeOnEscape(e) {
  if (e.code === "Escape") {
    const nav = document.getElementById("nav");
    const navSections = nav.querySelector(".nav-sections");
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]'
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector("button").focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector(".nav-sections");
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]'
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === "nav-drop";
  if (isNavDrop && (e.code === "Enter" || e.code === "Space")) {
    const dropExpanded = focused.getAttribute("aria-expanded") === "true";
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest(".nav-sections"));
    focused.setAttribute("aria-expanded", dropExpanded ? "false" : "true");
  }
}

function focusNavSection() {
  document.activeElement.addEventListener("keydown", openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections
    .querySelectorAll(".nav-sections .default-content-wrapper > ul > li")
    .forEach((section) => {
      section.setAttribute("aria-expanded", expanded);
    });
}

export async function getFetchAPI(url) {
  try {
    const resp = await fetch(url);
    return resp;
  } catch (error) {
    console.error("Fetch API error:", error);
    return error;
  }
}

export async function appendXF(block, xfPath) {
  const resp = await getFetchAPI(xfPath);
  let str;
  if (resp.ok) {
    str = await resp.text();
  } else {
    return;
  }

  const { location } = window;
  const isLocalOrAem =
    location.href.includes("localhost") ||
    location.href.includes(".aem.live") ||
    location.href.includes(".aem.page");

  if (isLocalOrAem) {
    str = str.replaceAll(
      "/etc.clientlibs/",
      "https://stage.heromotocorp.com/etc.clientlibs/"
    );
    str = str.replaceAll(
      "/content/dam/",
      "https://stage.heromotocorp.com/content/dam/"
    );
  }
  str = str.replaceAll("hp-hide-cmp-checkbox", "");

  const div = document.createElement("div");
  div.innerHTML = str;

  div.querySelector(".tray-container")?.remove();
  div.querySelector(".drawer-container")?.remove();

  const includeClientLibs = [
    "/clientlib-dependencies.lc",
    "/clientlib-site-lite.lc",
  ];
  div.querySelectorAll("link").forEach((link) => {
    if (includeClientLibs.some((clientLib) => link.href.includes(clientLib))) {
      const newLink = document.createElement("link");
      newLink.href = link.href;
      newLink.rel = "stylesheet";
      document.head.append(newLink);
    } else {
      link.remove();
    }
  });
  setTimeout(()=>{
    block.append(div);

  initDesktopMegaMenu();
  }, 400);
  // block.append(div);

  // initDesktopMegaMenu();

  return block;
}

function initDesktopMegaMenu() {
  document.querySelectorAll(".megamenu-li").forEach((menuItem) => {
    menuItem.addEventListener("click", function (event) {
      const target = event.target;
      const isNavLink =
        target.classList.contains("nav-link") ||
        target.parentElement?.classList.contains("nav-link");

      if (isNavLink) {
        this.parentElement
          ?.querySelectorAll(".megamenu-li.active")
          ?.forEach((el) => {
            if (el !== this) el.classList.remove("active");
          });

        const allMenus = document.querySelectorAll(".megamenu.slim-scroll");
        const thisMenu = this.querySelector(".megamenu.slim-scroll");

        allMenus.forEach((menu) =>
          menu.classList.remove("homepage-drop-animation")
        );
        document
          .querySelectorAll(".homepage-animate")
          .forEach((el) => el.classList.remove("homepage-animate"));

        if (
          thisMenu &&
          thisMenu.classList.contains("homepage-drop-animation")
        ) {
          navTimeoutSession = setTimeout(() => {
            this.classList.toggle("active");
          }, 400);
        } else {
          this.classList.toggle("active");
          setTimeout(
            () => thisMenu?.classList.add("homepage-drop-animation"),
            50
          );
        }

        if (this.classList.contains("active")) {
          document.body.classList.add("hide-scroll");
        } else {
          document.body.classList.remove("hide-scroll");
        }

        document
          .querySelectorAll(
            ".bike-spec p, .about-premia-text p, .scroll-for-more-container p, .parts-desc, .parts-wrap .parts-title"
          )
          .forEach((p) => {
            p.style.display = "block";
          });

        const classNames = this.className.split(/\s+/);
        const combinedClassNames = "." + classNames.join(".");

        if (combinedClassNames.includes("new-header-variation")) {
          this.querySelectorAll(".homepage-animate").forEach((el) =>
            el.classList.remove("homepage-animate")
          );
        }

        dropdownItemsSession = setTimeout(() => {
          initHeader(combinedClassNames);
        }, 50);

        const anyActive =
          document.querySelectorAll(".nav-item.dropdown.megamenu-li.active")
            .length > 0;
        document.body.classList.toggle("position-fixed", anyActive);

        if (document.querySelector(".e-shop")?.classList.contains("active")) {
          const siblings =
            this.parentElement?.parentElement?.querySelectorAll(".megamenu-li");
          siblings?.forEach((sibling) => {
            if (sibling !== this) sibling.classList.remove("active");
          });
        }
      }
    });
  });
}

function initHeader(parentClassName) {
  if (parentClassName?.toString().toLowerCase().includes("service")) return;

  const selectedCategory = document.querySelector(parentClassName?.toString());
  if (!selectedCategory) return;

  const bikeArray = selectedCategory.querySelector(".column2.vehicle-options");
  const bikeDetailsArray = selectedCategory.querySelector(
    ".column3.vehicle-spec-info"
  );
  const filtersArray = selectedCategory.querySelector(".column1.bike-filters");

  const filtersContainer = filtersArray?.querySelectorAll(".filters");
  const bikeItemContainers = bikeArray?.querySelectorAll(
    ".bike-item-container"
  );
  const aboutPremiaContainer =
    bikeArray?.querySelectorAll(".about-premia-text");
  const aboutPremiaImgContainer = bikeDetailsArray?.querySelector(
    ".about-premia-image-container"
  );
  const bikeDetailsContainers =
    bikeDetailsArray?.querySelectorAll(".bike-details");
  const scrollIndicator = selectedCategory.querySelector(".scroll-indicator");

  let timeOutSession;

  const handleClickBikeItem = (event, index) => {
    bikeItemContainers.forEach((bike) => bike.classList.remove("selected"));
    event.currentTarget.classList.add("selected");
    handleBikeDetailsDisplay(index);
  };

  const handleBikeDetailsDisplay = (index) => {
    clearTimeout(timeOutSession);
    bikeDetailsContainers[index].classList.add("selected");
    setTimeout(() => {
      bikeDetailsContainers[index].classList.add("homepage-animate");
    }, 30);
    bikeDetailsContainers.forEach((item, i) => {
      if (i !== index) item.classList.remove("homepage-animate");
    });
    timeOutSession = setTimeout(() => {
      bikeDetailsContainers.forEach((item, i) => {
        if (i !== index) item.classList.remove("selected");
      });
    }, 450);
    setTimeout(handleScrollIndicator, 500);
  };

  const handleAboutPremiaDisplay = (isShow) => {
    if (!aboutPremiaContainer || !aboutPremiaImgContainer) return;
    if (isShow) {
      bikeDetailsContainers?.forEach((el) =>
        el.classList.remove("selected", "homepage-animate")
      );
      bikeItemContainers?.forEach((el) => {
        el.classList.remove("selected");
        el.style.display = "none";
      });
      bikeDetailsArray?.classList.add("p-0");
      scrollIndicator?.classList.add("d-none");
      aboutPremiaContainer?.forEach((el) => el.classList.remove("d-none"));
      aboutPremiaImgContainer.classList.remove("d-none");
    } else {
      aboutPremiaContainer?.forEach((el) => el.classList.add("d-none"));
      aboutPremiaImgContainer.classList.add("d-none");
      bikeDetailsArray?.classList.remove("p-0");
      scrollIndicator?.classList.remove("d-none");
    }
  };

  const handleClickBikeFilters = (event) => {
    filtersContainer.forEach((filter) => filter.classList.remove("selected"));
    const clickedFilter = event.currentTarget;
    clickedFilter.classList.add("selected");
    const range = clickedFilter.dataset.filterRange;
    if (range) filterBikes(range.trim());
  };

  const filterBikes = (range) => {
    clearTimeout(timeOutSession);
    timeOutSession = setTimeout(() => {
      bikeItemContainers.forEach((item) =>
        item.classList.remove("homepage-animate")
      );
    }, 350);

    setTimeout(() => {
      let toBeSelectedIndex = -1;

      if (range === "newlaunch") {
        handleAboutPremiaDisplay(false);
        bikeItemContainers.forEach((item, index) => {
          const isNew = item.dataset.isNewLaunch === "true";
          item.style.display = isNew ? "flex" : "none";
          if (isNew) {
            item.classList.remove("selected");
            setTimeout(() => item.classList.add("homepage-animate"), 50);
            if (toBeSelectedIndex === -1) {
              toBeSelectedIndex = index;
              item.classList.add("selected");
              handleBikeDetailsDisplay(index);
            }
          }
        });
      } else if (range === "aboutpremia") {
        handleAboutPremiaDisplay(true);
      } else {
        handleAboutPremiaDisplay(false);
        const [startRange, endRange] = range.split("-").map(Number);

        bikeItemContainers.forEach((item, index) => {
          const bikeSpec = item.querySelector(".bike-spec")?.textContent;
          const cc = extractNumberFromSpecification(bikeSpec?.trim() || "");

          const shouldDisplay = cc && cc >= startRange && cc < endRange;
          item.style.display = shouldDisplay ? "flex" : "none";
          if (shouldDisplay) {
            item.classList.remove("selected");
            setTimeout(() => item.classList.add("homepage-animate"), 50);
            if (toBeSelectedIndex === -1) {
              toBeSelectedIndex = index;
              item.classList.add("selected");
              handleBikeDetailsDisplay(index);
            }
          }
        });
      }
    }, 350);
  };

  const handleScrollIndicator = () => {
    const parentDiv = selectedCategory.querySelector(".column.column2");
    if (!parentDiv) {
      return;
    }
    const bikeItems = parentDiv.querySelectorAll(".bike-item-container");
    const totalHeight = [...bikeItems].reduce(
      (sum, el) => sum + el.offsetHeight,
      0
    );
    const indicator = selectedCategory.querySelector(".scroll-indicator");

    if (totalHeight > parentDiv.offsetHeight) {
      indicator.style.display = "flex";
    } else {
      indicator.style.display = "none";
    }
  };

  const extractNumberFromSpecification = (str) => {
    const match = str.match(/(\d+(\.\d+)?)/);
    return match ? Number(match[0]) : null;
  };

  if (bikeArray && bikeItemContainers.length > 0) {
    bikeItemContainers[0].classList.add("selected");
    bikeItemContainers.forEach((item, index) => {
      item.addEventListener("click", (e) => handleClickBikeItem(e, index));
    });
  } else {
    console.error('".column2.vehicle-options" not found.');
  }

  if (filtersArray && filtersContainer?.length > 0) {
    filtersArray.classList.remove("homepage-animate");
    setTimeout(() => {
      filtersArray.classList.add("homepage-animate");
    }, 450);

    filtersContainer.forEach((el) => el.classList.remove("selected"));
    filtersContainer[0].classList.add("selected");
    filtersContainer.forEach((filter) => (filter.style.display = "block"));

    const defaultRange = filtersContainer[0].dataset.filterRange;
    if (defaultRange) filterBikes(defaultRange.trim());

    filtersContainer.forEach((filter) => {
      filter.addEventListener("click", handleClickBikeFilters);
    });
  }

  const scrollContainers = document.querySelectorAll(".column.column2");
  scrollContainers.forEach((container) => {
    container.removeEventListener("scroll", handleScrollCheck);
    container.addEventListener("scroll", handleScrollCheck);
  });

  function handleScrollCheck(e) {
    const el = e.target;
    const scrollPosition = el.scrollTop + el.clientHeight;
    const divContentHeight = el.scrollHeight;
    const indicator = el
      .closest(parentClassName)
      ?.querySelector(".scroll-indicator");

    if (!indicator) return;

    if (scrollPosition >= divContentHeight - 1) {
      indicator.style.display = "none";
    } else {
      indicator.style.display = "flex";
    }
  }

  setTimeout(handleScrollIndicator, 500);
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded =
    forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute("aria-expanded") === "true";
  const button = nav.querySelector(".nav-hamburger button");
  document.body.style.overflowY = expanded || isDesktop.matches ? "" : "hidden";
  nav.setAttribute("aria-expanded", expanded ? "false" : "true");
  toggleAllNavSections(
    navSections,
    expanded || isDesktop.matches ? "false" : "true"
  );
  button.setAttribute(
    "aria-label",
    expanded ? "Open navigation" : "Close navigation"
  );
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll(".nav-drop");
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute("tabindex")) {
        drop.setAttribute("tabindex", 0);
        drop.addEventListener("focus", focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute("tabindex");
      drop.removeEventListener("focus", focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener("keydown", closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener("focusout", closeOnFocusLost);
  } else {
    window.removeEventListener("keydown", closeOnEscape);
    nav.removeEventListener("focusout", closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata("nav");
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : "/nav";
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = "";
  const nav = document.createElement("nav");
  nav.id = "nav";
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ["brand", "sections", "tools", "bar"];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector(".nav-brand");
  const brandLink = navBrand.querySelector(".button");
  if (brandLink) {
    brandLink.className = "";
    brandLink.closest(".button-container").className = "";
  }

  const navSections = nav.querySelector(".nav-sections");
  if (navSections) {
    navSections
      .querySelectorAll(":scope .default-content-wrapper > ul > li")
      .forEach((navSection) => {
        if (navSection.querySelector("ul"))
          navSection.classList.add("nav-drop");
        navSection.addEventListener("click", () => {
          if (isDesktop.matches) {
            const expanded =
              navSection.getAttribute("aria-expanded") === "true";
            toggleAllNavSections(navSections);
            navSection.setAttribute(
              "aria-expanded",
              expanded ? "false" : "true"
            );
          }
        });
      });
  }

  // hamburger for mobile
  const hamburger = document.createElement("div");
  hamburger.classList.add("nav-hamburger");
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener("click", () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute("aria-expanded", "false");
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener("change", () =>
    toggleMenu(nav, navSections, isDesktop.matches)
  );

  const navWrapper = document.createElement("div");
  navWrapper.className = "nav-wrapper";
  navWrapper.append(nav);
  block.append(navWrapper);

  await appendXF(block, headerXf);
}
