---
layout: post
title:  "Mandelbrot fractal with Pixie on Ubuntu"
date:   2015-10-11 22:59:15
tags: [pixie]
---

My friend [Adam](http://www.arknoon.com/) introduced me to [Pixie](https://github.com/pixie-lang/pixie) back in May, and I made a mental note to play with it a little bit. It was [Tim's StrangeLoop talk](https://www.youtube.com/watch?v=1AjhFZVfB9c), however, which inspired me to push all my other little timewasty things to one side to check this out.

The Mandelbrot example in the talk was an especially tasty bit of script to play with, and I was about to type it all out from the video when I noticed that [Stuart Hinson had beaten me to the punch](https://github.com/pixie-lang/pixie/commit/9990b235a186454e36171f84c78a0ebfb18ee5d1).

    ./pixie-vm examples/mandelbrot.pxi

A first run failed with this error:

{% highlight console %}
/tmp/tmp.cpp: In function ‘int main(int, char**)’:
/tmp/tmp.cpp:19:50: error: no matching function for call to ‘DumpValue(<anonymous enum>)’
  PixieChecker::DumpValue(SDL_PIXELFORMAT_RGBA8888); 
                                                  ^
/tmp/tmp.cpp:19:50: note: candidate is:
In file included from /tmp/tmp.cpp:2:0:
/home/opyate/Code/pixie/pixie/PixieChecker.hpp:432:6: note: template<class T> void PixieChecker::DumpValue(T)
void DumpValue(T t)
      ^
/home/opyate/Code/pixie/pixie/PixieChecker.hpp:432:6: note:   template argument deduction/substitution failed:
/tmp/tmp.cpp: In substitution of ‘template<class T> void PixieChecker::DumpValue(T) [with T = <anonymous enum>]’:
/tmp/tmp.cpp:19:50:   required from here
/tmp/tmp.cpp:19:50: error: ‘<anonymous enum>’ is/uses anonymous type
  PixieChecker::DumpValue(SDL_PIXELFORMAT_RGBA8888); 
                                                  ^
/tmp/tmp.cpp:19:50: error:   trying to instantiate ‘template<class T> void PixieChecker::DumpValue(T)’
Error:  in internal function load-file

in internal function load-reader

Compiling: (with-config {:library SDL2, :cxx-flags [`sdl2-config --cflags`], :includes [SDL.h]} (defconst SDL_INIT_EVERYTHING) (defcfn SDL_Init) (defconst SDL_INIT_VIDEO) (defconst SDL_WINDOWPOS_UNDEFINED) (defcfn SDL_CreateWindow) (defcfn SDL_CreateRenderer) (defcfn SDL_CreateTexture) (defconst SDL_PIXELFORMAT_RGBA8888) (defconst SDL_TEXTUREACCESS_STREAMING) (defcfn SDL_UpdateTexture) (defcfn SDL_RenderClear) (defcfn SDL_RenderCopy) (defconst SDL_WINDOW_SHOWN) (defcfn SDL_RenderPresent) (defcfn SDL_LockSurface))
in examples/mandelbrot.pxi at 10:1
(with-config {:library "SDL2"
^
in pixie function with-config

in /home/opyate/Code/pixie/pixie/ffi-infer.pxi at 212:10
        ~(run-infer *config* @*bodies*))))
        ^
in pixie function run-infer

in /home/opyate/Code/pixie/pixie/ffi-infer.pxi at 196:16
        result (read-string (io/run-command cmd-str))
              ^
in internal function read-string

RuntimeException: :pixie.stdlib/EOFWhileReadingException Unexpected EOF while reading
</pre>
{% endhighlight %}

The error

{% highlight console %}
/tmp/tmp.cpp:19:50: error: no matching function for call to ‘DumpValue(<anonymous enum>)’
  PixieChecker::DumpValue(SDL_PIXELFORMAT_RGBA8888); 
{% endhighlight %}

can be worked around by ensuring the [FFI-infer](https://github.com/pixie-lang/pixie/blob/master/pixie/ffi-infer.pxi) runs C++ with ```-std=c++0x```, because this more recent spec lifts the limitation of unnamed types being used as template arguments.

Instead, I just installed [Clang](http://clang.llvm.org/) and set up my *alternatives* to point to it:

{% highlight console %}
sudo apt-get install clang
sudo update-alternatives --set c++ /usr/bin/clang++
{% endhighlight %}

Et voilà!

![Mandelbrot with Pixie](/assets/mandelbrot-pixie.png)
