export function valida(input) {
    const tipoDeInput = input.dataset.tipo;

    if (validadores[tipoDeInput]) {
        validadores[tipoDeInput](input);
    };

    if (input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';
    } else {
        input.parentElement.classList.add('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro (tipoDeInput, input);
    };
};

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
];

const mensagensDeErro = {
    nome: {
        valueMissing: 'O campo Nome não pode estar vazio.'
    },
    email: {
        valueMissing: 'O campo de Email não pode estar vazio.',
        typeMismatch: 'O Email digitado não é valido.'
    },
    senha: {
        valueMissing: 'O campo Senha não pode estar vazio.',
        patternMismatch: 'A senha deve conter no mínimo 6 caracteres sendo uma letra maiúscula, uma minúscula e um número.'
    },
    dataNascimento: {
        valueMissing: 'O campo de Data de nascimento não pode estar vazio.',
        customError: 'Você deve ter mais de 18 anos para se cadastrar.'
    },
    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        customError: 'O CPF digitado é inválido.'
    },
    cep: {
        valueMissing: 'O campo CEP não pode estar vazio.',
        patternMismatch: 'O CEP digitado é inválido.',
        customError: 'CEP inválido.'
    },
    logradouro: {
        valueMissing: 'O campo Logradouro não pode estar vazio.'
    },
    cidade: {
        valueMissing: 'O campo Cidade não pode estar vazio.'
    },
    estado: {
        valueMissing: 'O campo Estado não pode estar vazio.'
    },
    preco: {
        valueMissing: 'O campo Preço não pode estar vazio.'
    }
};

const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperarCEP(input)
};

function mostraMensagemDeErro(tipoDeInput, input) {
    let mensagem = '';

    tiposDeErro.forEach(erro => {
        if (input.validity[erro]) {
            mensagem = mensagensDeErro[tipoDeInput][erro]
        };
    });

    return mensagem;
};

function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value);
    let mensagem = '';

    if (!maiorQue18(dataRecebida)) {
        mensagem = 'Você deve ter mais de 18 anos para se cadastrar.';
    };

    input.setCustomValidity(mensagem);
};

function maiorQue18(data) {
    const dataAtual = new Date();
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());

    return dataMais18 <= dataAtual;
};

function validaCPF(input) {
    const cpfFormatado = input.value.replace(/\D/g, '');
    let mensagem = '';

    if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
        mensagem = 'O CPF digitado não é válido.';
    };

    input.setCustomValidity(mensagem);
};

function checaCPFRepetido(cpf) {
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ];
    let cpfValido = true;

    valoresRepetidos.forEach(valor => {
        if(valor == cpf) {
            cpfValido = false;
        };
    });

    return cpfValido;
};

function checaEstruturaCPF(cpf) {
    const multiplicador = 10;

    return chegaDigitoVerificador(cpf, multiplicador)
}

function chegaDigitoVerificador(cpf, multiplicador) {

    if (multiplicador >= 12) {
        return true
    }

    let multiplicadorInicial = multiplicador
    let soma = 0;
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
    const digitoVerificador = cpf.charAt(multiplicador - 1)
    for(let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
        soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
        contador++
    }

    if (digitoVerificador == confirmaDigito(soma)) {
        return chegaDigitoVerificador(cpf, multiplicador + 1)
    }

    return false
}

function confirmaDigito(soma) {
    return 11 - (soma % 11);
}

function recuperarCEP(input) {
    const cep = input.value.replace(/\D/g, '')
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if (!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url, options).then(
            response => response.json()
        ).then(
            data => {
                if (data.erro) {
                    input.setCustomValidity('CEP inválido.')
                    return
                }
                input.setCustomValidity('')
                preencheCamposComCEP(data)
                return
            }
        )
    }
}

function preencheCamposComCEP(data) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}