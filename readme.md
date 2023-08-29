# Retro Assembly vendors

Scripts for build upstream files for [Retro Assembly](https://github.com/arianrhodsandlot/retro-assembly).

## Usage
Our work contains three steps:
1. Apply patches to some upstream repository (currently there is only RetroArch needs to be patched), for better usage inside browser.
2. Compile RetroArch cores with Emscripten following instructions indroduced here: [RetroArch Web Player](https://github.com/libretro/RetroArch/blob/master/pkg/emscripten/README.md).
3. Archive the wasm and js files.

By running `make` the above steps will automatically run sequentially.

Then all RetroArch cores will be built and archived in zip format. All artifacts will be put inside a `dist` directory.

In addition, RetroArch cores will be uploaded to [NPM](https://www.npmjs.com/package/retro-assembly-vendors) for further usage in Retro Assembly via [jsDelivr](https://www.jsdelivr.com), a public CDN service that can delegate access to NPM files.

## Credits
+ Upstream Emulators:
  + [beetle-lynx-libretro](https://github.com/libretro/beetle-lynx-libretro) Emulator for Atari Lynx.
  + [prosystem-libretro](https://github.com/libretro/prosystem-libretro) Emulator for Atari 7800.
  + [Genesis-Plus-GX](https://github.com/libretro/Genesis-Plus-GX) Emulator for Sega Genesis and some other consoles.
  + [stella2014-libretro](https://github.com/libretro/stella2014-libretro) Emulator for Atari 2600.
  + [snes9x](https://github.com/libretro/snes9x) Emulator for SNES.
  + [mgba](https://github.com/libretro/mgba) Emulator for GBA.
  + [nestopia](https://github.com/libretro/nestopia) Emulator for NES.
  + [beetle-vb-libretro](https://github.com/libretro/beetle-vb-libretro) Emulator for Virtual Boy.
  + [Gearboy](https://github.com/libretro/Gearboy) Emulator for Game Boy.
  + [libretro-fceumm](https://github.com/libretro/libretro-fceumm) Emulator for NES.
  + [a5200](https://github.com/libretro/a5200) Emulator for Atari 5200.
  + [beetle-wswan-libretro](https://github.com/libretro/beetle-wswan-libretro) Emulator for WonderSwan.
  + [beetle-ngp-libretro](https://github.com/libretro/beetle-ngp-libretro) Emulator for Neo Geo Pocket.
+ [RetroArch](https://github.com/libretro/retroarch) We mainly rely on the fantastic work done by them.
+ [Emscripten](https://github.com/emscripten-core/emscripten) Without which we could not run native codes inside browsers.
+ [webretro](https://github.com/BinBashBanana/webretro) Parts of our patches made on RetroArch is adapted from here.
+ [RetroArch patched by EmulatorJS maintainer](https://github.com/EmulatorJS/retroarch) Parts of our patches made on RetroArch is adapted from here.

## License
GPL-3.0
