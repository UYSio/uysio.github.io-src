---
layout: page
---

Hi, I'm Juan, and {{ site.title }} is my web development consultancy.

I have experience with all aspects of delivering a web-based product, whether it be a static website, a full-blown ecommerce site, or a web API.

Read more about the work I've done for my [clients](clients).

## Recent posts

<ul class="post-list">
    {% for post in site.posts limit:5 %}
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
