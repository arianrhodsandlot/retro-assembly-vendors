const core = new URLSearchParams(location.search).get('core')
const raUserdataDir = '/home/web_user/retroarch/userdata/'
const raConfigPath = `${raUserdataDir}retroarch.cfg`
const canvas = document.querySelector('#canvas')

function delay(time = 1) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

function loadScript(src) {
  const script = document.createElement('script')
  script.setAttribute('src', src)
  return new Promise((resolve, reject) => {
    function onScriptLoaded() {
      script.remove()
      resolve()
    }
    function onScriptError(event) {
      reject(event)
    }
    script.addEventListener('load', onScriptLoaded)
    script.addEventListener('error', onScriptError)
    document.body.append(script)
  })
}

const messageQueue = []
function getDefaultModule() {
  return {
    noInitialRun: true,
    canvas,

    preRun: [
      () => {
        const { FS } = window
        FS.init(() => {
          // Return ASCII code of character, or null if no input
          while (messageQueue.length > 0) {
            const msg = messageQueue[0][0]
            const index = messageQueue[0][1]
            if (index >= msg.length) {
              messageQueue.shift()
            } else {
              messageQueue[0][1] = index + 1
              // assumption: msg is a uint8array
              return msg[index]
            }
          }
          return null
        })
      },
    ],
  }
}

async function loadEmscripten(core) {
  const coreFileNames = [`${core}_libretro.js`, `${core}_libretro_emscripten.bc_libretro.js`]
  const sources = coreFileNames.map((n) => `../dist/cores/${n}`)
  const defaultModule = getDefaultModule()
  Object.assign(window, { Module: defaultModule })
  let loaded = false
  for (const source of sources) {
    if (!loaded) {
      try {
        await loadScript(source)
        loaded = true
      } catch {}
    }
  }
  const { Module } = window
  while (!Module.asm) {
    await delay(10)
  }
}

async function createEmscriptenFS() {
  const { FS, PATH, ERRNO_CODES } = window

  const {
    default: { EmscriptenFS, FileSystem, initialize },
  } = await import('https://cdn.jsdelivr.net/npm/browserfs@1.4.3/+esm')
  const inMemoryFS = new FileSystem.InMemory()
  const mountableFS = new FileSystem.MountableFileSystem()
  inMemoryFS.empty()
  try {
    mountableFS.umount(raUserdataDir)
  } catch {}
  mountableFS.mount(raUserdataDir, inMemoryFS)

  initialize(mountableFS)

  return new EmscriptenFS(FS, PATH, ERRNO_CODES)
}

async function writeConfigFile({ path, content }) {
  const { FS } = window
  const dir = path.slice(0, path.lastIndexOf('/'))
  FS.mkdirTree(dir)
  FS.writeFile(path, content)
  await delay(100)
}

async function writeFile(file, dir) {
  const { FS } = window
  const { name } = file
  const buffer = await file.arrayBuffer()
  const dataView = new Uint8Array(buffer)
  FS.createDataFile('/', name, dataView, true, false)
  const data = FS.readFile(name, { encoding: 'binary' })
  FS.mkdirTree(`${raUserdataDir}${dir}/`)
  FS.writeFile(`${raUserdataDir}${dir}/${name}`, data, { encoding: 'binary' })
  FS.unlink(name)
  await delay(100)
}

async function prepare(file) {
  if (!('FS' in window)) {
    await loadEmscripten(core)

    const { FS } = window

    const emscriptenFS = await createEmscriptenFS()
    FS.mount(emscriptenFS, { root: '/home' }, '/home')
    const raConfig = 'menu_driver = rgui'
    await writeConfigFile({ path: raConfigPath, content: raConfig })
  }
}

const addRomButton = document.querySelector('#add-rom')
const addBiosButton = document.querySelector('#add-bios')
const runButton = document.querySelector('#run')
const select = document.querySelector('#core')

const roms = []
async function addRom() {
  await prepare()
  const [fileHandle] = await showOpenFilePicker()
  const file = await fileHandle.getFile()
  await writeFile(file, 'content')
  roms.push(file)
}

async function addBios() {
  await prepare()
  const [fileHandle] = await showOpenFilePicker()
  const file = await fileHandle.getFile()
  await writeFile(file, 'system')
}

async function run() {
  const { Module } = window
  const [rom] = roms
  const raArgs = [`/home/web_user/retroarch/userdata/content/${rom.name}`]
  Module.callMain(raArgs)
  if (canvas) {
    canvas.style.setProperty('display', 'block')
    Module.setCanvasSize(innerWidth, innerHeight)
    document.addEventListener('resize', () => {
      Module.setCanvasSize(innerWidth, innerHeight)
    })
  }
}

function onSelectCore() {
  location.replace(select.value ? `?core=${encodeURIComponent(select.value)}` : location.pathname)
}

select.addEventListener('change', onSelectCore)
addRomButton.addEventListener('click', addRom)
addBiosButton.addEventListener('click', addBios)
runButton.addEventListener('click', run)

if (core) {
  select.value = core
  addRomButton.hidden = false
  addBiosButton.hidden = false
  runButton.hidden = false
}
