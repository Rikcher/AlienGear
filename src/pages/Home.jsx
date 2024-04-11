import '/src/styles/css/Home.css'
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
    <div className="background">
      <img rel="preload" draggable="false" id='forest' src="/home-page/HomePageForestBG.svg" alt="Forest" />
      <img rel="preload" draggable="false" id='beam' src="/home-page/HomePageBeamBG.svg" alt="UFO Beam" />
      <img rel="preload" draggable="false" id='items' src="/home-page/HomePageItemsInBeamBG.svg" alt="Items in beam" />    
      <img rel="preload" draggable="false" id='ufo' src="/home-page/HomePageUfoBG.svg" alt="UFO" />    
      <img rel="preload" draggable="false" id='title' src="/home-page/HomePageHeroTitle.svg" alt="AlienGear" />    
      <img rel="preload" draggable="false" id='headset' src="/home-page/HomePageHeadsetBG.svg" alt="Floating headset" />    
      <img rel="preload" draggable="false" id='keyboard' src="/home-page/HomePageKeyboardBG.svg" alt="Floating keyboard" />    
    </div>
    <Link id='ctaButton' to="/products">Shop Now</Link>
    </>
  )
}

export default Home;




