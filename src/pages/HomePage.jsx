import LeagueAccordion from '../components/home/LeagueAccordion'
import heroImage from '../assets/hero-football.jpg'
import "../styles/HomePage.css"

function HomePage() {

    return(
        <div className="home-page">
            
            <header className="home-page__hero">
                <img
                    className="home-page__hero-img"
                    src={heroImage}
                    alt=""
                    aria-hidden="true"
                />
                <div className='home-page__hero-content'>
                    <h1>League Lens</h1>
                    <p className='home-page__kicker'>Browse leagues · teams · players</p>
                </div>
            </header>
            
            <div className="home-page__body">
                <h2>Pick a league to view teams and upcoming games</h2>
                <LeagueAccordion />
            </div>
        </div>
    )
}

export default HomePage