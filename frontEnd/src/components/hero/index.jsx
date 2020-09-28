import React from "react"
import { Image } from "@chakra-ui/core"
import Hero1Logo from "../../assets/svg/hero1.svg"
import Hero2Logo from "../../assets/svg/hero2.svg"
import Hero3Logo from "../../assets/svg/hero3.svg"
import Hero4Logo from "../../assets/svg/hero4.svg"
import "./index.css"

const Hero = () => {
  return (
    <section className="hero__container">
      <div className="hero__caption">
        CONNECT WITH FRIENDS
        <p>LIKE NEVER BEFORE</p>
        <button className="hero__button">GET STARTED</button>
      </div>
      <div className="hero__gallery">
        <img src={Hero2Logo} alt="Logo" />
        <img src={Hero1Logo} alt="Logo" />
        <img src={Hero3Logo} alt="Logo" />
        <img src={Hero4Logo} alt="Logo" />
      </div>
    </section>
  )
}

export default Hero
