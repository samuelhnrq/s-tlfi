import Logo from "./logo";

function BackdropLogo() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center overflow-hidden -z-10">
      <Logo className="fill-gray-700/10 dark:fill-gray-300/10 h-6/12 max-h-70" />
    </div>
  );
}

export default BackdropLogo;
