import { useState, useEffect } from "react";
import { useParams, Link  } from "react-router-dom";
import './singleComic.scss';
import useMarvelService from "../../services/MarvelService";
import {Helmet} from "react-helmet";
import setContent from "../../utils/setContent";

const SingleComic = ({ dataType }) => {
    const { comicsId } = useParams()
    const [comic, setComic] = useState(null)

    const { getComic, getCharacterByName, process, setProcess } = useMarvelService();

    useEffect(() => {
        updateComic()
    }, [comicsId])

    const updateComic = () => {
        switch (dataType) {
            case 'comics':
                getComic(comicsId)
                    .then(data => onComicLoaded(data))
                    .then(() => setProcess('confirmed'))
                break
            case 'characters':
                getCharacterByName(comicsId)
                    .then(data => onComicLoaded(data[0]))
                    .then(() => setProcess('confirmed'))
                break
        }

    }

    const onComicLoaded = (comic) => {
        setComic(comic)
    }

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content={comic?.description || 'description'}
                />
                <title>{comic?.title || comic?.name}</title>
            </Helmet>

            { setContent(process, View, {comic, dataType}) }
        </>
    )
}

const View = ({data}) => {
    const {title = '', name = '', description = '', pageCount = '', thumbnail = '', language = '', price = ''} = data.comic;

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
            <Link to={`/${data.dataType}`} className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComic;
