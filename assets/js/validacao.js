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
    }
};

const validadores = {
    dataNascimento:input => validaDataNascimento(input)
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

