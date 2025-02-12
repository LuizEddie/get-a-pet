import bus from '../utils/bus';

export default function useFlashMEssage(){

    function setFlashMessage(msg, type){
        bus.emit('flash', {
            message: msg,
            type: type
        });
    }

    return { setFlashMessage }

}