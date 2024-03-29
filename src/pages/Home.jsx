import '/src/styles/css/Home.css'
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
    <div className="background">
      <img id='forest' src="./src/assets/HomePageForestBG.svg" alt="" />
      <img id='beam' src="/src/assets/HomePageBeamBG.svg" alt="" />
      <img id='items' src="/src/assets/HomePageItemsInBeamBG.svg" alt="" />    
      <img id='ufo' src="/src/assets/HomePageUfoBG.svg" alt="" />    
      <img id='title' src="/src/assets/HomePageHeroTitle.svg" alt="" />    
      <img id='headset' src="/src/assets/HomePageHeadsetBG.svg" alt="" />    
      <img id='keyboard' src="/src/assets/HomePageKeyboardBG.svg" alt="" />    
    </div>
    <Link id='ctaButton' to="#">Shop Now</Link>
    </>
  )
}

export default Home;




