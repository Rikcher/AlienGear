import '/src/styles/css/Home.css'
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
    <div className="background">
      <img draggable="false" id='forest' src="/home-page/HomePageForestBG.svg" alt="Forest" />
      <img draggable="false" id='beam' src="/home-page/HomePageBeamBG.svg" alt="UFO Beam" />
      <img draggable="false" id='items' src="/home-page/HomePageItemsInBeamBG.svg" alt="Items in beam" />    
      <img draggable="false" id='ufo' src="/home-page/HomePageUfoBG.svg" alt="UFO" />    
      <img draggable="false" id='title' src="/home-page/HomePageHeroTitle.svg" alt="AlienGear" />    
      <img draggable="false" id='headset' src="/home-page/HomePageHeadsetBG.svg" alt="Floating headset" />    
      <img draggable="false" id='keyboard' src="/home-page/HomePageKeyboardBG.svg" alt="Floating keyboard" />    
    </div>
    <Link id='ctaButton' to="#">Shop Now</Link>
    </>
  )
}

export default Home;




