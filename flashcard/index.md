---
layout: layouts/home.njk
title: Szókártya
eleventyNavigation:
  key: Szókártya
  order: 6
---

<script src="{{ '/assets/js/webcomponent-flashcard.js' | url }}"></script>
<!-- <script src="{{ '/js/webcomponent-flashcard.js' | url }}" async="async">DEVELOPMENT</script> -->

<!-- upgrade: npm install --save webcomponent-flashcard@X.X.X -->

<webcomponent-flashcard href="{{ '/public/spanish-hungarian.json' | url }}"></webcomponent-flashcard>

## Hogyan működik

- a szókártyára kattintva megtekintheted a jelentését, ha eltaláltad megjelölheted ismertként, ha eltévesztetted megjelölheted ismétlendőként
- a vissza gombbal újra megpróbálhatod az előző kártyát
- mikor végigértél a szavakon a helyesen kitalált szavak kikerülnek a listából, hogy gyakorolhasd a nehezebb szavakat egészen addig míg az összes kártya el nem fogy