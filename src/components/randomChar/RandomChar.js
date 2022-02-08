import {Component} from "react";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";


class RandomChar extends Component {
    state = {
        char: {},
        loading: true,
        error: false,
    }
    marvelService = new MarvelService();

    componentDidMount() {
        this.setNewChar()
    }

    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    onCharLoaded = char =>
        this.setState({
            char: { ...char, isHasImage: this.checkIsHasImage(char)},
            loading: false,
            error: false,
        })

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000)
        this.marvelService.getCharacter(id)
            .then(this.onCharLoaded)
            .catch(() => this.onError())
    }

    getNewChar = () => {
        clearInterval(this.timerId)
        this.setNewChar()
    }

    setNewChar = () => {
        this.updateChar()
        this.timerId = setInterval(this.updateChar, 6000)
    }

    onError = () => this.setState({loading: false, error: true})

    checkIsHasImage = ({thumbnail}) => thumbnail.includes('image_not_available')

    render() {
        const {char, loading, error} = this.state
        const errorMassage = error ? <ErrorMessage/> : null
        const spinner = loading ? <Spinner/> : null
        const content = !(loading || error) ? <View char={char}/> : null

        return (
            <div className="randomchar">
                {errorMassage}
                {spinner}
                {content}

                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main" onClick={this.getNewChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {
        name,
        description,
        thumbnail,
        homepage,
        wiki,
        isHasImage,
    } = char

    const getStyleBgi = isHasImage ? { 'objectFit': 'contain'} : null


    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img"  style={getStyleBgi}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}
export default RandomChar;
