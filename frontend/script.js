const API_URL = 'http://localhost:8000';

let usuarioLogado = null;

document.addEventListener('DOMContentLoaded', () => {

// =========================================================
// FUNÇÕES GERAIS
// =========================================================

function mostrarToast(mensagem, tipo = 'sucesso') {
    const toast = document.getElementById('toastNotificacao');
    const msgEl = document.getElementById('toastMensagem');

    if (!toast || !msgEl) {
        alert(mensagem);
        return;
    }

    msgEl.innerText = mensagem;

    if (tipo === 'erro') {
        toast.style.backgroundColor = '#dc2626';
    } else {
        toast.style.backgroundColor = '#1e293b';
    }

    toast.style.display = 'block';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.opacity = '0';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);

    }, 3000);
}


function configurarValidacaoEmail(inputId, erroId) {

    const input = document.getElementById(inputId);
    const erro = document.getElementById(erroId);

    if (!input || !erro) return;

    input.addEventListener('input', () => {

        const valor = input.value.trim();

        const regexEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (valor === '') {

            input.style.borderColor = '#dc2626';

            erro.innerText =
                'O campo de e-mail não pode ficar vazio.';

            erro.style.display = 'block';

        } else if (!regexEmail.test(valor)) {

            input.style.borderColor = '#dc2626';

            erro.innerText =
                'Digite um e-mail válido.';

            erro.style.display = 'block';

        } else {

            input.style.borderColor = '#16a34a';

            erro.innerText = '';

            erro.style.display = 'none';
        }
    });
}


// =========================================================
// MENU (Ajustado para permitir navegar entre os arquivos HTML)
// =========================================================

const menuLinks =
    document.querySelectorAll('.menu a, nav a');

menuLinks.forEach(link => {

    link.addEventListener('click', function (e) {

        const href = this.getAttribute('href');

        // Se for um link para outra página HTML, deixa o navegador abrir normalmente
        if (href && href.endsWith('.html')) {
            return;
        }

        if (href && href.startsWith('#')) {

            e.preventDefault();

            if (href === '#' || href === '#inicio') {

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

            } else {

                const secao =
                    document.querySelector(href);

                if (secao) {

                    secao.scrollIntoView({
                        behavior: 'smooth'
                    });

                }
            }
        }

        menuLinks.forEach(item =>
            item.classList.remove('active')
        );

        this.classList.add('active');
    });
});


// =========================================================
// VALIDAÇÃO DE E-MAIL
// =========================================================

configurarValidacaoEmail(
    'loginEmail',
    'erro-loginEmail'
);

configurarValidacaoEmail(
    'cadEmail',
    'erro-cadEmail'
);


// =========================================================
// LOGIN
// =========================================================

const formLogin =
    document.getElementById('formLogin');

if (formLogin) {

    formLogin.addEventListener(
        'submit',
        async function (e) {

            e.preventDefault();

            const inputEmail =
                document.getElementById('loginEmail');

            const inputSenha =
                document.getElementById('loginSenha');

            const erroEmail =
                document.getElementById('erro-loginEmail');

            const erroSenha =
                document.getElementById('erro-loginSenha');

            const email =
                inputEmail.value.trim();

            const senha =
                inputSenha.value;

            const regexEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            let valido = true;


            // VALIDAR E-MAIL

            if (!email || !regexEmail.test(email)) {

                valido = false;

                inputEmail.classList.add('input-error');

                inputEmail.style.borderColor =
                    '#dc2626';

                if (erroEmail) {

                    erroEmail.innerText =
                        'Informe um e-mail válido.';

                    erroEmail.style.display =
                        'block';
                }

            } else {

                inputEmail.classList.remove(
                    'input-error'
                );

                inputEmail.style.borderColor =
                    '#16a34a';

                if (erroEmail) {
                    erroEmail.style.display =
                        'none';
                }
            }


            // VALIDAR SENHA

            if (!senha) {

                valido = false;

                inputSenha.classList.add(
                    'input-error'
                );

                inputSenha.style.borderColor =
                    '#dc2626';

                if (erroSenha) {

                    erroSenha.innerText =
                        'Informe sua senha.';

                    erroSenha.style.display =
                        'block';
                }

            } else {

                inputSenha.classList.remove(
                    'input-error'
                );

                inputSenha.style.borderColor =
                    '#16a34a';

                if (erroSenha) {
                    erroSenha.style.display =
                        'none';
                }
            }


            if (!valido) return;


            // ENVIAR LOGIN PARA O BACKEND

            try {

                console.log(
                    'Tentando realizar login...'
                );

                const resposta =
                    await fetch(
                        `${API_URL}/api/login`,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({
                                email: email,
                                senha: senha
                            })
                        }
                    );


                const data =
                    await resposta.json();

                console.log(
                    'Resposta login:',
                    data
                );


                if (
                    resposta.ok &&
                    data.sucesso
                ) {

                    usuarioLogado =
                        data.usuario;


                    localStorage.setItem(
                        'usuarioResolveJa',
                        JSON.stringify(
                            usuarioLogado
                        )
                    );


                    localStorage.setItem(
                        'usuarioNome',
                        usuarioLogado.nome
                    );


                    mostrarToast(
                        'Login realizado com sucesso!'
                    );


                    setTimeout(() => {

                        window.location.href =
                            'painel.html';

                    }, 1000);


                } else {

                    mostrarToast(
                        data.mensagem ||
                        'E-mail ou senha inválidos.',
                        'erro'
                    );
                }


            } catch (erro) {

                console.error(
                    'Erro no login:',
                    erro
                );

                mostrarToast(
                    'Não foi possível conectar ao servidor.',
                    'erro'
                );
            }
        }
    );
}


// =========================================================
// CADASTRO
// =========================================================

const formCadastro =
    document.getElementById('formCadastro');

if (formCadastro) {

    formCadastro.addEventListener(
        'submit',
        async function (e) {

            e.preventDefault();

            const inputNome =
                document.getElementById('cadNome');

            const inputEmail =
                document.getElementById('cadEmail');

            const inputSenha =
                document.getElementById('cadSenha');

            const inputTipo =
                document.getElementById('cadTipo');

            const erroNome =
                document.getElementById('erro-cadNome');

            const erroEmail =
                document.getElementById('erro-cadEmail');

            const erroSenha =
                document.getElementById('erro-cadSenha');


            if (
                !inputNome ||
                !inputEmail ||
                !inputSenha
            ) {

                console.error(
                    'Campos do formulário não encontrados.'
                );

                return;
            }


            const nome =
                inputNome.value.trim();

            const email =
                inputEmail.value.trim();

            const senha =
                inputSenha.value;

            const tipo =
                inputTipo
                    ? inputTipo.value
                    : 'CLIENTE';


            const regexEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            let valido = true;


            // NOME

            if (!nome) {

                valido = false;

                inputNome.classList.add(
                    'input-error'
                );

                inputNome.style.borderColor =
                    '#dc2626';

                if (erroNome) {

                    erroNome.innerText =
                        'Preencha seu nome.';

                    erroNome.style.display =
                        'block';
                }

            } else {

                inputNome.classList.remove(
                    'input-error'
                );

                inputNome.style.borderColor =
                    '#16a34a';

                if (erroNome) {
                    erroNome.style.display =
                        'none';
                }
            }


            // E-MAIL

            if (
                !email ||
                !regexEmail.test(email)
            ) {

                valido = false;

                inputEmail.classList.add(
                    'input-error'
                );

                inputEmail.style.borderColor =
                    '#dc2626';

                if (erroEmail) {

                    erroEmail.innerText =
                        'Informe um e-mail válido.';

                    erroEmail.style.display =
                        'block';
                }

            } else {

                inputEmail.classList.remove(
                    'input-error'
                );

                inputEmail.style.borderColor =
                    '#16a34a';

                if (erroEmail) {
                    erroEmail.style.display =
                        'none';
                }
            }


            // SENHA

            if (!senha) {

                valido = false;

                inputSenha.classList.add(
                    'input-error'
                );

                inputSenha.style.borderColor =
                    '#dc2626';

                if (erroSenha) {

                    erroSenha.innerText =
                        'Digite uma senha.';

                    erroSenha.style.display =
                        'block';
                }

            } else {

                inputSenha.classList.remove(
                    'input-error'
                );

                inputSenha.style.borderColor =
                    '#16a34a';

                if (erroSenha) {
                    erroSenha.style.display =
                        'none';
                }
            }


            if (!valido) return;


            // ENVIAR CADASTRO PARA O BACKEND

            try {

                console.log(
                    'Enviando cadastro:',
                    {
                        nome,
                        email,
                        tipo
                    }
                );


                const resposta =
                    await fetch(
                        `${API_URL}/api/cadastro`,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({
                                nome: nome,
                                email: email,
                                senha: senha,
                                tipo: tipo
                            })
                        }
                    );


                const data =
                    await resposta.json();


                console.log(
                    'Resposta cadastro:',
                    data
                );


                if (
                    resposta.ok &&
                    data.sucesso
                ) {

                    mostrarToast(
                        'Conta cadastrada com sucesso!'
                    );


                    setTimeout(() => {

                        window.location.href =
                            'login.html';

                    }, 1500);


                } else {

                    mostrarToast(
                        data.mensagem ||
                        'Erro ao cadastrar usuário.',
                        'erro'
                    );
                }


            } catch (erro) {

                console.error(
                    'Erro no cadastro:',
                    erro
                );

                mostrarToast(
                    'Não foi possível conectar ao servidor.',
                    'erro'
                );
            }
        }
    );
}


// =========================================================
// USUÁRIO LOGADO / PAINEL
// =========================================================

const usuarioSalvo =
    localStorage.getItem('usuarioResolveJa');


if (usuarioSalvo) {

    try {

        usuarioLogado =
            JSON.parse(usuarioSalvo);


        const nomeUsuario =
            document.getElementById(
                'nomeUsuarioLogado'
            ) || document.getElementById('userName');


        if (nomeUsuario) {

            nomeUsuario.innerText =
                `Olá, ${usuarioLogado.nome}`;
        }


        const avatar =
            document.getElementById('userAvatar');


        if (avatar && usuarioLogado.nome) {

            avatar.innerText =
                usuarioLogado.nome
                    .charAt(0)
                    .toUpperCase();
        }


        const painelProfissional =
            document.getElementById(
                'painelProfissional'
            );


        const painelInterno =
            document.getElementById(
                'painelInterno'
            );


        if (
            usuarioLogado.tipo ===
            'PRESTADOR'
        ) {

            if (painelProfissional) {

                painelProfissional.style.display =
                    'block';
            }

            if (painelInterno) {

                painelInterno.style.display =
                    'none';
            }

            carregarSolicitacoesProfissional();

        } else {

            if (painelProfissional) {

                painelProfissional.style.display =
                    'none';
            }

            if (painelInterno) {

                painelInterno.style.display =
                    'block';
            }
        }


        carregarServicos();

        carregarAgendamentos();


    } catch (erro) {

        console.error(
            'Erro ao recuperar usuário:',
            erro
        );

        localStorage.removeItem(
            'usuarioResolveJa'
        );

        localStorage.removeItem(
            'usuarioNome'
        );
    }


} else {

    if (
        window.location.pathname.includes(
            'painel.html'
        )
    ) {

        window.location.href =
            'login.html';
    }
}


// =========================================================
// LOGOUT (Compatível com btnSair e btnLogout)
// =========================================================

const btnSair =
    document.getElementById('btnSair') || document.getElementById('btnLogout');


if (btnSair) {

    btnSair.addEventListener(
        'click',
        () => {

            localStorage.removeItem(
                'usuarioResolveJa'
            );

            localStorage.removeItem(
                'usuarioNome'
            );

            usuarioLogado = null;

            window.location.href =
                'index.html';
        }
    );
}


// =========================================================
// LISTAR SERVIÇOS
// =========================================================

async function carregarServicos() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/api/servicos`
            );


        const servicos =
            await resposta.json();


        console.log(
            'Serviços:',
            servicos
        );


        const container =
            document.getElementById(
                'listaServicos'
            );


        const total =
            document.getElementById(
                'totalServicos'
            );


        if (
            total &&
            Array.isArray(servicos)
        ) {

            total.innerText =
                servicos.length;
        }


        if (!container) return;


        if (
            !Array.isArray(servicos) ||
            servicos.length === 0
        ) {

            container.innerHTML =
                '<p>Nenhum serviço disponível.</p>';

            return;
        }


        container.innerHTML =
            servicos.map(servico => {

                return `
                    <div class="service-card">

                        <h4>
                            ${servico.titulo}
                        </h4>

                        <p>
                            ${servico.descricao || ''}
                        </p>

                        <span>
                            R$ ${Number(
                                servico.preco || 0
                            ).toFixed(2)}
                        </span>

                        <button
                            onclick="agendarServico('${servico.id}')"
                            class="btn btn-primary"
                        >
                            Solicitar
                        </button>

                    </div>
                `;

            }).join('');


    } catch (erro) {

        console.error(
            'Erro ao carregar serviços:',
            erro
        );
    }
}


// =========================================================
// LISTAR AGENDAMENTOS
// =========================================================

async function carregarAgendamentos() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/api/agendamentos`
            );


        const agendamentos =
            await resposta.json();


        const container =
            document.getElementById(
                'listaAgendamentos'
            );


        if (!container) return;


        if (
            !Array.isArray(agendamentos) ||
            agendamentos.length === 0
        ) {

            container.innerHTML =
                '<li>Nenhum agendamento ativo.</li>';

            return;
        }


        container.innerHTML =
            agendamentos.map(agendamento => {

                return `
                    <li>

                        <strong>
                            ${agendamento.servicoTitulo}
                        </strong>

                        <br>

                        <small>

                            Data:
                            ${agendamento.data}

                            |

                            Status:
                            ${agendamento.status}

                        </small>

                    </li>
                `;

            }).join('');


    } catch (erro) {

        console.error(
            'Erro ao carregar agendamentos:',
            erro
        );
    }
}


// =========================================================
// SOLICITAÇÕES DO PRESTADOR
// =========================================================

async function carregarSolicitacoesProfissional() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/api/agendamentos`
            );


        const agendamentos =
            await resposta.json();


        const container =
            document.getElementById(
                'listaSolicitacoesProfissional'
            );


        const total =
            document.getElementById(
                'totalSolicitacoes'
            );


        if (
            total &&
            Array.isArray(agendamentos)
        ) {

            total.innerText =
                agendamentos.length;
        }


        if (!container) return;


        if (
            !Array.isArray(agendamentos) ||
            agendamentos.length === 0
        ) {

            container.innerHTML =
                '<li>Nenhum chamado pendente.</li>';

            return;
        }


        container.innerHTML =
            agendamentos.map(agendamento => {

                return `
                    <li>

                        <strong>
                            ${agendamento.servicoTitulo}
                        </strong>

                        <br>

                        <small>

                            Cliente:
                            ${agendamento.clienteNome}

                            |

                            ${agendamento.data}

                        </small>

                    </li>
                `;

            }).join('');


    } catch (erro) {

        console.error(
            'Erro ao carregar solicitações:',
            erro
        );
    }
}


// =========================================================
// AGENDAR SERVIÇO
// =========================================================

window.agendarServico =
    async function (servicoId) {

        if (!usuarioLogado) {

            mostrarToast(
                'Faça login primeiro.',
                'erro'
            );

            window.location.href =
                'login.html';

            return;
        }


        try {

            const resposta =
                await fetch(
                    `${API_URL}/api/agendamentos`,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify({

                            clienteId:
                                usuarioLogado.id,

                            servicoId:
                                servicoId,

                            data:
                                new Date()
                                    .toISOString()
                                    .split('T')[0]
                        })
                    }
                );


            const resultado =
                await resposta.json();


            if (
                resposta.ok &&
                resultado.sucesso
            ) {

                mostrarToast(
                    'Solicitação realizada com sucesso!'
                );

                carregarAgendamentos();


            } else {

                mostrarToast(
                    resultado.mensagem ||
                    'Falha ao solicitar serviço.',
                    'erro'
                );
            }


        } catch (erro) {

            console.error(
                'Erro ao agendar:',
                erro
            );

            mostrarToast(
                'Erro ao processar solicitação.',
                'erro'
            );
        }
    };


// =========================================================
// MOSTRAR / OCULTAR SENHA
// =========================================================

const btnToggleSenha =
    document.getElementById(
        'btnToggleSenha'
    );


const inputSenhaLogin =
    document.getElementById(
        'loginSenha'
    );


if (
    btnToggleSenha &&
    inputSenhaLogin
) {

    btnToggleSenha.addEventListener(
        'click',
        () => {

            if (
                inputSenhaLogin.type ===
                'password'
            ) {

                inputSenhaLogin.type =
                    'text';

                btnToggleSenha.innerText =
                    'Ocultar';

            } else {

                inputSenhaLogin.type =
                    'password';

                btnToggleSenha.innerText =
                    '👁️';
            }
        }
    );
}


// =========================================================
// ESQUECI SENHA - MODAL
// =========================================================

const linkEsqueci =
    document.getElementById(
        'linkEsqueciSenha'
    );


const modalEsqueci =
    document.getElementById(
        'modalEsqueciSenha'
    );


const btnFechar =
    document.getElementById(
        'btnFecharModal'
    );


if (
    linkEsqueci &&
    modalEsqueci &&
    btnFechar
) {

    linkEsqueci.addEventListener(
        'click',
        e => {

            e.preventDefault();

            modalEsqueci.classList.add(
                'active'
            );
        }
    );


    btnFechar.addEventListener(
        'click',
        () => {

            modalEsqueci.classList.remove(
                'active'
            );
        }
    );


    modalEsqueci.addEventListener(
        'click',
        e => {

            if (
                e.target ===
                modalEsqueci
            ) {

                modalEsqueci.classList.remove(
                    'active'
                );
            }
        }
    );
}


// =========================================================
// FORMULÁRIO DE RECUPERAÇÃO
// =========================================================

const formRecupera =
    document.getElementById(
        'formEsqueciSenha'
    );


if (formRecupera) {

    formRecupera.addEventListener(
        'submit',
        e => {

            e.preventDefault();


            if (modalEsqueci) {

                modalEsqueci.classList.remove(
                    'active'
                );
            }


            mostrarToast(
                'Solicitação de recuperação recebida!'
            );
        }
    );
}

});