---
category: 'web'
title: 'hyperbliss.tech: The Site You Are Reading'
date: '2024-09-25'
tags: ['Next.js', 'TypeScript', 'React', 'Panda CSS', 'Canvas', 'Creative Coding']
description: 'The source for this site: product pages, essays, and lab experiments from Markdown, a reactive particle header, and a terminal console you can browse it all from.'
github: 'https://github.com/hyperb1iss/hyperbliss.tech'
---

This site is the home of Hyperbliss Technologies, and its source is open like everything else we make. Product pages make room for the ideas behind the repositories, the essays follow the technical details, and a few interactive corners invite you to stay and play.

The implementation combines Next.js and React with Panda CSS and Framer Motion. Markdown files hold the writing, keeping articles and project stories close to the code while giving them a consistent reading experience.

## A world drawn in particles

CyberScape gives the header its moving backdrop. Geometric particles inhabit a simulated three-dimensional space, projected onto a Canvas 2D surface. Pointer interaction influences their movement, while connections and glitch effects add texture to the scene.

Under the animation, an octree organizes nearby objects for collision work. Frustum culling identifies what is in view, and performance monitoring informs the simulation's behavior. The rendering work brings graphics techniques into an ordinary browser canvas, with the controls needed to manage a scene that keeps moving while someone reads.

## More than one way to explore

The site also includes a terminal interface for browsing its content. A generated filesystem maps writing and projects into a form you can navigate with commands, giving visitors who live in a shell a familiar way into the same material.

The conventional pages remain the center of the experience, with a shared content system supplying project listings, articles, and the terminal's view of the site. Keeping those routes connected means the console explores the real site instead of presenting a separate demo world.

The [hyperbliss.tech repository](https://github.com/hyperb1iss/hyperbliss.tech) contains the site, content pipeline, and CyberScape implementation.
