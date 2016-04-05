---
title: "Some notes" 
description: "DB Bean Creator for Java and MySQL/PostgresQL"
og_image_url: "http://interhacker.files.wordpress.com/2011/12/dukewave1.png"
image: "http://interhacker.files.wordpress.com/2011/12/dukewave1.png"
image_content_type: "image/png"
layout: post
tags: [tech, java]
category: blog
---



Resources
http://en.wikipedia.org/wiki/List_of_HTTP_header_fields
http://www.mnot.net/cache_docs/
http://www.kaizou.org/2009/02/http-caching-explained/

Further references:
http://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html

Introduction
The HTTP/1.1 protocol includes two basic "caching" mechanisms to:

(expiry or "freshness" information) eliminate the need to send requests in many cases, using an "expiration" mechanism,
(validation) eliminate the need to send full responses in many other cases, using a "validation" mechanism.
Also note that our websites use a reverse proxy cache (CDNetworks) for certain content.

Headers used in caching
"Expiry"-type headers
"Expires" (response): Gives the date/time after which the response is considered stale
supported by practically every cache
absolute time, last access time, or last modification time
Limitation: GMT (not local time) – web server and cache must have synchronised clocks
must be managed
"Cache-Control" (response) with max-age directive: Tells all caching mechanisms from server to client whether they may cache this object. Typically "max-age=s, must-revalidate"
Directives:
max-age: where s is the number of seconds.
must-revalidate: if the response is stale, all caches MUST first revalidate it with the origin server
...and others (e.g. no-cache, no-store, etc)
HTTPS: By default, most browsers do not cache documents retrieved through HTTPS for security reasons. However, the server can use the "public" directive, and can thus be cached.
Note:

The Cache-control header always takes precedence over the Expires header.
If "Cache-Control" is "no-cache" or "must-revalidate", then "Expires" will be ignored.
"Validation"-type headers
Validators are very important; if one isn't present, and there isn't any freshness information (Expires or Cache-Control) available, caches will not store a representation at all.

Most modern Web servers will generate both ETag and Last-Modified headers to use as validators for static content (i.e., files) automatically; you won't have to do anything.

To verify if a stale cache entry is still valid, the client simply inserts specific headers in the request it sends to the origin server, passing back a specific tag it has received in the initial request.

"Last-Modified" (response): The last modified date for the requested object, in RFC 2822 format
validated via request headers "If-Unmodified-Since" and "If-Modified-Since", i.e. when a (browser/proxy/gateway?) cache has an representation stored that includes a "Last-Modified" header, it can use it to ask the (cache/origin?) server if the representation has changed since the last time it was seen, with an "If-Modified-Since" request.
almost all caches use "Last-Modified" times in determining if an representation is fresh
"ETag" (response): An identifier for a specific version of a resource, often a message digest
validated via request headers "If-None-Match" and "If-Match", i.e. because the server controls how the ETag is generated, caches can be surer that if the ETag matches when they make a "If-None-Match" request, the representation really is the same.
becoming very prevalent
Expiry VS Validation-type headers
The most cacheable representation is one with a long freshness time set. Validation does help reduce the time that it takes to see a representation, but the cache still has to contact the origin server to see if it's fresh.

Tips
http://www.mnot.net/cache_docs/#TIPS
http://www.mnot.net/cache_docs/#FAQ

Excerpts:

pages with a well-known update frequency can specify an appropriate max-age or expiration time.
store images and pages that don't change often by using a Cache-Control: max-age header with a large value (logo, 404 page, etc)
