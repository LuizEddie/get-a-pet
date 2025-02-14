import { useState } from 'react';
import formStyles from './Form.module.css';
import Input from './Input';
import Select from './Select';

export default function PetForm({ petData, btnText, handleSubmit }) {

    const [pet, setPet] = useState(petData || {});
    const [preview, setPreview] = useState([]);
    const colors = ["Branco", "Preto", "Cinza", "Caramelo", "Mesclado"];

    function onFileChange() {

    }

    function handleChange() {

    }

    function handleColor() {

    }

    return (
        <form className={formStyles.form_container}>
            <Input
                text='Imagens do Pet'
                type={'file'}
                name={'images'}
                handleOnChange={onFileChange}
                multiple={true}
            ></Input>
            <Input
                text='Nome do Pet'
                type={'text'}
                name={'name'}
                placeholder={'Digite o nome do pet'}
                handleOnChange={handleChange}
                value={pet.name || ''}
            ></Input>
            <Input
                text='Idade do Pet'
                type={'text'}
                name={'age'}
                placeholder={'Digite o idade do pet'}
                handleOnChange={handleChange}
                value={pet.age || ''}
            ></Input>
            <Input
                text='Peso do Pet'
                type={'number'}
                name={'weight'}
                placeholder={'Digite o peso do pet'}
                handleOnChange={handleChange}
                value={pet.weight || ''}
            ></Input>
            <Select
                handleOnChange={handleColor}
                name={'color'}
                text={'Selecione a cor'}
                options={colors}
                value={pet.color || ''}
            ></Select>
            <input type="submit" value={btnText} />
        </form>
    )
}