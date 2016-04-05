---
layout: post
title:  "Can you embed a secure IFRAME inside a secure container site?"
date:   2015-09-15 19:43:07
tags: [security, web]
---

In a [previous essay]({% post_url 2015-09-10-security-considerations-of-using-a-secure-iframe-on-an-insecure-page %}) I discussed the security implications of hosting an IFRAME on an insecure container page. The follow-up question is whether it's actually possible to host a secure IFRAME inside a secure container page, and if all browsers will allow this.

My gut feeling said that this should be possible, because the IFRAME has its own [browsing context](http://www.w3.org/TR/html/browsers.html#nested-browsing-contexts). Browser support is a different question though, so I conducted a [quick experiment](https://github.com/opyate/securesecure). 
