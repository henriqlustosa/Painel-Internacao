import './newvisita.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';

import { FiPlusCircle } from 'react-icons/fi';
import { useState, useContext, useEffect,useRef } from 'react';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';

export default function New() {
    const { id } = useParams();
    const history = useHistory();

    const [loadPacientes, setLoadPacientes] = useState(true);
    const [loadAndares, setLoadAndares] = useState(true);
    const [pacientes, setPacientes] = useState([]);
   
    const [andares, setAndares] = useState([]);
    const [pacienteSelected, setPacienteSelected] = useState(0);
    const [andarSelected, setAndarSelected] = useState(0);

    const [datavisita, setDatavisita] = useState();
    const [hora, setHora] = useState();
   
    const [visitante, setVisitante] = useState();
   
     
    
    const name = useRef([]);
    const quarto = useRef([]);
    
    
    const [idPaciente, setIdPaciente] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadPacientes() {
            await firebase.firestore().collection('censo').where('nm_paciente', 'not-in', ['DESOCUPADO', 'MANUTENCAO', 'LIMPEZA', 'BLOQUEIO ADMINISTRATIVO', 'PATOLOGIA'])
            .get()
            .then((snapshot) => {

                let lista = [];
                let andar = [];
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        paciente: doc.data().nm_paciente
                    })
                    andar.push({
                        id: doc.id,
                        andar: doc.data().nr_quarto
                    })
                })

               


              

                setPacientes(lista);
                setAndares(andar);
                name.current =lista;
                quarto.current = andar;
                setLoadPacientes(false);
                setLoadAndares(false);
                
                console.log(id, 'id');
                if (id) {
                    setIdPaciente(true);
                        
                    loadId(lista);
                    
                }
                else{
                  var dataAtual = new Date();
	        const locale = 'pt-br';
	        var data = dataAtual.toLocaleDateString(locale);
	        var hora = dataAtual.toLocaleTimeString(locale); 
            
            setDatavisita(data);
            setHora(hora); 
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
        await firebase.firestore().collection('visitas').doc(id)
        .get()
        .then((snapshot) => {
           
            setDatavisita(snapshot.data().dt_visita_data);
            setHora(snapshot.data().dt_visita_hora);
          
            setVisitante(snapshot.data().nm_visitante);
            

           

            var indexAndar = quarto.current.findIndex(p => p.andar == snapshot.data().cd_andar);
           
            setAndarSelected(indexAndar);


            
            console.log(id);

            var index = name.current.findIndex(p => p.paciente == snapshot.data().nm_paciente);
            
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
            await firebase.firestore().collection('visitas')
            .doc(id)
            .update({
                cd_andar: andares[andarSelected].andar,
                dt_visita_hora: hora,
                dt_visita_data: datavisita,
                nm_visitante: visitante,
                nm_paciente: pacientes[pacienteSelected].paciente,
        
               
                userId: user.uid
            })
            .then(() => {
                toast.success('Chamado editado com sucesso!');
                setPacienteSelected(0);
            
                history.push('/visit');
            })
            .catch((err) => {
                toast.error('Ops, erro ao editar chamado, tente novamente mais tarde.');
                console.log(err);
            })

            return;
        }
        
        await firebase.firestore().collection('visitas')
        .add({
            created: new Date(),
            cd_andar: andares[andarSelected].andar,
            dt_visita_hora: hora,
            dt_visita_data: datavisita,
            nm_visitante: visitante,
            nm_paciente: pacientes[pacienteSelected].paciente,
         
            userId: user.uid
        }).then(() => {
            toast.success('Chamado criado com sucesso!');
            
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
    function handleChangeAndares(e) {
        setAndarSelected(e.target.value);
    }
    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name="Nova Visita">
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

                      

                        <label>Data</label>
                        <input type="text" placeholder='Data da visita' value={datavisita} onChange={ (e) => setDatavisita(e.target.value) } />
                    
                        <label>Hora</label>
                        <input type="text" placeholder='Hora da visita' value={hora} onChange={ (e) => setHora(e.target.value) } />

              

                        <label>Acompanhante/Visitante</label>
                        <input type="text" placeholder='Nome do visitante' value={visitante} onChange={ (e) => setVisitante(e.target.value) } />
                    
                        <label>Andar/Leito</label>
                        {loadAndares ? (
                            <input type='text' disabled={true} value="Carregando andar..." />
                        ) : (

                            <select value={andarSelected} onChange={handleChangeAndares} >
                                {andares.map((item, index) => {
                                    return(
                                        <option key={item.id} value={index}>
                                            {item.andar}
                                        </option>
                                    );
                                })}
                            </select>
                        ) }

                        
                        

                        

                       

                        <button type="submit">Registrar</button>

                    </form>

                </div>
            </div>
        </div>
    );
}