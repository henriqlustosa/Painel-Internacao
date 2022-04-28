import './modalvisita.css';

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
                    <h2>Detalhes do visita</h2>

                    <div className='row'>
                        <span>
                            Data: <i>{conteudo.data}</i>
                        </span><span>
                            Horario: <i>{conteudo.horario}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Paciente Internado: <i>{conteudo.paciente}</i>
                        </span>
                    </div>
                    <div className='row'>
                        <span>
                            Visitante: <i>{conteudo.visitante}</i>
                        </span>
                    </div>
                    <div className='row'>
                        <span>
                            Andar: <i>{conteudo.andar}</i>
                        </span>
                    </div>

                   

                   
                  

                </div>
            </div>
        </div>
    );
}