import { ref, onMounted, onUnmounted } from 'vue'

export function useScreen() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  function update() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  const isMobile = () => width.value < 768
  const isTablet = () => width.value >= 768 && width.value < 1024
  const isDesktop = () => width.value >= 1024

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop
  }
}