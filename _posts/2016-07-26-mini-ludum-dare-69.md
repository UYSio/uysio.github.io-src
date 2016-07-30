---
layout: post
title: "Mini Ludum Dare 69"
date:   2016-07-26 22:22:26
tags: [games,threejs,webgl]
category: blog
---

I started hacking on my [mini-LD 69 entry](/projects/ld69/) about 2 weeks ago.

> If the game doesn't seem to load (no 3D objects) or devtools shows a JS error, just refresh the page - apparently my RequireJS fu leaves something to be desired.

Why? I love games, and wanted to do something other than the Finance Gubbins I'm currently building. *(hush hush - I'll link to it later once I get permission)*

I spent a couple of hours a day for the past 2 weeks on it. Being a dad/husband (and on a full-time contract) prevented me from blasting this out in 48/72 hours to feel what a proper LD would be like.

# Attribution

The game background image is [Night Sky Milky Way Galaxy Astrophotography](https://commons.wikimedia.org/wiki/File:Night-sky-milky-way-galaxy-astrophotography_-_West_Virginia_-_ForestWander.jpg) from the Wikimedia Commons.

The angry alien throwing the middle tentacle is my own doing. I drew it in 2013, after seeing [Matthias Adolfsson's](http://mattiasadolfsson.com/) work. (I'm a big fan &mdash; I even went as far as purchasing a Namiki Falcon, because that's what he uses.)

# An opportunity to learn

I wanted an opportunity to learn [three.js](http://threejs.org/). (It's bloody marvellous!) The aim was to boost my D3.js skill-set with something similar-yet-different, and hopefully now I'm a step closer.

I forgot I also wanted to use [Elm](http://elm-lang.org/), so perhaps I'll brace mini-LD 70 with my [pattern matching](https://en.wikipedia.org/wiki/Category:Pattern_matching_programming_languages) skills.

Also, I should have definitely spent a bit more time studying Euler angles, Matrix ops, &c up-front instead of tweaking/reloading as often as I did.

# The design

First of all, let me honestly claim this wasn't inspired by Tetris. I just thought "how could I convey colonisation of a territory in a quick way" and cubes and stencils was the answer.

I try to procedurally generate as many things as possible from an initial configuration.

The game splash page is a bit all over the place right now, but it's playful and clear enough for my liking.

## Stencils

Talking about stencils, aka "colonies" &mdash; the constraint here is that stencils come in pairs. E.g. if you see a stencil with half the pixels missing, you can rely on its analogue to appear randomly later in turn.

I think this is information the player can rely on. It was suggested on the LD forums that I make more than 2 stencils for a face, but I'm sticking to this constraint. Taking Tetris as an example, you can always rely on the Tetriminos looking a certain way.

There are [8 types of stencil](https://github.com/opyate/minild69/blob/99abe3d29aaf77661d096c2304eb09bdc7c3e0da/app/js/logic.js#L10-L40): all, half, quarter, diagonal, checkered, center pixel, one pixel in the corner-ish, and random.

Random is the challenge. Everything else is easy, but gets trickier when the speed cranks up. High speed + random is the killer, and perhaps the difficulty can be tweaked for this combo. But, I guess the player has to be ejected at some point!

# The missing bits

Tests! But this is a throwaway thingy, so the Test Police can go fiddle one.

Audio! I'm sure I'll add a few procedurally-generated SFX if I decide to tweak it all a bit more, but otherwise the time constraints kicked in.

Playtesting! The difficulty could be scaled a bit better. Perhaps fluctuating in a way it makes the "random" colonies a bit easier. Otherwise, the difficulty scales up linearly.

# Preview

If the [link to the game](/projects/ld69/) doesn't work, feast your eyes:

![Splash](/assets/{{page.id}}/splash.png)

![Game](/assets/{{page.id}}/game.png)

If the game does work, see if you can find the Easter Egg.
