---
layout: layouts/home.njk
title: Szavak
eleventyNavigation:
  key: Szavak
  order: 4
---

<script type="module" src="{{ '/assets/js/webcomponent-wordlist.js' | url }}" async="async"></script>

<webcomponent-wordlist href="{{ '/public/spanish-hungarian.json' | url }}">
</webcomponent-wordlist>