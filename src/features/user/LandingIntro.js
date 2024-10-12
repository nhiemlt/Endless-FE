import TemplatePointers from "./components/TemplatePointers"



function LandingIntro(){

    return(
        <div className="hero min-h-full rounded-l-xl bg-base-200">
            <div className="hero-content py-12">
              <div className="max-w-md">

              <h1 className='text-2xl text-center font-bold '><img src="logo-text-dark.png" className="w-32 inline-block" alt="endless-logo" /></h1>

                <div className="text-center"><img src="./intro.png" alt="Endless Admin Template" className="w-70 inline-block"></img></div>
              
              </div>

            </div>
          </div>
    )
      
  }
  
  export default LandingIntro