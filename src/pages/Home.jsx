import '/src/styles/css/Home.css'
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
    <div className="background">
      <img id='forest' src="/HomePageForestBG.svg" alt="" />
      <img id='beam' src="/HomePageBeamBG.svg" alt="" />
      <img id='items' src="/HomePageItemsInBeamBG.svg" alt="" />    
      <img id='ufo' src="/HomePageUfoBG.svg" alt="" />    
      <img id='title' src="/HomePageHeroTitle.svg" alt="" />    
      <img id='headset' src="/HomePageHeadsetBG.svg" alt="" />    
      <img id='keyboard' src="/HomePageKeyboardBG.svg" alt="" />    
    </div>
    <Link id='ctaButton' to="#">Shop Now</Link>
    </>
  )
}

export default Home;




