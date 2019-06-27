import React, { Component } from 'react';
import axios from 'axios';
import MovieCreditItem from './items/MovieCreditItem';
import MovieCastItem from './items/MovieCastItem';
import ProductionsCompanies from './items/ProductionsCompanies';

export class Movie extends Component {
    state = {
        movieCreditCrew: {},
        movieCreditCast: {},
    }


    async componentDidMount() {
        this.props.getMovie(this.props.match.params.movieId);
        // this.props.getMovieCredit(this.props.match.params.movieId);

        const movieId = this.props.match.params.movieId
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=fr-FR&api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
        this.setState({movieCreditCrew: res.data.crew, movieCreditCast: res.data.cast});
        
        // console.log(this.state.movieCreditCast);
    }

    render() {
        const { 
            budget,
            genres,
            imdb_id,
            original_language,
            original_title,
            overview,
            popularity,
            poster_path,
            backdrop_path,
            production_companies,
            production_countries,
            release_date,
            revenue,
            runtime,
            spoken_languages,
            status,
            tagline,
            title,
            video,
            vote_average,
            vote_count } = this.props.movie;

            // utilisation du spread  opreator pour pouvoir sortir la date de son objet et récupérer 
            // toute les information nécessaire en information utile et pertinente
            let yearSpread = {...release_date};
            let year = yearSpread[0] + yearSpread[1] + yearSpread[2] + yearSpread[3];

            let month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

            let movieMonth = yearSpread[5] + yearSpread[6];

            let releaseMonth = month[movieMonth - 1];

            let dayOfRelease = yearSpread[8] + yearSpread[9];

            let dateOfRelease = `${dayOfRelease} ${releaseMonth} ${year}`;

            // boucle pour récupérer les 3 premiers éléments du tableau des crédits du film
            let crewRows = [];
            if (this.state.movieCreditCrew.length > 0) {
                for (let i = 0; i < 3; i++) {
                    crewRows.push(<MovieCreditItem key={i} movieCreditCrew={this.state.movieCreditCrew[i]} />);
                }
            } 

            // boucle pour récupérer les 5 premiers Acteurs du film
            let castRows = [];
            if (this.state.movieCreditCast.length > 0) {
                for (let i = 0; i < 5; i++) {
                    castRows.push(<MovieCastItem key={i} movieCreditCast={this.state.movieCreditCast[i]} />);
                }
            }

            // boucle pour itérer sur chaque item productions_compagnies
            let productionCompanies = [];
            production_companies && production_companies.forEach(production_companie => {
                productionCompanies.push(<li key={production_companie.id}><img src={`https://image.tmdb.org/t/p/w185${production_companie.logo_path}`} alt={production_companie.name} style={{width: '100px', marginTop: '10px'}} /></li>)
            });

            //Transformation du temps de durée de film en Heure
            let movieHour = Math.floor(runtime / 60);
            let movieMinute = runtime % 60;

            let movieDuration = `${movieHour}h ${movieMinute}min.`;

            //rendre le revenue et budget d'un film plus facile à lire pour l'utilisateur
            const addStyleToBudgetRevenur = (budRev) => {
                let newArr = ('' + budRev).split('').map(function (digit) { 
                    return digit;
                });
                if (newArr.length > 6 && newArr.length < 8) {
                    return `${newArr[0]}-${newArr[1]}${newArr[2]}${newArr[3]}-${newArr[4]}${newArr[5]}${newArr[6]}`;
                } else if (newArr.length > 7 && newArr.length < 9) {
                    return `${newArr[0]}${newArr[1]}-${newArr[2]}${newArr[3]}${newArr[4]}-${newArr[5]}${newArr[6]}${newArr[7]}`;
                } else if (newArr.length > 8 && newArr.length < 10) {
                    return `${newArr[0]}${newArr[1]}${newArr[2]}-${newArr[3]}${newArr[4]}${newArr[5]}-${newArr[6]}${newArr[7]}${newArr[8]}`;
                } else if (newArr.length > 9 && newArr.length < 11) {
                    return `${newArr[0]}-${newArr[1]}${newArr[2]}${newArr[3]}-${newArr[4]}${newArr[5]}${newArr[6]}-${newArr[7]}${newArr[8]}${newArr[9]}`;
                }
                return newArr[0];
            }
            // console.log(addStyleToBudgetRevenur(budget));

            //transformation du vote en %
            let votePourcent = vote_average * 10;

            const { loading } = this.props;
        return (
            <div className="moviePAgeContent">
                <div className="bg-dark movieHeadline">
                    <div className='container grid-2'>
                        <img src={"https://image.tmdb.org/t/p/w185" + poster_path} alt={title} />
                        <div className="content">
                            <h1>{title}<span className="date">({year})</span></h1>
                            <ul className="toolBox">
                                <li className="rating">
                                    <div className="voteOuterCircle">
                                        <div className="voteInnerCircle">
                                            {votePourcent}%
                                        </div>
                                    </div>
                                    <p>Note des utilisateurs</p>
                                </li>
                                <li className="toolBox-icon">
                                    <p className="tollBox-linkItem"><i className="fas fa-list"></i></p>
                                </li>
                                <li className="toolBox-icon">
                                    <p className="tollBox-linkItem"><i className="fas fa-heart"></i></p>
                                </li>
                                <li className="toolBox-link">
                                    <p className="tollBox-linkItem"><i className="fas fa-play"></i> Regarder le trailer</p>
                                </li>
                            </ul>
                            <div className="synopsis">
                                <h2>Synopsis</h2>
                                <p>{overview}</p>
                            </div>
                            <div className="technical">
                                <h2>Equipe technique en vedette</h2>
                                <ul className="technicalStaff">
                                    {crewRows}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mainContent">
                    <div className="teteAffiche">
                        <h2>Tête d'affiche</h2>
                        <ul className="grid-5">
                            {castRows}
                        </ul>
                    </div>
                    <aside className="aside">
                        <h3>Informations</h3>
                        <ul className="aside-item productionCompanies">
                           {productionCompanies}
                        </ul>
                        <div className="aside-item status"><h3>Status</h3><p>{status === "Released" ? "Sorti" : "A venir"}</p></div>
                        <div className="aside-item releaseInfos">
                            <h3>Informations sur la sortie</h3>
                            <p>{status === "Released" ? `Sorti le ${dateOfRelease} au cinéma.` : `A paraitre le ${dateOfRelease}`}</p>
                        </div>
                        <div className="aside-item public"><h3>Tout public</h3><p>Effectuer une requête API pour la partie GET Movie Certification !!!</p></div>
                        <div className="aside-item OriginalLanguage"><h3>Langue originale</h3>Effectuer une requête à l'API configuration => GET Languages</div>
                        <div className="aside-item duration"><h3>Durée</h3><p>{runtime === 0 ? `-` : `${movieDuration}`}</p></div>
                        <div className="aside-item budget"><h3>Budget</h3><p>{addStyleToBudgetRevenur(budget)}$</p></div>
                        <div className="aside-item budget"><h3>Recette</h3><p>{revenue === 0 ? `-` : `${addStyleToBudgetRevenur(revenue)}$`}</p></div>
                    </aside>
                </div>
            </div>
        )
    }
}
            


export default Movie
