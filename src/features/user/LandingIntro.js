import TemplatePointers from "./components/TemplatePointers"



function LandingIntro(){

    return(
        <div className="hero min-h-full rounded-l-xl bg-base-200">
            <div className="hero-content py-12">
              <div className="max-w-md">

              <h1 className='text-3xl text-center font-bold '><img src="/logo192.png" className="w-20 inline-block mr-2 mask mask-circle" alt="dashwind-logo" />Endless</h1>

                <div className="text-center mt-5"><img src="./intro.png" alt="Dashwind Admin Template" className="w-70 inline-block"></img></div>
              
              </div>

            </div>
          </div>
    )
      
  }
  
  export default LandingIntro