import AOS from 'aos'
import 'aos/dist/aos.css'

function debounce(fn: () => void, wait = 100) {
  let t: number | undefined
  return () => {
    if (t) window.clearTimeout(t)
    t = window.setTimeout(() => {
      fn()
      t = undefined
    }, wait)
  }
}

export default function initAOS(options?: Record<string, any>) {
  AOS.init(Object.assign({ once: true, disableMutationObserver: true }, options))
  const refresh = () => { try { AOS.refresh() } catch {} }
  if (document.readyState === 'complete') refresh()
  else {
    window.addEventListener('load', refresh, { once: true })
    document.addEventListener('DOMContentLoaded', refresh, { once: true })
  }
  const imgs = Array.from(document.images)
  if (imgs.length) {
    let loaded = 0
    const onFinish = () => { loaded++; if (loaded >= imgs.length) refresh() }
    imgs.forEach((img) => {
      if (img.complete) onFinish()
      else { img.addEventListener('load', onFinish, { once: true }); img.addEventListener('error', onFinish, { once: true }) }
    })
  }
  const observer = new MutationObserver(debounce(refresh, 150))
  observer.observe(document.body, { childList: true, subtree: true, attributes: true })
  return () => {
    observer.disconnect()
    window.removeEventListener('load', refresh)
    document.removeEventListener('DOMContentLoaded', refresh)
  }
}