import {useState, useEffect} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';
import PropTypes from "prop-types";

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>
        case 'loading':
            return newItemLoading ? <Component /> : <Spinner/>
        case 'confirmed':
            return <Component />
        case 'error':
            return <ErrorMessage/>
        default:
            throw new Error('Unexpected process state')
    }
}

const CharList = props => {

    const [charList, setCharList] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charEnded, setCharEnded] = useState(false)

    const { getAllCharacters, process, setProcess } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false
        if (newCharList.length < 9) {
            ended = true
        }
        setCharList(charList => [...charList, ...newCharList])
        setNewItemLoading(false)
        setOffset(offset => offset + 9)
        setCharEnded(ended)
    }

    const checkActiveClass = (id) => {
        return id === props.selectedChar ? 'char__item_selected' : null
    }

    // Этот метод создан для оптимизации,
    // чтобы не помещать такую конструкцию в метод render
    const renderItems = arr => {
        const items =  arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li
                    className={`char__item ${checkActiveClass(item.id)}`}
                    key={item.id}
                    tabIndex="0"
                    onClick={() => props.onCharSelected(item.id)}
                    onFocus={() => props.onCharSelected(item.id)}
                >
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    return (
        <div className="char__list">
            { setContent(process, () => renderItems(charList), newItemLoading) }
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func,
}

export default CharList;
