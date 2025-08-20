// add delayed functionality here
(function () {
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true; // makes it like <script >
      script.onload = () => resolve(src + " loaded");
      script.onerror = () => reject(new Error("Failed to load " + src));
      document.head.appendChild(script);
    });
  }

  // Load multiple scripts
  Promise.all([
     setTimeout(() => {
         loadScript("https://www.google-analytics.com/analytics.js"),
         loadScript("//assets.adobedtm.com/9c5fb1be77d6/aee11c13f5d9/launch-eb7b10085f33.min.js"),
         loadScript("https://www.google.com/recaptcha/api.js")
     })
  ])
    .then(messages => {
      console.log("All scripts loaded:", messages);
    })
    .catch(error => {
      console.error(error);
    });
})();
