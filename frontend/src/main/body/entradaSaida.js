import Status from "./status";

function EntradaSaida() {
  return (
    <>
        <section id="entrada_saida">
          <h2>Relatório</h2>
          <div id="resultadoRelatorio_entrada_saida" on>
            <Status></Status>
          </div>
        </section>
    </>
  );
}

export default EntradaSaida;