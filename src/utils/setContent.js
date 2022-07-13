import Skeleton from "../components/skeleton/Skeleton";
import Spinner from "../components/spinner/Spinner";
import ErrorMessage from "../components/errorMessage/ErrorMessage";

const setContent = (process, Component, data, ErrorComponent = ErrorMessage) => {
    switch (process) {
        case 'waiting':
            return <Skeleton />
        case 'loading':
            return <Spinner/>
        case 'confirmed':
            return <Component data={data}/>
        case 'error':
            return <ErrorComponent/>
        default:
            throw new Error('Unexpected process state')
    }
}

export default setContent
