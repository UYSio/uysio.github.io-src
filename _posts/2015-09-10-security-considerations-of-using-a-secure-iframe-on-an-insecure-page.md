---
layout: post
title:  "Security considerations of using a secure IFRAME on an insecure page"
date:   2015-09-10 13:05:45
tags: [security, web]
---

In this essay I consider the information security implications around using a secure IFRAME (which, for example, hosts a payment or checkout page) on an insecure container page.

Some definitions:

* a "secure IFRAME" is one where its ```src``` attribute points to a domain over HTTPS, and any forms within the IFRAME submits to an HTTPS domain
* an "insecure container page" is a "container" because it hosts the IFRAME (the HTML code for the page will have an ```<IFRAME>``` tag somewhere within it), and "insecure" because it was loaded over HTTP, not HTTPS.

# Opinions in the wild

**TL;DR Regardless of how secure the IFRAME is, the container site can be compromised and render said security moot.**

Start typing "secure iframe" in Google, and note the suggestions:

* [secure iframe in non secure page](https://www.google.co.uk/search?q=secure+iframe+in+non+secure+page)
* [secure iframe on unsecure page](https://www.google.co.uk/search?q=secure%20iframe%20on%20unsecure%20page)

The search results point to related questions asked on the [Information Security Stack Exchange Q&A site](http://security.stackexchange.com/), and a few blog posts by security experts have been written on the topic.

A non-exhaustive list of examples:

* [http://security.stackexchange.com/questions/38317/specific-risks-of-embedding-an-https-iframe-in-an-http-page](http://security.stackexchange.com/questions/38317/specific-risks-of-embedding-an-https-iframe-in-an-http-page) 
* [http://security.stackexchange.com/questions/894/are-there-security-issues-with-embedding-an-https-iframe-on-an-http-page](http://security.stackexchange.com/questions/894/are-there-security-issues-with-embedding-an-https-iframe-on-an-http-page)
* [http://www.troyhunt.com/2014/11/does-insecure-website-compromise.html](http://www.troyhunt.com/2014/11/does-insecure-website-compromise.html)
* [http://stackoverflow.com/questions/3144986/http-and-https-iframe](http://stackoverflow.com/questions/3144986/http-and-https-iframe)

# MITM primer

MITM attack is a "man in the middle" attack.

When you sit in a coffeeshop, log on to their free Wifi, and frequent your favourite online shopping fix, your requests to see products and pay for products go through many "hops" before it actually reaches the destination: your browser connects to the Wifi access point, which connects to the coffee shop's ISP via one hop or many, which connects to a common exchange somewhere in Britain via one hops or many, which connects to an exchange somewhere in another country via one hops or many (and almost definitely via a long undersea cable), which connects to the shopping site's web server in a datacentre somewhere (and all together now!) via one hops or many.

Any of these "hops" can be compromised, but the typical scenario is for the attacker to host their own version of "free Wifi" right from their laptop with a legitimate-sounding name like "FreeHub". 

At this point the attacker's laptop is just one more "hop" you're totally oblivious to when you connect to "FreeHub", letting your surfing activity through uninterrupted.

However, since the attacker now have access to the data stream between you and the outside world, she can now see the data. The crucial differentiator here is HTTP VS HTTPS: if you access a site directly via HTTPS, the attacker will see unintelligeble garbage. This is A Good Thing. If you access a site via HTTP, the attacker sees everything in the clear. Even if the website subsequently redirects to HTTPS, there's an opportunity here for the attacker to spoof a TLS certificate.

Since the attacker now has a clear stream of data to intercept, the attacker can also change what your web browser sees (not you, necessarily).
 
# Example of a DIY MITM attack

 I'll explore one example of exploiting an IFRAME (secure or not!) from an insecure container page. I'll take some shortcuts in the sense that I won't set up a compromised Wifi access point, or run software which injects malicious code into intercepted web traffic.

Clone [this gist](https://gist.github.com/opyate/5dd65f5529d9508cf78e), or follow these steps:

Create this simple index file:
{% highlight html %}
<p>IFRAME below</p>
<iframe id="frame1" src="http://localhost:8000/i-dont-matter.html"></iframe>
{% endhighlight %}

Create this simple form which will be loaded by the IFRAME:
{% highlight html %}
<form action="https://httpbin.org/post" method="POST">
  <input name="secret" placeholder="Secret stuff here">
  <input type="submit">
</form>
{% endhighlight %}

Host the code locally with Python:

    python -m SimpleHTTPServer

Go to [http://localhost:8000](http://localhost:8000) in your browser, and submit the form. [HTTPBin](http://httpbin.org/) will echo back the payload.

Now, reload the page, but open your browser's dev tools, and paste the code from the hack into the JavaScript console:
{% highlight javascript %}
var contents = '<form action="https://httpbin.org/post" method="POST">';
contents += '<input name="secret" placeholder="Secret stuff here">';
contents += '<input type="submit" onclick="return hack()">';
contents += '<script type="text/javascript">';
contents += 'function hack() { alert("h4x0rz"); }';
contents += '</script>';
contents += '</form>';
document.getElementById('frame1').src = "data:text/html;charset=utf-8," + escape(contents);
{% endhighlight %}

This is the MITM attack. This is what the attacker could do with the "in-the-clear data stream" we discussed before. The attacker simply matched on a known token (like the form submit button) and injected custom code with which to do evil.

Submit the form, and see the side effect.

Note that the IFRAME's contents have been entirely modified. It was even made to look like the original content. The fact that the IFRAME's ```src``` attribute previously loaded a secure site DOES NOT MATTER.

Consider yourself alerted.

# What evil side effects are there?

OK, so the JavaScript ```alert``` you just saw is just for show, but consider this:

* the attacker sends the sensitive data you just submitted off to their own domain to be harvested à la [Tunisia](http://www.fastcompany.com/1715575/tunisian-government-allegedly-hacking-facebook-gmail-accounts-dissidents-and-journalists)
* the attacker changes the delivery address for the expensive item you just bought to the unused address down their street

# Who cares about my site?

Your insecure site might'nt accept sensitive input like payment details or sell valuable items, but your insecure site might be frequented by someone who does.

An attacker might know that a high profile (read: hack-worthy) individual called Bob Millionaire frequents your insecure pet discussion website. Let's imagine for a second your forum software requires a login. **Your insecure website has now become a target.**

The attacker will now trivially sniff for Bob Millionaire's password on your insecure website, which she can replay against other more lucrative websites, if we can [presume that Bob Millionaire re-uses his passwords](http://media.ofcom.org.uk/news/2013/uk-adults-taking-online-password-security-risks/).

Even if you're just the third party who owns the domain the IFRAME points to, you have to **strongly consider if you want to be associated with the bad press which comes with your client's website being exploited** and having the IFRAME which was destined for your content being on the receiving end.

# The solution

Can we get to a better place by mandating all container sites to enforce TLS? I think we can. But this will just be a better place, not the ultimate secure place.

There's a sliding scale, you see.

On the paranoid end you can presume every device and every network is compromised. No amount of TLS will help you. You can trust your own laptop as much as you do the web browser running on the old XP PC down the Internet cafe: you'll think twice about what you do online, and where you do it. (yes, a modified version of any web browser can show a green padlock for anything)

On the naive end you can presume that you live in a free country, with devices built in secured facilities by known brands, and that the websites you frequent are hosted in secure datacentres, managed by security veterans who can be trusted.

Choose your position on the scale, and accept the risk that's forthcoming.
