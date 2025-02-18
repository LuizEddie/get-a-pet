import { useState } from 'react';
import formStyles from './Form.module.css';
import Input from './Input';
import Select from './Select';
import If from '../layout/If';

export default function PetForm({ petData, btnText, handleSubmit }) {

    const [pet, setPet] = useState(petData || {});
    const [preview, setPreview] = useState([]);
    const colors = ["Branco", "Preto", "Cinza", "Caramelo", "Mesclado"];

    function onFileChange(e) {
        setPreview(Array.from(e.target.files));
        setPet(p => ({...p, images: [...e.target.files]}));
    }

    function handleChange(e) {
        setPet(p => ({...p, [e.target.name]: e.target.value}));
    }

    function handleColor(e) {
        setPet(p => ({...p, color: e.target.options[e.target.selectedIndex].text}));
    }

    function submit(e){
        e.preventDefault();
        // console.log(pet);
        handleSubmit(pet);
    }

    return (
        <form className={formStyles.form_container} onSubmit={submit}>
            <div className={formStyles.preview_pet_images}>
            <If condition={preview.length > 0}>
                {
                    preview.map((item, idx)=>(
                        <img
                            src={URL.createObjectURL(item)}
                            alt={pet.name}
                            key={`${pet.name}_${idx}`}
                        ></img>
                    ))
                }
            </If>
            <If condition={preview.length === 0 && pet.images?.length > 0}>
                {
                    pet?.images?.map((item, idx)=>(
                        <img
                            src={`${import.meta.env.VITE_APP_API}images/pets/${item}`}
                            alt={pet.name}
                            key={`${pet.name}_${idx}`}
                        ></img>                    
                    ))                
                }
            </If>
            </div>
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