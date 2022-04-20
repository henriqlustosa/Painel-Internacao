import './modal.css';

import { FiX} from 'react-icons/fi';


export default function Modal({conteudo, close}) {
    return (
        <div className='modal'>
            <div className='container'>
                <button className='close' onClick={ close }>
                    <FiX size={23} color="#FFF" />
                    Voltar
                </button>

                <div>
                    <h2>Detalhes do chamado</h2>

                    <div className='row'>
                        <span>
                            Paciente: <i>{conteudo.paciente}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Prontuario: <i>{conteudo.prontuario}</i>
                        </span>
                        <span>
                            Nascimento: <i>{conteudo.nascimento}</i>
                        </span>
                    </div>
                    <div className='row'>
                        <span>
                            Idade: <i>{conteudo.idade}</i>
                        </span>
                    </div>
                    <div className='row'>
                        <span>
                            Sexo: <i>{conteudo.sexo}</i>
                        </span>
                    </div>
                    <div className='row'>
                        <span>
                            Especialidade: <i>{conteudo.especialidade}</i>
                        </span>
                    </div>
                    <div className='row'>
                        <span>
                            Quarto: <i>{conteudo.quarto}</i>
                        </span>
                    </div>
                    <div className='row'>
                        <span>
                            Data da Internacao: <i>{conteudo.data_internacao}</i>
                        </span>
                    </div>
                    <div className='row'>
                        <span>
                            Unidade Funcional: <i>{conteudo.unidade}</i>
                        </span>
                    </div>

                   

                   
                  

                </div>
            </div>
        </div>
    );
}