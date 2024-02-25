# Retro Assembly vendors

Scripts for build upstream files for [Retro Assembly](https://github.com/arianrhodsandlot/retro-assembly).

## Usage
Our work contains three steps:
1. Apply patches to some upstream repository (currently there is only RetroArch need to be patched), for better usage inside browser or bug fixes.
2. Compile RetroArch cores with Emscripten following instructions indroduced here: [RetroArch Web Player](https://github.com/libretro/RetroArch/blob/master/pkg/emscripten/README.md).
3. Archive the wasm and js files.

By running `make` the above steps will automatically run sequentially.

Then all RetroArch cores will be built and archived in zip format. All artifacts will be put inside a `dist` directory.

In addition, RetroArch cores will be uploaded to [NPM](https://www.npmjs.com/package/retro-assembly-vendors) for further usage in Retro Assembly via [jsDelivr](https://www.jsdelivr.com), a public CDN service that can delegate access to NPM files.

## Debugging cores
1. Start a static HTTP server at the root of the project. Maybe `python3 -m http.server` is a convenient choice.
2. Visit http://localhost:8000/demo/index.html
3. Select a core and upload a ROM, then the selected RetroArch core will run.

## Credits
+ Upstream Emulators:
  + [a5200](https://github.com/libretro/a5200) Emulator for Atari 5200.
  + [FBNeo](https://github.com/libretro/FBNeo) Emulator for arcades.
  + [prosystem-libretro](https://github.com/libretro/prosystem-libretro) Emulator for Atari 7800.
  + [stella2014-libretro](https://github.com/libretro/stella2014-libretro) Emulator for Atari 2600.
+ [RetroArch](https://github.com/libretro/retroarch) We mainly rely on the fantastic work done by them.
+ [Emscripten](https://github.com/emscripten-core/emscripten) Without which we could not run native codes inside browsers.
+ [webretro](https://github.com/BinBashBanana/webretro) Parts of our patches made on RetroArch is adapted from here.
+ [RetroArch patched by EmulatorJS maintainer](https://github.com/EmulatorJS/retroarch) Parts of our patches made on RetroArch is adapted from here.

## License
GPL-3.0
