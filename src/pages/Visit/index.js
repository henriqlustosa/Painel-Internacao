import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";
import "./visit.css";

import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Modal from "../../components/ModalVisita";

import { Input } from "semantic-ui-react";
import firebase from "../../services/firebaseConnection";

import generatePDF from "../../services/reportGenerator";

export default function Dashboard() {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState();

  const listRef = firebase
    .firestore()
    .collection("visitas")
    .orderBy("nm_paciente");

  useEffect(() => {
    loadVisitas();

    return () => {};
  }, []);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchValue  !== "") {
     
      const filteredData = visitas.filter((item) => {
        return Object.values(item)
          .join('')
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(visitas);
    }
  };
  async function loadVisitas() {
    await listRef
    
      .limit(5)
      .get()
      .then((snapshot) => {
        updateState(snapshot);
      })
      .catch((err) => {
        console.log("Erro ao carregar visitas: ", err);
        setLoadingMore(false);
      });

    setLoading(false);
  }

  async function updateState(snapshot) {
    const isCollectionEmpty = snapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          horario: doc.data().dt_visita_hora,
          data: doc.data().dt_visita_data,
          documento: doc.data().nr_documento,
          paciente: doc.data().nm_paciente,
          visitante: doc.data().nm_visitante,
          andar: doc.data().cd_andar,
          
        });
      });

      const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //pegando último documento buscado
      setVisitas((chamados) => [...chamados, ...lista]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  async function handleMore() {
    setLoadingMore(true);
    await listRef
      .startAfter(lastDocs)
      .limit(5)
      .get()
      .then((snapshot) => {
        updateState(snapshot);
      });
  }

  function togglePostModal(item) {
    setShowPostModal(!showPostModal); //trocando de true pra false (toggle)
    setDetail(item);
  }

  if (loading) {
    return (
      <div>
        <Header />

        <div className="content">
          <Title name="Pacientes">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Pacientes">
          <FiMessageSquare size={25} />
        </Title>

        {visitas.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>

            <Link to="/newvisit" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>
          </div>
        ) : (
          <>
            <Link to="/newvisit" className="new">
              <FiPlus size={25} color="#FFF" />
              Nova visita
            </Link>
            <div style={{ padding: 20 }}>
              <Input
                icon="search"
                placeholder="Search..."
                onChange={(e) => searchItems(e.target.value)}
              />
            </div>
            <table>
              <thead>
                <tr>
                <th scope="col">Data</th>
                  <th scope="col">Horario</th>
                  <th scope="col">Paciente Internado</th>
                  <th scope="col">Acompanhante/Visitante</th>
                  <th scope="col">Andar/Leito</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {searchInput.length > 0
                  ? filteredResults.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td data-label="Data">{item.data}</td>
                          <td data-label="Horario">{item.horario}</td>
                          <td data-label="Paciente_Internado">{item.paciente}</td>
                          <td data-label="Acompanhante_Visitante">{item.visitante}</td>
                          <td data-label="Andar_Leito">{item.andar}</td> 
                          <td data-label="#">
                            <button
                              className="action"
                              style={{ backgroundColor: "#3583f6" }}
                              onClick={() => togglePostModal(item)}
                            >
                              <FiSearch color="#FFF" size={17} />
                            </button>
                            <Link
                              className="action"
                              style={{ backgroundColor: "#F6a935" }}
                              to={`/newvisit/${item.id}`}
                            >
                              <FiEdit2 color="#FFF" size={17} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  : visitas.map((item, index) => {
                      return (
                        <tr key={index}>
                         <td data-label="Data">{item.data}</td>
                          <td data-label="Horario">{item.horario}</td>
                          <td data-label="Paciente_Internado">{item.paciente}</td>
                          <td data-label="Acompanhante_Visitante">{item.visitante}</td>
                           <td data-label="Andar_Leito">{item.andar}</td> 
                          <td data-label="#">
                            <button
                              className="action"
                              style={{ backgroundColor: "#3583f6" }}
                              onClick={() => togglePostModal(item)}
                            >
                              <FiSearch color="#FFF" size={17} />
                            </button>
                            <Link
                              className="action"
                              style={{ backgroundColor: "#F6a935" }}
                              to={`/newvisit/${item.id}`}
                            >
                              <FiEdit2 color="#FFF" size={17} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
           
            {loadingMore && (
              <h3 style={{ textAlign: "center", marginTop: 15 }}>
                Buscando dados...
              </h3>
            )}
            {!loadingMore && !isEmpty && (
              <button className="btn-more" onClick={handleMore}>
                Buscar mais
              </button>
            )}
			<br/> 
			 <button
              className="btn-more"
              onClick={() => generatePDF(visitas)}
            >
              PDF
            </button>
          </>
        )}
      </div>

      {showPostModal && <Modal conteudo={detail} close={togglePostModal} />}
    </div>
  );
}
