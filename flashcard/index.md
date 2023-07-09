---
layout: layouts/post.njk
title: Szókártya
templateClass: tmpl-post
eleventyNavigation:
  key: Szókártya
  order: 6
---

<script src="{{ '/assets/js/webcomponent-flashcard.js' | url }}"></script>
<!-- <script src="{{ '/js/webcomponent-flashcard.js' | url }}" async="async">DEVELOPMENT</script> -->

<!-- upgrade: npm install --save webcomponent-flashcard@X.X.X -->

<webcomponent-flashcard url="{{ '/public/spanish-hungarian.json' | url }}"></webcomponent-flashcard>
