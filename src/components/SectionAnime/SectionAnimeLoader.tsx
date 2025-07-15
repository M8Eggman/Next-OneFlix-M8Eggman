import "./SectionAnimes.sass";
import CardHomeLoader from "../card/cardHome/CardHomeLoader";

export default function SectionAnimeLoader({ title }: { title: string }) {
  return (
    <section className="sectionAnimes">
      <h2>{title}</h2>
      <div className="divAnimesContainer">
        <div className="divAnimes">
          {Array.from({ length: 16 }).map((_, index) => (
            <CardHomeLoader key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
