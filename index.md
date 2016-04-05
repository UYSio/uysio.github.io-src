---
layout: page
---


<ul class="post-list">
    {% for post in site.posts %}
    <li>
        <span class="post-meta">{{ post.date | date: "%Y-%m-%d" }}</span>

        <h2>
            <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
        </h2>

        {% if post.tags.size > 0 %}
          {% for tag in post.tags %}
            <a class="post-tag {{ tag | slugize }}" href="{{ site.url }}/tag/{{ tag }}">{{ tag }}</a>
          {% endfor %}
        {% endif %}
    </li>
    {% endfor %}
</ul>

<p class="rss-subscribe">subscribe <a href="{{ " /feed.xml " | prepend: site.baseurl }}">via RSS</a></p>
