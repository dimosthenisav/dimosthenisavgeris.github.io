---
title: "I built Consumed, a chrome extension"
description: "A lazy-afternoon side project built with Cursor: a Chrome extension that turns prices on Greek e-commerce sites into hours of your life."
date: 2025-08-30
tags: ["product", "tools"]
---

This all started with a random video on YouTube about consumerism and a catchphrase that is somehow trendy but true: "I buy therefore I am".

Also, I am semi-renovating my house and furniture prices don't look good, not gonna lie to you.

I thought about, hey how many hours of my life does this actually cost?

So, on a lazy afternoon, I thought: why not make something useful? Since I am experimenting with Cursor nowadays, it took me about 3-4 hours to make [Consumed](https://chromewebstore.google.com/detail/consumed/bgmjehdkgmkinpmekobhfoaamolfonaa), a basic Google Chrome extension that finds price strings on Skroutz (and other popular e-commerce websites) and, once you tell it your monthly or hourly wage, slaps a little message next to each one: "This will cost you X hours."

```javascript
// Converts European prices (e.g., "1.234,56") to a number
function parsePrice(priceText) {
  const cleanPrice = priceText.replace(/\./g, '').replace(',', '.');
  const price = parseFloat(cleanPrice);
  return isNaN(price) ? 0 : price;
}

// Calculates work hours for purchase
function calculateHours(price, hourlyWage) {
  return hourlyWage > 0 ? price / hourlyWage : 0;
}
```

## How I Built It With Cursor: My Methodology

1. **Start with a Quick PRD** — I wrote a short product summary using ChatPRD to clarify what I wanted to build.
2. **Break Down the Project into Small Tasks** — I separated features like price detection, parsing European number formats, calculation, and UI enhancements.
3. **Prompt Cursor Explicitly for Each Task** — Clear instructions like "Write a function to convert prices with comma decimals" gave me clean results.
4. **Iterate and Refine** — I fine-tuned generated code by asking Cursor to handle edge cases or add comments.
5. **Finalize and Document** — I cleaned up comments and improved code readability.
6. **Publish Quickly and Iterate** — The extension went live fast (review from Google took like a day or two).

Is it life-changing? Definitely not. But now, before I buy a new sofa or TV, I get a small prompt reminding me this stuff costs more than numbers. And if you're also fixing up a place, or stuck in algorithm-recommended videos about buying less stuff, maybe you'll find it useful too.

Keep iterating and stay curious!

[Check out Consumed on the Chrome Web Store →](https://chromewebstore.google.com/detail/consumed/bgmjehdkgmkinpmekobhfoaamolfonaa)
