import { BackgroundBeamsWithCollision } from "@/components/BackgroundBeamsWithCollision";

const Header = () => {
  return (
    <BackgroundBeamsWithCollision>
      <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
    <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center  font-sans tracking-tight">
      What&apos;s cooler than SNIPPETS?{" "}
        <div className="absolute left-0  bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
          <span className="">Exploding snippets.</span>
        </div>
    </h2>
      </div>
  </BackgroundBeamsWithCollision>
  )
}

export default Header
