import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";
import "./dashboard.css";

import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Modal from "../../components/Modal";
import { Input } from "semantic-ui-react";
import firebase from "../../services/firebaseConnection";

import generatePDF from "../../services/reportGenerator";

export default function Dashboard() {
  const [chamados, setChamados] = useState([]);
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
    .collection("censo")
    .where('nm_paciente', 'not-in', ['DESOCUPADO', 'MANUTENCAO', 'LIMPEZA', 'BLOQUEIO ADMINISTRATIVO', 'PATOLOGIA'])
    .orderBy("nm_paciente");

  useEffect(() => {
    loadChamados();

    return () => {};
  }, []);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchValue  !== "") {
     
      const filteredData = chamados.filter((item) => {
        return Object.values(item)
          .join('')
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(chamados);
    }
  };
  async function loadChamados() {
    await listRef
    
      .limit(5)
      .get()
      .then((snapshot) => {
        updateState(snapshot);
      })
      .catch((err) => {
        console.log("Erro ao carregar chamados: ", err);
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
          prontuario: doc.data().cd_prontuario,
          data_internacao: doc.data().dt_internacao_data,
          hora_internacao: doc.data().dt_internacao_hora,
          sexo: doc.data().in_sexo,
          nascimento: doc.data().dt_nascimento,
          especialidade: doc.data().nm_especialidade,
          paciente: doc.data().nm_paciente,
          unidade: doc.data().nm_unidade_funcional,
          idade: doc.data().nr_idade,
          quarto: doc.data().nr_quarto,
        });
      });

      const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //pegando último documento buscado
      setChamados((chamados) => [...chamados, ...lista]);
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

        {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>

            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>
          </div>
        ) : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
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
                  <th scope="col">Paciente</th>
                  <th scope="col">Prontuário</th>
                  <th scope="col">Nascimento</th>
                  <th scope="col">Idade</th>
                  <th scope="col">Sexo</th>
                  <th scope="col">Especialidade</th>
                  <th scope="col">Quarto</th>
                  <th scope="col">Data de Internação</th>
                  <th scope="col">Unidade Funcional</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {searchInput.length > 0
                  ? filteredResults.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td data-label="Paciente">{item.paciente}</td>
                          <td data-label="Prontuario">{item.prontuario}</td>
                          <td data-label="Nascimento">{item.nascimento}</td>
                          <td data-label="Idade">{item.idade}</td>
                          <td data-label="Sexo">{item.sexo}</td>
                          <td data-label="Especialidade">
                            {item.especialidade}
                          </td>
                          <td data-label="Quarto">{item.quarto}</td>
                          <td data-label="DataInternacao">
                            {item.data_internacao}
                          </td>
                          <td data-label="Unidade">{item.unidade}</td>
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
                              to={`/new/${item.id}`}
                            >
                              <FiEdit2 color="#FFF" size={17} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  : chamados.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td data-label="Paciente">{item.paciente}</td>
                          <td data-label="Prontuario">{item.prontuario}</td>
                          <td data-label="Nascimento">{item.nascimento}</td>
                          <td data-label="Idade">{item.idade}</td>
                          <td data-label="Sexo">{item.sexo}</td>
                          <td data-label="Especialidade">
                            {item.especialidade}
                          </td>
                          <td data-label="Quarto">{item.quarto}</td>
                          <td data-label="DataInternacao">
                            {item.data_internacao}
                          </td>
                          <td data-label="Unidade">{item.unidade}</td>
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
                              to={`/new/${item.id}`}
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
              onClick={() => generatePDF(chamados)}
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
