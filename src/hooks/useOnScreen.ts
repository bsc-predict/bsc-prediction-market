import React from "react"

export default function useOnScreen<T extends HTMLElement>(ref: React.MutableRefObject<T | null>) {
  const [isIntersecting, setIntersecting] = React.useState(false)

  const observer = React.useRef<IntersectionObserver>()

  React.useEffect(() => {
    observer.current = new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting)
  )}, [])

  React.useEffect(() => {
    if (ref.current) {
        observer.current?.observe(ref.current)
    }
  // Remove the observer as soon as the component is unmounted
  return () => { observer.current?.disconnect() }
  }, [])

  return isIntersecting
}