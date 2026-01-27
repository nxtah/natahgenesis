import { useEffect } from "react"
import Experience from "./Experience"

export default function Canvas() {
  useEffect(() => {
    const experience = new Experience()

    return () => experience.destroy?.()
  }, [])

  return <canvas id="webgl" />
}

