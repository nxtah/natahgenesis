import * as THREE from "three"
import vertex from "./shaders/vertex.glsl"
import fragment from "./shaders/fragment.glsl"

import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default class Experience {
  constructor() {
    this.scene = new THREE.Scene()

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#webgl"),
      alpha: true,
      antialias: true
    })

    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
          )
        }
      }
    })

    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      this.material
    )

    this.scene.add(this.mesh)

    this.clock = new THREE.Clock()

    this.initScrollTrigger()
    this.handleResize()
    this.tick()
  }

  initScrollTrigger() {
    this.scrollTrigger = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        this.material.uniforms.uScroll.value = self.progress
      }
    })
  }

  handleResize() {
    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.material.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      )
    })
  }

  tick() {
    this.material.uniforms.uTime.value = this.clock.getElapsedTime()
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.tick.bind(this))
  }

  destroy() {
    this.scrollTrigger?.kill()
    this.renderer.dispose()
    this.material.dispose()
    this.mesh.geometry.dispose()
  }
}
