const PortariaModel = require('../../models/post/PortariaModel');
const getMotorista = require('../../models//get/GetMotoristaModel');
const postMotorista = require('../../models/post/MotoristaModel');
const getCarro = require('../../models/get/GetCarrosModel');
const postCarro = require('../../models/post/CarroModel');
const getCarroMotorista = require('../../models/get/GetCarroMotoristaModel');
const postCarroMotorista = require('../../models/post/CarroMotoristaModel');

exports.criarRegistro = async (req, res) => {
try {
    const {
      nome,
      tipo_documento,
      documento,
      tipo_entrada,
      data_hora_entrada,
      data_hora_saida,
      observacao,
      fabrica_id,
      placa
    } = req.body;
    console.log('Dados recebidos:', req.body);

    if (!documento) {
      return res.status(400).json({ message: 'Documento é obrigatório' });
    }

    let motorista = await getMotorista.listarMotoristas(documento);

    if (!motorista) {
      if (!nome || !tipo_documento) {
        return res.status(400).json({ message: 'Nome e tipo_documento são obrigatórios para novos motoristas' });
      }

      motorista = await postMotorista.criarMotorista(nome, tipo_documento, documento);
    }
    let carroId = null;

    if (tipo_entrada.includes('Motorizado')) {
      let carro = await getCarro.listarCarros(placa);
      if (!carro) {
        const tipo = tipo_entrada.includes('Visitante') ? 'visitante' : 'corporativo';
        carro = await postCarro.criarCarro(placa, tipo);
      }
      carroId = carro.id;

      const vinculo = await getCarroMotorista.verificarVinculo(carroId, motorista.id);
      if (!vinculo) {
        await postCarroMotorista.criarVinculo(carroId, motorista.id);
      }
    }

    let imagemPath = null;
    if (req.file) {
      imagemPath = `/uploads/${req.file.filename}`;
    }

    await PortariaModel.criarRegistro({
      status: 0,
      data_hora_entrada,
      data_hora_saida: null,
      carro_id: carroId,
      motorista_id: motorista.id,
      fabrica_id,
      observacao,
      imagem: imagemPath,
      tipo_entrada
    });

    res.status(201).json({ message: 'Entrada registrada com sucesso!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao registrar entrada || '+err });
  }
};
