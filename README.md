# Intro

[www.uys.io](http://www.uys.io).

Theme is *friendly* by [Pygments](https://pypi.python.org/pypi/Pygments)

    pip install pygments
    pygmentize -f html -S friendly -a .highlight > _sass/_syntax.scss

# Tags

Tags working with advice from:

* http://charliepark.org/tags-in-jekyll/
* http://charliepark.org/jekyll-with-plugins/

And then:

    jekyll build
    cp -R _site/* ../uysio.github.io
    pushd ../uysio.github.io
    git add . && git commit -m "UYSio/uysio.github.io-src updated"
    git push origin master
    popd

# TODO

GA tag:

```

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-KLHNH9EGQS"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-KLHNH9EGQS');
</script>

```
