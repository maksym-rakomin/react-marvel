import { useState, useEffect } from "react";
import { useParams, Link  } from "react-router-dom";
import './singleComic.scss';
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const SingleComic = ({ dataType }) => {
    const { comicsId } = useParams()
    const [comic, setComic] = useState(null)

    const { loading, error, getComic, clearError, getCharacterByName } = useMarvelService();

    useEffect(() => {
        updateComic()
    }, [comicsId])

    const updateComic = () => {
        clearError()

        switch (dataType) {
            case 'comics':
                getComic(comicsId)
                    .then(onComicLoaded)
            case 'characters':
                getCharacterByName(comicsId)
                    .then(data => onComicLoaded(data[0]))
        }

    }

    const onComicLoaded = (comic) => {
        setComic(comic)
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic} dataType={dataType}/> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({comic, dataType}) => {
    const {title, name, description, pageCount, thumbnail, language, price} = comic;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title || name}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                {
                    language ? <p className="single-comic__descr">Language: {language}</p> : null
                }
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to={`/${dataType}`} className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComic;
