import { fetchbikeVarients } from "../../scripts/common.js";
import {
  div,
  input,
  label,
  h4,
  span,
  img,
  i,
} from "../../scripts/dom-helpers.js";
let currentFrame = 0;
export async function decorateBikeSelector(block) {
  let heading;
  let bottomSection;

  if (!block.querySelector("h2.heading")) {
    const props = Array.from(block.children).map((ele) => ele.children);
    heading = props[0][0].querySelector("h2");
    heading.classList.add("heading");
    bottomSection = props[1][0];
    bottomSection.classList.add("bottom-sec");
  } else {
    heading = block.querySelector("h2.heading");
    bottomSection = block.querySelector(".bottom-sec");
  }

  block.innerHTML = "";
  block.append(heading);

  block.append(
    div(
      { class: "bike-selector__mainWrapper" },
      div({ class: "loading" }, span("Loading..."))
    )
  );
  block.append(bottomSection);
  let response = await fetchbikeVarients("DEL", "DELHI");

  const productInfo = response.data.products.items?.[0];
  const { variant_to_colors: variantsData, variants: allVariantsDetails } =
    productInfo;
  // Title

  const initialVariantGroup = variantsData[0];
  const initialColor = initialVariantGroup.colors[0];

  const getVariantDetailsBySku = (sku) =>
    allVariantsDetails.find((variant) => variant[sku])?.[sku];
  var dataMapping = { sku: initialColor.sku };

  const updateMainImage = (sku) => {
    const media = getVariantDetailsBySku(sku);
    const imgEl = block.querySelector(
      ".bike-selector__360View  .hero-360 .hero-360 .spritespin-stage .rotate"
    );
    if (media?.product?.media_gallery?.length && imgEl) {
      imgEl.src = media.product.media_gallery[0].url;
    }
  };

  const renderColors = (colors, selectedLabel) => {
    const container = block.querySelector(".colors-container .color-wrapp");
    if (!container) return;

    container.innerHTML = "";

    colors.forEach(({ sku, label: colorLabel, color_swatch_url }) => {
      const option = div(
        {
          class: `color-option ${colorLabel === selectedLabel ? "active" : ""}`,
          onClick: () => {
            dataMapping.sku = sku;

            updateMainImage(sku);
            updateActiveColorSwatch(colorLabel);
          },
        },
        span(colorLabel),
        img({
          class: "swatch-color",
          loading: "lazy",
          src: `https://www.heromotocorp.com${color_swatch_url}`,
          alt: colorLabel,
        })
      );
      container.append(option);
    });
  };

  const updateActiveColorSwatch = (colorLabel) => {
    block
      .querySelectorAll(".color-option")
      .forEach((option) =>
        option.classList.toggle(
          "active",
          option.querySelector("span").textContent === colorLabel
        )
      );
  };

  const handleVariantChange = (e) => {
    const selectedValueIndex = e.target.value;
    block
      .querySelectorAll(".bike-form-control")
      .forEach((el) => el.classList.remove("active"));
    e.target.closest(".bike-form-control").classList.add("active");

    const selectedGroup = variantsData.find(
      (v) => v.value_index == selectedValueIndex
    );
    if (selectedGroup) {
      const { sku, label } = selectedGroup.colors[0];
      dataMapping.sku = sku;
      updateMainImage(sku);
      renderColors(selectedGroup.colors, label);
    }
  };

  const variantsDOM = div(
    { class: "bike-selector__variantsWrapper" },
    div(
      { class: "variants-wrap" },
      div({ class: "text" }, "Variants"),
      div(
        { class: "radio-wrap" },
        ...variantsData.map(
          ({ value_index, label: variantLabel, variant_price }) => {
            const isActive = initialVariantGroup.value_index === value_index;
            const radioProps = {
              class: "input-radio",
              type: "radio",
              id: value_index,
              name: "variants",
              value: value_index,
              onChange: handleVariantChange,
            };
            if (isActive) radioProps.checked = true;

            return div(
              { class: `bike-form-control  ${isActive ? "active" : ""}` },
              div(
                { class: "price-txt-wrap " },
                input(radioProps),
                label({ for: value_index, class: "" }, span(variantLabel)),
                div(
                  { class: "price-sec" },
                  span(`( ₹ ${variant_price.toLocaleString("en-IN")} )`)
                )
              )
            );
          }
        )
      )
    )
  );

  const {
    product: {
      media_gallery: [firstImage],
    },
  } = getVariantDetailsBySku(initialColor.sku);

  const imageDom = div(
    { class: "bike-selector__360View" },
    div(
      { class: "hero-360 w-100" },
      // div(
      //   { class: "rotate-images" },
      //   img({ class: "hero-icon left"}),
      //   img({ class: "hero-icon right"})
        
      // )
      div(
      { class: "rotate-images" },
      i({ class: "hero-icon left" }),
      i({ class: "hero-icon right" })
    ),
      div(
        { class: "hero-360" },
        div(
          { class: "spritespin-stage" },
          img({
            class: "rotate",
            src: firstImage.url,
            width: "490",
            height: "350",
          })
        )
      ),
      div({ class: "hero-360__" })
    )
  );


  const colorsDiv = div(
    { class: "colors-container" },
    h4({ class: "mb-8 weight" }, "Colours"),
    div({ class: "color-wrapp" })
  );
  
  block
    .querySelector(".bike-selector__mainWrapper")
    .replaceChildren(variantsDOM, imageDom, colorsDiv);

  const mainImage = block.querySelector(".bike-selector__360View .rotate");
  const leftIcon = block.querySelector(".hero-icon.left");
  const rightIcon = block.querySelector(".hero-icon.right");

  renderColors(initialVariantGroup.colors, initialColor.label);

  if (leftIcon && rightIcon) {
    leftIcon.addEventListener("click", () => {
      const media = getVariantDetailsBySku(dataMapping.sku);
      const rotateUrls = media.product.media_gallery;
      rotateFrame(rotateUrls, mainImage, -1);
    });
    rightIcon.addEventListener("click", () => {
      const media = getVariantDetailsBySku(dataMapping.sku);
      const rotateUrls = media.product.media_gallery;
      rotateFrame(rotateUrls, mainImage, 1);
    });
  }

}

export default async function decorate(block) {
  await decorateBikeSelector(block);
}
const rotateFrame = (rotateUrlString, imgEl, direction = 1) => {
  const imgRotateUrls = rotateUrlString;
  const totalFrames = imgRotateUrls.length;
  currentFrame = (currentFrame + direction + totalFrames) % totalFrames;
  imgEl.src = imgRotateUrls[currentFrame].url;
};
