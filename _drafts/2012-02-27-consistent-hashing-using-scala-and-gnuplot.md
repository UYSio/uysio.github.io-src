---
layout: post
title: "Consistent hashing with Scala"
description: "Consistent hashing using Scala and gnuplot"
date:   2012-02-27 00:00:00
tags: [tech, scala]
---

I recently got into [Riak](http://basho.com/products/riak-overview/), and subsequently [Consistent Hashing](http://en.wikipedia.org/wiki/Consistent_hashing), and found the referenced [Java implementation](http://www.lexemetech.com/2007/11/consistent-hashing.html) quite a delightful and informative read.

As any hacker would, I thought I’d implement it in my current favourite language: Scala. Half-way through I realised that Scala’s TreeMap is as slow as a geriatric slug on a salted snowed-in street. So, I did the `import java.util.{TreeMap => JTreeMap}` thing and got cracking:


The gist can be found here: [https://gist.github.com/1927001](https://gist.github.com/1927001)

# How many virtual nodes?

Systems using consistent hashing needs the “virtual nodes” parameter tuned so as to find a sweet spot where you get good mixing of cached objects amongst nodes (i.e. all nodes store a somewhat equal amount of stuff).

The gist above, when run, will generate a file called “dat” in the current directory, which can be fed into [gnuplot](http://www.gnuplot.info/) to show the standard deviation (as a percentage of the mean) for certain sizes of vnode.

As per the lexemetech.com article, a value not higher than 5% or 10% is preferable, and for 10 nodes, this amounts to about 100 or 200 vnodes. Let’s verify this.

# gnuplot

Using a terminal, run gnuplot in the same location as “dat”, and you’ll see this prompt: `gnuplot>`

Now, copy/paste this entire bit of code into the terminal:

{% gist 1927001 gnuplot %}

Here’s the plot:

<img src="http://funkshional.files.wordpress.com/2012/02/plot1.png" alt="The plot">

As you can see, for a large amount of vnodes, the percentage tends to 1%.

You can see this more easily by inputting this into the gnuplot prompt:

{% gist 1927001 gnuplot-amend %}

According to my plot, I start to get a low SD around 50 vnodes (5 times my number of nodes), but then this could just be because my hashing function mixes better than the one used by lexemetech.
