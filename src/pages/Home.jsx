import '/src/styles/css/Home.css'
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
    <div className="background">
      <img draggable="false" id='forest' src="/home-page/HomePageForestBG.svg" alt="" />
      <img draggable="false" id='beam' src="/HomePageBeamBG.svg" alt="" />
      <img draggable="false" id='items' src="/HomePageItemsInBeamBG.svg" alt="" />    
      <img draggable="false" id='ufo' src="/HomePageUfoBG.svg" alt="" />    
      <img draggable="false" id='title' src="/HomePageHeroTitle.svg" alt="" />    
      <img draggable="false" id='headset' src="/HomePageHeadsetBG.svg" alt="" />    
      <img draggable="false" id='keyboard' src="/HomePageKeyboardBG.svg" alt="" />    
    </div>
    <Link id='ctaButton' to="#">Shop Now</Link>
    </>
  )
}

export default Home;




