---
emoji: '🌃'
title: 'hyperbliss.tech: A Personal Space on the Web'
date: '2024-09-25'
tags: ['Next.js', 'TypeScript', 'React', 'Panda CSS', 'Canvas', 'Creative Coding']
description: 'My portfolio and writing home, combining a reactive particle world, a browsable terminal, and Markdown-driven stories in a custom Next.js site.'
github: 'https://github.com/hyperb1iss/hyperbliss.tech'
---

This site is where my software, writing, and visual work meet. Project pages make room for the ideas behind the repositories, the blog follows the technical details, and a few interactive corners invite you to stay and play. Purple light and moving geometry give the space its own atmosphere.

The implementation combines Next.js and React with Panda CSS and Framer Motion. Markdown files hold the writing, keeping articles and project stories close to the code while giving them a consistent reading experience.

## A world drawn in particles

CyberScape gives the site its moving backdrop. Geometric particles inhabit a simulated three-dimensional space, projected onto a Canvas 2D surface. Pointer interaction influences their movement, while connections and glitch effects add texture to the scene.

Under the animation, an octree organizes nearby objects for collision work. Frustum culling identifies what is in view, and performance monitoring informs the simulation's behavior. The rendering work brings graphics techniques into an ordinary browser canvas, with the controls needed to manage a scene that keeps moving while someone reads.

## More than one way to explore

The site also includes a terminal interface for browsing its content. A generated filesystem maps writing and projects into a form you can navigate with commands, giving visitors who live in a shell a familiar way into the same material.

The conventional pages remain the center of the experience, with a shared content system supplying project listings, articles, and the terminal's view of the site. Keeping those routes connected means the playful interface can explore the actual portfolio instead of presenting a separate demo world.

The [hyperbliss.tech repository](https://github.com/hyperb1iss/hyperbliss.tech) contains the site, content pipeline, and CyberScape implementation.
