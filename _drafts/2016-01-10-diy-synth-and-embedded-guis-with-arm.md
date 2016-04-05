---
layout: post
title: "DIY synth and embedded GUIs with ARM"
date:   2016-01-10 20:27:21
tags: [arm, synth]
---

# Intro

I did [this](http://workshop.thi.ng/#WS-LDN-4) by
[Karsten Schmidt](http://postspectacular.com/).

# Setup

The workshop mentions Eclipse, so presumably
[GNU ARM Eclipse tooling](http://gnuarmeclipse.github.io/install/) is required.

Sub-sections consulted:
- [toolchain](http://gnuarmeclipse.github.io/toolchain/install)
- [SEGGER J-link](http://gnuarmeclipse.github.io/debug/jlink/install) (skipped -
  not on Arch)
- [OpenOCD](http://gnuarmeclipse.github.io/openocd/install)
- [QEMU](http://gnuarmeclipse.github.io/qemu/install/)
- [GNU ARM plugins](http://gnuarmeclipse.github.io/plugins/install/)
-
  [workspace preferences](http://gnuarmeclipse.github.io/eclipse/workspace/preferences)
-(_why not?_)

Arch Linux makes this dead-easy:

{% highlight console %}
sudo pacman -S
  extra/eclipse-cpp \
  community/arm-none-eabi-binutils \
  community/arm-none-eabi-gcc \
  community/arm-none-eabi-gdb \
  community/arm-none-eabi-gdb \
  community/arm-none-eabi-newlib \
  community/openocd \
  extra/qemu \
  extra/qemu-arch-extra
{% endhighlight %}

# Paths

## ARM GCC

`sudo pacman -Ql arm-none-eabi-gcc|grep bin`:

    arm-none-eabi-gcc /usr/bin/arm-none-eabi-c++
    arm-none-eabi-gcc /usr/bin/arm-none-eabi-cpp
    arm-none-eabi-gcc /usr/bin/arm-none-eabi-g++
    arm-none-eabi-gcc /usr/bin/arm-none-eabi-gcc
    arm-none-eabi-gcc /usr/bin/arm-none-eabi-gcc-5.3.0
    arm-none-eabi-gcc /usr/bin/arm-none-eabi-gcc-ar
    arm-none-eabi-gcc /usr/bin/arm-none-eabi-gcc-nm
    arm-none-eabi-gcc /usr/bin/arm-none-eabi-gcc-ranlib
    arm-none-eabi-gcc /usr/bin/arm-none-eabi-gcov
    arm-none-eabi-gcc /usr/bin/arm-none-eabi-gcov-tool

`sudo pacman -Ql qemu|grep bin`:

    qemu /usr/bin/
    qemu /usr/bin/qemu-i386
    qemu /usr/bin/qemu-img
    qemu /usr/bin/qemu-io
    qemu /usr/bin/qemu-nbd
    qemu /usr/bin/qemu-system-i386
    qemu /usr/bin/qemu-system-x86_64
    qemu /usr/bin/qemu-x86_64
    qemu /usr/bin/virtfs-proxy-helper

`sudo pacman -Ql qemu-arch-extra|grep bin|grep arm`:

    qemu-arch-extra /usr/bin/qemu-arm
    qemu-arch-extra /usr/bin/qemu-armeb
    qemu-arch-extra /usr/bin/qemu-system-arm

# Set up new Eclipse project

Right click in project explorer -> New -> Project...
From the Wizards, drop down into `C/C++` -> `C Project` (click Next)
Give the project a name
In `Project Type`, drop down into `Executable` -> `STM32F7xx C/C++ Project`
Click `Next` 4 times.
On the `Cross GNU ARM Toolchain` wizard, specify `/usr/arm-none-eabi` for
`Toolchain path`.

After successfully building the `.bin` file, one can now flash the device.

# STLink

I tried this:

    pacman -S stlink

...but, it doesn't have the latest definitions:

    $ sudo st-util
    $ sudo st-util[sudo] password for opyate: 
    2016-01-23T12:05:39 INFO src/stlink-common.c: Loading device parameters....
    2016-01-23T12:05:39 WARN src/stlink-common.c: unknown chip id! 0x10016449

Ended up building st-link from source by modifying the existing PKGBUILD file:


    # $Id$
    # Maintainer: Anatol Pomozov <anatol.pomozov@gmail.com>

    pkgname=stlink
    pkgrel=1
    pkgver=1.1.0
    pkgdesc='Firmware programmer for STM32 STLINK v1/v2 protocol'
    arch=(i686 x86_64)
    url='https://github.com/texane/stlink'
    license=(BSD)
    depends=(libusb)
    #install=stlink.install
    #source=(https://github.com/texane/stlink)
    source=(git://github.com/texane/stlink)
    sha256sums=('SKIP')

    build() {
      cd "${srcdir}/${pkgname}"
      ./autogen.sh
      ./configure --prefix=/usr
      make
    }

    package() {
      cd "${srcdir}/${pkgname}"

      make DESTDIR="$pkgdir" install

      install -Dm644 stlink_v1.modprobe.conf  "$pkgdir"/usr/lib/modprobe.d/stlink_v1.modprobe.conf
      install -Dm644 49-stlinkv1.rules        "$pkgdir"/usr/lib/udev/rules.d/49-stlinkv1.rules
      install -Dm644 49-stlinkv2.rules        "$pkgdir"/usr/lib/udev/rules.d/49-stlinkv2.rules
      install -Dm644 LICENSE                  "$pkgdir"/usr/share/licenses/$pkgname/LICENSE
      install -Dm644 README                   "$pkgdir"/usr/share/doc/$pkgname/README
    }
