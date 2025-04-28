import WordSearch from "@/components/word-search";
import Logo from "@/components/logo";

export default function Home() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col">
        <Logo className="w-xl max-w-10/12 mb-5" />
        <WordSearch />
      </div>
    </div>
  );
}
