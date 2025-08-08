export default function decorate(block) {
  [...block.children].forEach((row) => {
    headings.append(row);
  });
  block.innerHTML = "";
  [headings].forEach((row) => {
    block.append(row);
  });
  // Title
  const title = document.createElement("h2");
  title.textContent = "Select color and variant to buy";
  block.append(title);

  // Variants
  const variantsDiv = document.createElement("div");
  variantsDiv.className = "bike-selector__variants";
  const variants = [
    { value: "standard", label: "Standard" },
    { value: "sport", label: "Sport" },
    { value: "deluxe", label: "Deluxe" },
  ];
  variants.forEach((variant, i) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "variant";
    input.value = variant.value;
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
