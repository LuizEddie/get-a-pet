export default function If({condition, children}){
    return (<>
        {
            condition && children
        }
    </>)
}