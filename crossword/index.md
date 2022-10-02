---
layout: layouts/post.njk
title: Keresztrejtvény
templateClass: tmpl-post
eleventyNavigation:
  key: Keresztrejtvény
  order: 5
---

<script src="{{ '/assets/js/webcomponent-crossword.js' | url }}" async="async"></script>
<!-- <script src="{{ '/js/webcomponent-crossword.js' | url }}" async="async">DEVELOPMENT</script> -->

<webcomponent-crossword></webcomponent-crossword>

## Hogyan működik

- Billentyűzeten az irány nyilakkal (&larr;, &darr;, &uarr;, &rarr;) navigálhatsz a mezők között
- Minden mezőbe egy karakter kerülhet, kis és nagybetű ugyan annak számít
- A rejtvény mellett megjelenik a magyar szó lista, amit be kell írnod spanyolul a megfelelő helyre.
- Előfordulhatnak ékezetek illetve `ñ` betű is.
- A szavak melletti nyíl jelzi a szó irányát a keresztrejtvényben, rá kattintva odaugrik a megfelelő szó első betűjére
- A szavak utolsó betűjét beírva a vezérlés tovább ugrik a következőnek ítélt szó első betűjének helyére
- Betű beírása után egy következő mezőre ugrik, sajnos még nem tud gondolatot olvasni és nem mindig tudja mi számít következőnek
- A szó lista környékén egy mérő jelzi a helyesnek ítélt kitöltöttség állapotát
