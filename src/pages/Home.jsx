import '/src/styles/css/Home.css'
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
    <div className="background">
      <img id='forest' src="/public/HomePageForestBG.svg" alt="" />
      <img id='beam' src="/public/HomePageBeamBG.svg" alt="" />
      <img id='items' src="/public/HomePageItemsInBeamBG.svg" alt="" />    
      <img id='ufo' src="/public/HomePageUfoBG.svg" alt="" />    
      <img id='title' src="/public/HomePageHeroTitle.svg" alt="" />    
      <img id='headset' src="/public/HomePageHeadsetBG.svg" alt="" />    
      <img id='keyboard' src="/public/HomePageKeyboardBG.svg" alt="" />    
    </div>
    <Link id='ctaButton' to="#">Shop Now</Link>
    </>
  )
}

export default Home;




