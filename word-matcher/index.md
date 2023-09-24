---
layout: layouts/post.njk
title: Szópárosító
templateClass: tmpl-home
eleventyNavigation:
  key: Szópárosító
  order: 6
---

<script type="module" src="{{ '/assets/js/webcomponent-word-matcher.js' | url }}" async="async"></script>
<!-- <script src="{{ '/js/webcomponent-word-matcher.js' | url }}" async="async">DEVELOPMENT</script> -->

<!-- upgrade: npm install --save webcomponent-word-matcher@X.X.X -->

<webcomponent-word-matcher
  showScore="showScore"
  href="{{ '/public/spanish-hungarian.json' | url }}">
</webcomponent-word-matcher>

## Hogyan működik

- Keresd meg a szavak párját
- Kattints a bal oldalon egy dobozban levő szóra, és a jobb oldalon is egy dobozban levő szóra
- Ha eltaláltad új szót kapsz helyette
- Ha nem találtad el büntetésből egy rövid ideig nem kattinthatóak a kiválasztott szavak
