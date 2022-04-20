import './customers.css';
import Title from '../../components/Title';
import Header from '../../components/Header';
import firebase from '../../services/firebaseConnection';
import { FiUser } from 'react-icons/fi';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Customers() {
    const [paciente, setPaciente] = useState('');
    const [prontuario, setProntuario] = useState('');
    const [nascimento, setNascimento] = useState('');



    async function handleAdd(e) {
        e.preventDefault();
        
        if (paciente !== '' && prontuario !== '' && nascimento !== '') {
            await firebase.firestore().collection('entities')
            .add({
                nm_paciente: paciente,
                cd_prontuario: prontuario,
                nascimento: nascimento
            })
            .then(() => {
                setPaciente('');
                setProntuario('');
                setNascimento('');
                toast.info('Empresa cadastrada com sucesso!');
            })
            .catch((error) => {
                console.log(error);
                toast.error('Erro ao cadastrar empresa');
            })
        }
        else {
            toast.error('Preencha todos os campos!');
        }
    }

    return(
        <div>
            <Header />

            <div className="content">
                <Title name="Pacientes">
                    <FiUser size={25} />
                </Title>


                <div  className='container'>
                    <form className='form-profile customers' onSubmit={handleAdd}>
                        <label>Nome</label>
                        <input type="text" placeholder='Nome do paciente internado' value={paciente} onChange={ (e) => setPaciente(e.target.value) } />

                        <label>Prontuário</label>
                        <input type="text" placeholder='Seu prontuario' value={prontuario} onChange={ (e) => setProntuario(e.target.value) } />
                    
                        <label>Nascimento</label>
                        <input type="text" placeholder='Data de nascimento' value={nascimento} onChange={ (e) => setNascimento(e.target.value) } />

                        <button  type="submit">Cadastrar</button>
                    </form>

                </div>
            </div>

        </div>
    );
}