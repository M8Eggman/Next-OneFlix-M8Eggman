import "./Footer.sass";

export default function Footer() {
  return (
    <footer>
      <div className="footerContainer">
        <div className="footerLogo">
          <p>
            One<span>Flix</span>
          </p>
        </div>
        <div className="footerNavigationLinks"></div>
        <div className="footerSocialNetworks"></div>
        <div className="footerNewsLetter"></div>
      </div>
      <div className="footerCopyright">
        <p>
          Projet à but éducatif. Réalisé par <strong>Georges Tuséki</strong> dans le cadre de la formation Front-End de Molengeek.
        </p>
        <p>
          Les visuels et références inspirés de l’univers des animes appartiennent à leurs ayants droit respectifs. Ce projet OneFlix est réalisé à des fins strictement éducatives
          et non commerciales.
        </p>
      </div>
    </footer>
  );
}
