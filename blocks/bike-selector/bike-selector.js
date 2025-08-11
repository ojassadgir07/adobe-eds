import { fetchbikeVarients } from "../../scripts/common.js";

export default async function decorate(block) {
  let heading;
  if (!block.querySelector("heading")) {
    const props = Array.from(block.children).map((ele) => ele.children);
    heading = props[0][0].querySelector("h1, h2, h3, h4, h5, h6");
    heading = props[0];
  } else {
    heading = block.querySelector("heading");
  }

  block.innerHTML = "";

  block.append(heading);
  //https://www.heromotocorp.com/content/hero-commerce/in/en/products/product-page/executive/jcr:content.product.executive.glamour.DEL.DELHI.json

  /* {
            "Key": "Prodcut API",
            "Text": "https://dev1.heromotocorp.com/content/hero-commerce/in/en/products/product-page/practical/jcr:content.product.practical.splendor-plus.{stateCode}.{cityCode}.json"
        },
*/
  block.append(
    div({ class: "middle-sec" }, div({ class: "loading" }, span("Loading...")))
  );
  var response = await fetchbikeVarients("DEL", "DELHI");
  const productInfo = response.data.products.items?.[0];
  const { variant_to_colors: variantsData, variants: allVariantsDetails } =
    productInfo;
  // Title
  const title = document.createElement("h2");
  title.textContent = "Select color and variant to buy";
  block.append(title);

  // Variants
  const variantsDiv = document.createElement("div");
  variantsDiv.className = "bike-selector__variants";
  const variants = variantsData;
  variants.forEach((variant, i) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "variant";
    input.value = variant.variant_price;
    if (i === 0) input.checked = true;
    label.append(input, ` ${variant.label}`);
    variantsDiv.append(label);
  });
  block.append(variantsDiv);

  // Image and rotate
  const imageContainer = document.createElement("div");
  imageContainer.className = "bike-selector__image-container";
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
  block.append(imageContainer);

  // Colors
  const colorsDiv = document.createElement("div");
  colorsDiv.className = "bike-selector__colors";
  const colors = [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "black", label: "Black" },
  ];
  colors.forEach((color, i) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "color";
    input.value = color.value;
    if (i === 0) input.checked = true;
    label.append(input, ` ${color.label}`);
    colorsDiv.append(label);
  });
  block.append(colorsDiv);

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
