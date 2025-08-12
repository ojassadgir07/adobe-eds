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
  var response = await fetchbikeVarients("DEL", "DELHI");
  console.log(response);
  const productInfo = response.data.products.items?.[0];
  const { variant_to_colors: variantsData, variants: allVariantsDetails } =
    productInfo;
  // Title

  const initialVariantGroup = variantsData[0];
  const initialColor = initialVariantGroup.colors[0];

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
      //dataMapping.sku = sku;
      //setDataMapping(dataMapping);
      //updateMainImage(sku);
      //renderColors(selectedGroup.colors, label);
    }
  };

  const variantsDOM = div(
    { class: "bike-selector__variantsWrapper" },
    div({ class: "variants-wrap" },
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

  const imageDom = div(
    { class: "bike-selector__360View" },
    div(
      { class: "hero-360 w-100" },
      div(
        { class: "rotate-images" },
        img({ class: "hero-icon left", src: "/images/rotate-left.png" }),
        img({ class: "hero-icon right", src: "/images/rotate-right.png" })
      ),
      div(
        { class: "hero-360" },
        div(
          { class: "spritespin-stage" },
          img({
            class: "rotate",
            src: "",
            width: "490",
            height: "350",
          })
        )
      ),
      div({ class: "hero-360__" })
    )
  );
  // Image and rotate
  const imageContainer = document.createElement("div");
  imageContainer.className = "bike-selector__overViewWrapper";
  const image = document.createElement("img");
  image.id = "bike-image";
  image.src = "/blocks/bike-selector/images/bike-standard-red.png";
  image.alt = "Bike";
  imageContainer.append(image);
  const rotateBtn = document.createElement("button");
  rotateBtn.id = "rotate-btn";
  rotateBtn.className = "bike-selector__rotate";
  rotateBtn.title = "Rotate Bike";
  const rotateIcon = document.createElement("span");
  rotateIcon.className = "rotate-icon";
  rotateIcon.textContent = "⟳";
  rotateBtn.append(rotateIcon);
  imageContainer.append(rotateBtn);


  // Colors
  const colorsDiv = document.createElement("div");
  colorsDiv.className = "bike-selector__colorsWrapper";
  const colors = variantsData[0].colors;
  colors.forEach((color, i) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "color";
    input.value = color.label;
    if (i === 0) input.checked = true;
    label.append(input, ` ${color.label}`);
    colorsDiv.append(label);
  });

  block
    .querySelector(".bike-selector__mainWrapper")
    .replaceChildren(variantsDOM, imageDom, colorsDiv);

  // Interactivity
  let rotation = 0;
  rotateBtn.addEventListener("click", () => {
    rotation = (rotation + 30) % 360;
    image.style.transform = `rotate(${rotation}deg)`;
  });

  function updateImage() {
    const variant = block.querySelector('input[name="variant"]:checked').value;
    const color = block.querySelector('input[name="color"]:checked').value;
    image.src = `/blocks/bike-selector/images/bike-${variant}-${color}.png`;
    image.alt = `${variant} bike in ${color}`;
    image.style.transform = `rotate(${rotation}deg)`;
  }

  block
    .querySelectorAll('input[name="variant"]')
    .forEach((v) => v.addEventListener("change", updateImage));
  block
    .querySelectorAll('input[name="color"]')
    .forEach((c) => c.addEventListener("change", updateImage));
}

export default async function decorate(block) {
  await decorateBikeSelector(block);
}
