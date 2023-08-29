const core = new URLSearchParams(location.search).get('core')
const raUserdataDir = '/home/web_user/retroarch/userdata/'
const raConfigPath = `${raUserdataDir}retroarch.cfg`
const canvas = document.querySelector('#canvas')

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

function writeConfigFile({ path, content }) {
  const { FS } = window
  const dir = path.slice(0, path.lastIndexOf('/'))
  FS.mkdirTree(dir)
  FS.writeFile(path, content)
}

async function launchRom(file) {
  await loadEmscripten(core)

  const { Module, FS } = window

  const emscriptenFS = await createEmscriptenFS()
  FS.mount(emscriptenFS, { root: '/home' }, '/home')

  const { name } = file
  const buffer = await file.arrayBuffer()
  const dataView = new Uint8Array(buffer)
  FS.createDataFile('/', name, dataView, true, false)
  const data = FS.readFile(name, { encoding: 'binary' })
  FS.mkdirTree(`${raUserdataDir}content/`)
  FS.writeFile(`${raUserdataDir}content/${name}`, data, { encoding: 'binary' })
  FS.unlink(name)

  const raConfig = 'menu_driver = rgui'
  writeConfigFile({ path: raConfigPath, content: raConfig })

  const raArgs = [`/home/web_user/retroarch/userdata/content/${file.name}`]
  Module.callMain(raArgs)
  if (canvas) {
    canvas.style.setProperty('display', 'block')
    Module.setCanvasSize(innerWidth, innerHeight)
    document.addEventListener('resize', () => {
      Module.setCanvasSize(innerWidth, innerHeight)
    })
  }
}

const button = document.querySelector('#button')
const select = document.querySelector('#core')

async function onSelectRom() {
  const [fileHandle] = await showOpenFilePicker()
  const file = await fileHandle.getFile()
  await launchRom(file)
}

function onSelectCore() {
  location.replace(select.value ? `?core=${encodeURIComponent(select.value)}` : location.pathname)
}

select.addEventListener('change', onSelectCore)
button.addEventListener('click', onSelectRom)

if (core) {
  select.value = core
  button.hidden = false
}
