import './new.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';

import { FiPlusCircle } from 'react-icons/fi';
import { useRef, useState, useContext, useEffect } from 'react';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';

export default function New() {
    const { id } = useParams();
    const history = useHistory();

    const [loadPacientes, setLoadPacientes] = useState(true);
    const [pacientes, setPacientes] = useState([]);
    const [pacienteSelected, setPacienteSelected] = useState(0);

    const [prontuario, setProntuario] = useState();
    const [nascimento, setNascimento] = useState();
    const [especialidade, setEspecialidade] = useState();
    const [idade, setIdade] = useState();
    const [sexo, setSexo] = useState();
    const [quarto, setQuarto] = useState();
    const [internacao, setInternacao] = useState();
    const [unidade, setUnidade] = useState();

    const name = useRef([]);
    const [idPaciente, setIdPaciente] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadPacientes() {
            await firebase.firestore().collection('censo')
            .where('nm_paciente', 'not-in', ['DESOCUPADO', 'MANUTENCAO', 'LIMPEZA', 'BLOQUEIO ADMINISTRATIVO', 'PATOLOGIA'])
            .orderBy("nm_paciente")
            .get()
            .then((snapshot) => {

                let lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        paciente: doc.data().nm_paciente
                    })
                })

             
                setPacientes(lista);
                name.current =lista;

                setLoadPacientes(false);
               

                if (id) {
                    setIdPaciente(true);
                    loadId(lista);
                   
                }

            })
            .catch((error) => {
                console.log("Ocorreu algum erro!", error);
                setLoadPacientes(false);
                setPacientes([ { id: '1', paciente: '' }]);
            })
        }

        loadPacientes();

    } , [id]);

    async function loadId(lista) {
        await firebase.firestore().collection('censo').doc(id)
        .get()
        .then((snapshot) => {
           
            setProntuario(snapshot.data().cd_prontuario);
            setInternacao(snapshot.data().dt_internacao_data);
            setSexo (snapshot.data().in_sexo);
            setNascimento(snapshot.data().dt_nascimento);
            setEspecialidade(snapshot.data().nm_especialidade);
            setQuarto(snapshot.data().nr_quarto);
            setUnidade(snapshot.data().nm_unidade_funcional);
            setIdade(snapshot.data().nr_idade);
            var index = name.current.findIndex(p => p.id == id);
			console.log(index);
            setPacienteSelected(index);
        
            

        })
        .catch((err) => {
            console.log('Erro no ID passado: ', err);
            setIdPaciente(false);
        })
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (idPaciente) {
            await firebase.firestore().collection('censo')
            .doc(id)
            .update({
                cd_prontuario: prontuario,
                dt_nascimento: nascimento,
                nr_idade: idade, 
                in_sexo: sexo,
                nm_especialidade: especialidade,
                nr_quarto: quarto,
                dt_internacao_data: internacao,
                nm_unidade_funcional: unidade,
                nm_paciente: pacientes[pacienteSelected].paciente,
                userId: user.uid
            })
            .then(() => {
                toast.success('Chamado editado com sucesso!');
                setPacienteSelected(0);
                setProntuario('');
                history.push('/dashboard');
            })
            .catch((err) => {
                toast.error('Ops, erro ao editar chamado, tente novamente mais tarde.');
                console.log(err);
            })

            return;
        }
        
        await firebase.firestore().collection('censo')
        .add({
            created: new Date(),
            cd_prontuario: prontuario,
            dt_nascimento: nascimento,
            nr_idade: idade, 
            in_sexo: sexo,
            nm_especialidade: especialidade,
            nr_quarto: quarto,
            dt_internacao_data: internacao,
            nm_unidade_funcional: unidade,
            nm_paciente: pacientes[pacienteSelected].paciente,
            userId: user.uid
        }).then(() => {
            toast.success('Chamado criado com sucesso!');
            setProntuario('');
            setPacienteSelected(0);
        })
        .catch((err) => {
            toast.error('Ops, erro ao registrar, tente novamente mais tarde.');
            console.log(err);
        })
    }

    /*chamado quando troca o assunto
    function handleChangeSelect(e) {
        setAssunto(e.target.value);
    }

    //chamado quando troca o status
    function handleOptionChange(e) {
        setStatus(e.target.value);
    }
   */

    //chamado quando troca de cliente
    function handleChangeCustomers(e) {
        setPacienteSelected(e.target.value);
    }

    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name="Novo Paciente">
                    <FiPlusCircle size={25} />
                </Title>


                <div className='container'>
                    
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Paciente</label>

                        {loadPacientes ? (
                            <input type='text' disabled={true} value="Carregando clientes..." />
                        ) : (

                            <select value={pacienteSelected} onChange={handleChangeCustomers} >
                                {pacientes.map((item, index) => {
                                    return(
                                        <option key={item.id} value={index}>
                                            {item.paciente}
                                        </option>
                                    );
                                })}
                            </select>
                        ) }

                      

                        <label>Prontuário</label>
                        <input type="text" placeholder='Seu prontuario' value={prontuario} onChange={ (e) => setProntuario(e.target.value) } />
                    
                        <label>Nascimento</label>
                        <input type="text" placeholder='Data de nascimento' value={nascimento} onChange={ (e) => setNascimento(e.target.value) } />

                        <label>Idade</label>
                        <input type="text" placeholder='Idade do paciente' value={idade} onChange={ (e) => setIdade(e.target.value) } />

                        <label>Sexo</label>
                        <input type="text" placeholder='Sexo do paciente' value={sexo} onChange={ (e) => setSexo(e.target.value) } />
                    
                        <label>Especialidade</label>
                        <input type="text" placeholder='Especialidade' value={especialidade} onChange={ (e) => setEspecialidade(e.target.value) } />

                        
                        <label>Quarto</label>
                        <input type="text" placeholder='Quarto do paciente' value={quarto} onChange={ (e) => setQuarto(e.target.value) } />

                        <label>Data de Internação</label>
                        <input type="text" placeholder='Data de internação' value={internacao} onChange={ (e) => setInternacao(e.target.value) } />
                    
                        <label>Unidade Funcional</label>
                        <input type="text" placeholder='Unidade Funcional' value={unidade} onChange={ (e) => setUnidade(e.target.value) } />

                        

                       

                        <button type="submit">Registrar</button>

                    </form>

                </div>
            </div>
        </div>
    );
}