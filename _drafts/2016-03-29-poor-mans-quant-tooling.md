---
layout: post
title: "Poor man's quant tooling"
date:   2016-03-29 13:23:12
tags: [libreoffice, python, arch]
---

I'd like to combine [LibreOffice Calc](https://www.libreoffice.org/discover/calc/) and Python.

Start with installing LibreOffice and the SDK:

    sudo pacman -S libreoffice-fresh libreoffice-fresh-sdk

LibreOffice API/SDK docs are quite vast, and the subset of it we're focusing on is running a bit of code in the context of an existing document, hence macros.

The documentation on the web sprawls over many years and the previous LibreOffice incantations (StarOffice and OpenOffice), so finding the relevant stuff is tricky.

I found examples relevant to my installation with:

```
λ pacman -Ql libreoffice-fresh | grep Scripts.\*\.py$               ⏎
libreoffice-fresh /usr/lib/libreoffice/share/Scripts/python/Capitalise.py
libreoffice-fresh /usr/lib/libreoffice/share/Scripts/python/HelloWorld.py
libreoffice-fresh /usr/lib/libreoffice/share/Scripts/python/LibreLogo/LibreLogo.py
libreoffice-fresh /usr/lib/libreoffice/share/Scripts/python/pythonSamples/TableSample.py
```

This alerted me to `XSCRIPTCONTEXT` which has [C++ documentation here](http://api.libreoffice.org/docs/idl/ref/interfacecom_1_1sun_1_1star_1_1script_1_1provider_1_1XScriptContext.html).

From here on navigating the inheritance diagrams to get the functionality you're looking for is a whole bag of fun.

Lo and behold, Python is [already supported](http://api.libreoffice.org/examples/examples.html#python_examples).

Launch `localc`.

Download a [volatile stock](http://www.marketvolume.com/stocks/mostvolatile.asp) from the [Chicago Board of Options Exchange](http://www.cboe.com/delayedquote/QuoteTableDownload.aspx).

Open the quote data in Calc, but skip the headers (i.e. we're only interested in the 4th row onwards).

The [Arch Linux LibreOffice page](https://wiki.archlinux.org/index.php/LibreOffice) mentions that macros must be put in `~/.config/libreoffice/4/user/Scripts/`.
`Tools -> Macros -> Organise Macros -> Python...`



[Smile graph](https://en.wikipedia.org/wiki/Volatility_smile)

```
mkdir -p ~/.config/libreoffice/4/user/Scripts/python
```
