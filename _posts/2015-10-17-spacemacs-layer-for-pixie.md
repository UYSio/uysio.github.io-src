---
layout: post
title: "A Spacemacs layer for Pixie"
date:   2015-10-17 15:35:34
tags: [pixie, spacemacs, emacs]
---

A major mode for [Pixie](https://github.com/pixie-lang/pixie) already [exists](https://github.com/johnwalker/pixie-mode), but I would like to use it in evil mode from [Spacemacs](https://github.com/syl20bnr/spacemacs). Hence, a [custom layer](https://github.com/UYSio/pixie-spacemacs-layer).

I repeat the steps I took here in a mini tutorial format.

# Create a custom layer for Spacemacs

Start with creating the layer from within Spacemacs:


{% highlight console %}
<SPC> : configuration-layer/create-layer <RET>
{% endhighlight %}

Press ```<RET>``` again to create the layer in the default directory ```$HOME/.emacs.d/private```.

Choose a layer name, e.g. ```pixie```.

Spacemacs then throws you into the [packages.el](https://github.com/syl20bnr/spacemacs/blob/696f2d461a81b2c0640ae7da113edf1374050ecd/core/templates/packages.template) for your new layer.

Now is a good time to study [layers](https://github.com/syl20bnr/spacemacs/blob/master/doc/LAYERS.org), but the gist is this:

* hook in the modes you're layering in ```(setq <your-layer>-packages ...)```
* set the key combinations for your [Evil Leader](https://github.com/syl20bnr/spacemacs/blob/master/doc/DOCUMENTATION.org#evil-leader) in the ```(defun <your-layer>/init-<your-layer> () ...)``` form
* optionally define custom commands here and bind to them

PS The Evil Leader in Spacemacs is ```SPC``` (YES! that's where Spacemacs gets its name from).

# Result

Here's what I came up with for Pixie. At the moment, it offers bindings to start the REPL, and eval s-expressions (and an option to jump to the REPL after evaluation).

{% highlight elisp %}
;;; packages.el --- pixie Layer packages File for Spacemacs
;;
;; Copyright (c) 2012-2014 Sylvain Benner
;; Copyright (c) 2014-2015 Sylvain Benner & Contributors
;;
;; Author: Sylvain Benner <sylvain.benner@gmail.com>
;; URL: https://github.com/syl20bnr/spacemacs
;;
;; This file is not part of GNU Emacs.
;;
;;; License: GPLv3

;; List of all packages to install and/or initialize. Built-in packages
;; which require an initialization must be listed explicitly in the list.
(setq pixie-packages
    '(
    ;; package names go here
    inf-clojure
    pixie-mode
    ))

;; List of packages to exclude.
(setq pixie-excluded-packages '())

(defun pixie/post-init-inf-clojure ()
(add-hook 'pixie-mode-hook 'inf-clojure-minor-mode))

(defun pixie/init-pixie-mode ()
  (use-package pixie-mode
    :defer t
    :config
    (progn
      (defun spacemacs/pixie-eval-and-switch-to-repl ()
        "Call `inf-clojure-eval-last-sexp' and switch to REPL buffer in `insert state'"
        (interactive)
        (inf-clojure-eval-last-sexp)
        (inf-clojure-switch-to-repl t)
        (evil-insert-state))

      (evil-leader/set-key-for-mode 'pixie-mode
        ;; REPL
        "msi" 'inf-clojure-switch-to-repl
        "msb" 'inf-clojure-eval-last-sexp
        "msB" 'spacemacs/pixie-eval-and-switch-to-repl))))

;; For each package, define a function pixie/init-<package-name>
;;
;; (defun pixie/init-my-package ()
;;   "Initialize my package"
;;   )
;;
;; Often the body of an initialize function uses `use-package'
;; For more info on `use-package', see readme:
;; https://github.com/jwiegley/use-package
{% endhighlight %}

It's by no means complete, and I plan to implement basic functionality involving navigation, documentation, tests (Pixie test frameworks permitting), and evaluation of more forms.
