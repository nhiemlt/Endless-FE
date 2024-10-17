import TemplatePointers from "./components/TemplatePointers";

function LandingIntro() {
  return (
    <div className="hero min-h-full rounded-l-xl bg-base-200">
      <div className="hero-content py-12">
        <div className="max-w-md">
          <div className="text-center">
            <img src="./intro.gif"
              alt="Endless Admin Template"
              className="w-1 md:w-full lg:w-full inline-block" // Kích thước cho các thiết bị khác nhau
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingIntro;
