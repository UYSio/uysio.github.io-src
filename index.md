---
layout: page
---

Hi, I'm Juan, and {{ site.title }} is my web development consultancy.

I can help you start from scratch and harness existing APIs and infrastructure, paired with custom development. Or perhaps you have an existing  stack that needs some love.

I will work closely with your business to help you deliver the website or app that gives value to your end users. I do it all – consultation, development, provisioning, training, and support. And I can even help you build your team.

Some clients I've worked with...

![New Concepts Development](/assets/clients/newconcepts.png) ![Govern Digital Service](/assets/clients/gds.png) ![Condé Nast Commerce](/assets/clients/condenast.png)

# Blog

<ul class="post-list">
    {% for post in site.posts %}
    <li>
            <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>

        {% if post.tags.size > 0 %}
          {% for tag in post.tags %}
            <a class="post-tag {{ tag | slugize }}" href="{{ site.url }}/tag/{{ tag }}">{{ tag }}</a>
          {% endfor %}
        {% endif %}
    </li>
    {% endfor %}
</ul>

<p class="rss-subscribe">subscribe <a href="{{ " /feed.xml " | prepend: site.baseurl }}">via RSS</a></p>
