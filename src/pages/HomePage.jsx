import LeagueAccordion from '../components/home/LeagueAccordion'
import "../styles/HomePage.css"

function HomePage() {

    return(
        <div className="home-page">
            <header className="home-page__header">
                <h1>League Lens</h1>
                <h2>Pick a league to view teams and upcoming games</h2>
            </header>
            <LeagueAccordion />
        </div>
    )
}

export default HomePage