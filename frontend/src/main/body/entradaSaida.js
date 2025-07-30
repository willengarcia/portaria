import Status from "./saidaPedestre";

function EntradaSaida() {
  return (
    <>
        <section id="entrada_saida">
          <h2>Registro Saída</h2>
          <div id="resultadoRelatorio_entrada_saida" on>
            <Status></Status>
          </div>
        </section>
    </>
  );
}

export default EntradaSaida;