console.log('VITE_API_BASE:', import.meta.env.VITE_API_BASE);
import Canvas from "./webgl/Canvas"
import Layout from "./layout/Layout"

import Navbar from "./components/Navbar"
import BotpressChat from "./components/BotpressChat"
import Hero from "./sections/Hero"
import Problem from "./sections/Problem"
import Services from "./sections/Services";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Section5 from "./sections/Section5";
import Section6 from "./sections/Section6";
import Section7 from "./sections/Section7";
import Section8 from "./sections/Section8";
import Section9 from "./sections/Section9";
import Footer from "./components/Footer";
import Admin from "./sections/Admin";


function App() {
  const isAdminPath = typeof window !== 'undefined' && window.location.pathname === '/admin';

  if (isAdminPath) {
    return (
      <Layout>
        <Navbar />
        <main style={{ padding: '2rem 1rem' }}>
          <Admin />
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <Navbar />
      <BotpressChat />
      <Canvas />

      <section id="hero" className="h-screen relative z-10">
        <Hero />
      </section>

      <section id="problem" className="min-h-screen relative z-10">
        <Problem />
      </section>

      <section id="services" className="min-h-screen relative z-30">
        <Services />
      </section>

      <section id="projects" className="min-h-screen relative z-10">
        <Projects />
      </section>

      <section id="about" className="min-h-screen relative z-10">
        <About />
      </section>

      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />

      <Footer />
    </Layout>
  )
}

export default App
