import { useState } from "react";
import If from "../../layout/If";
import { Link } from "react-router-dom";

export default function MyPets(){

    const [pets, setPets] = useState([]);

    return (
        <section>
            <div>
                <h1>Meus Pets</h1>
                <Link to="/pet/add">Cadastrar Pet</Link>
            </div>
            <div>
                <If condition={pets.length === 0}>
                    <p>Não há pets cadastrados</p>
                </If>
                <If condition={pets.length > 0}>
                    <p>Meus Pets Cadastrados</p>
                </If>
            </div>
        </section>
    );
}