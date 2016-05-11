#jekyll serve -w -P 3030
docker run --rm --label=jekyll --volume=$(pwd):/srv/jekyll -it -p 127.0.0.1:80:80 jekyll/jekyll:2.5.3
echo
echo
echo "REMEMBER to copy _site/* to the compiled site repo!"
