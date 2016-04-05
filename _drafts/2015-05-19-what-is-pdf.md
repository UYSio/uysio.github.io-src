---
layout: post
title:  "What is PDF?"
date:   2015-05-19 19:07:16
categories: pdf
---

# What is PDF?

PDF, or the Portable Document Format, is a file format that cares first and foremost about rendering a document consistently on any devices that supports it. A PDF comprises 3 technical parts: a subset of [PostScript](http://partners.adobe.com/public/developer/en/ps/PLRM.pdf) for generating the layout and graphics, a font-embedding system, and an (possibly compressed) object tree to bundle these and associated content into a single file.

This object tree is known as COS, or "Carousel" Object Structure, and consists of these 8 types of object: booleans, numbers, strings, names, arrays (ordered), dictionaries (name-to-object pairs), streams, and null. Objects can be embedded within others (**direct**) or can be looked up in the **xref table** using a byte offset (**indirect**).

Text in a PDF is represented by **text elements** in page content streams. An element specifies the **characters** that need to be drawn at certain positions.  (TODO find out if a word is linearly represented, e.g. "hi" could be "ih" in the content stream, but with indexes (or instructions) telling it to be "hi".

Another post: http://stackoverflow.com/questions/30345709/extract-text-and-images-from-a-pdf
