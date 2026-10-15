// =====================================================================
// ResolveJá - funções compartilhadas (perfil, máscaras, serviços, pagamentos)
// Enquanto não há backend para serviços/pagamentos, tudo fica no localStorage.
// =====================================================================
(function () {
    const CHAVE_SERVICOS = 'servicosResolveJa';
    const CHAVE_PERFIL = 'perfilResolveJa';
    const CHAVE_END = 'enderecoResolveJa';
    const FORMAS = ['Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'Transferência bancária', 'Boleto'];
    const nomeLogado = localStorage.getItem('usuarioNome') || 'Cliente/Profissional';

    const esc = v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const ler = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch (e) { return f; } };
    const dig = v => String(v || '').replace(/\D/g, '');
    const moeda = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0);
    const isoLocal = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const hojeISO = () => isoLocal(new Date());
    const dataBR = iso => iso ? iso.split('-').reverse().join('/') : '—';

    // ---------- Máscaras ----------
    function mascDoc(v) {
        v = dig(v).slice(0, 14);
        if (v.length <= 11) {
            return v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        return v.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    function mascTel(v) {
        v = dig(v).slice(0, 11);
        if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        return v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    function mascCep(v) { v = dig(v).slice(0, 8); return v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; }
    function aplicarMascara(input, fn) {
        if (!input) return;
        input.addEventListener('input', () => { input.value = fn(input.value); });
    }

    // ---------- Validação CPF / CNPJ ----------
    function validaDoc(valor) {
        const v = dig(valor);
        if (/^(\d)\1+$/.test(v)) return false;
        if (v.length === 11) {
            const d = n => { let s = 0; for (let i = 0; i < n; i++) s += +v[i] * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
            return d(9) === +v[9] && d(10) === +v[10];
        }
        if (v.length === 14) {
            const d = n => { let s = 0, p = n - 7; for (let i = 0; i < n; i++) { s += +v[i] * p--; if (p < 2) p = 9; } const r = s % 11; return r < 2 ? 0 : 11 - r; };
            return d(12) === +v[12] && d(13) === +v[13];
        }
        return false;
    }

    // ---------- Sessão / perfil ----------
    function ehPrestador() {
        const u = ler('usuarioResolveJa', null);
        return !!(u && u.tipo === 'PRESTADOR') || nomeLogado.toLowerCase().includes('profissional');
    }
// Os dados do perfil ficam separados por usuário (antes eram uma chave única por navegador,
    // e cliente e prestador sobrescreviam o CPF/CNPJ um do outro)
    function chavePerfil() {
        const u = ler('usuarioResolveJa', null);
        return CHAVE_PERFIL + ':' + ((u && (u.id || u.email)) || nomeLogado);
    }
    localStorage.removeItem(CHAVE_PERFIL); // apaga a chave antiga, que misturava os usuários
    function perfil() { return { ...(ler('usuarioResolveJa', {}) || {}), ...(ler(chavePerfil(), {}) || {}) }; }
    function salvarPerfil(dados) { localStorage.setItem(chavePerfil(), JSON.stringify({ ...ler(chavePerfil(), {}), ...dados })); }

    // Só aceita imagem em data URL (evita injetar qualquer coisa no HTML)
    function safeFoto(f) {
        return typeof f === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(f) ? f : '';
    }
    function avatarHtml(nome, foto, tam = 36, vazio = false) {
        const f = safeFoto(foto);
        const ini = vazio ? '?' : esc(String(nome || '?').trim().charAt(0).toUpperCase());
        const estilo = f ? `background-image:url('${f}');` : '';
        return `<span class="rj-av" style="width:${tam}px;height:${tam}px;font-size:${Math.round(tam * 0.42)}px;${estilo}">${f ? '' : ini}</span>`;
    }
    // Foto (ou inicial) no círculo do topo; clicar leva ao perfil
    function pintarAvatar() {
        const av = document.getElementById('userAvatar');
        if (!av) return;
        const foto = safeFoto(perfil().foto);
        if (foto) {
            av.innerText = '';
            av.style.backgroundImage = `url('${foto}')`;
            av.style.backgroundSize = 'cover';
            av.style.backgroundPosition = 'center';
        } else {
            av.style.backgroundImage = '';
            av.innerText = nomeLogado.charAt(0).toUpperCase();
        }
    }
    function iniciarSessao() {
        const av = document.getElementById('userAvatar');
        if (av) {
            pintarAvatar();
            av.style.cursor = 'pointer';
            av.title = 'Meu perfil';
            av.setAttribute('role', 'link');
            av.tabIndex = 0;
            const ir = () => { if (!window.location.pathname.endsWith('perfil.html')) window.location.href = 'perfil.html'; };
            av.addEventListener('click', ir);
            av.addEventListener('keydown', e => { if (e.key === 'Enter') ir(); });
        }
        const bt = document.getElementById('btnLogout');
        if (bt) bt.addEventListener('click', () => { localStorage.removeItem('usuarioNome'); window.location.href = 'login.html'; });
    }

    // ---------- Serviços ----------
    const carregar = () => ler(CHAVE_SERVICOS, []);
    const salvar = l => localStorage.setItem(CHAVE_SERVICOS, JSON.stringify(l));
    function visiveis() {
        const todos = carregar();
        return ehPrestador() ? todos : todos.filter(s => s.cliente === nomeLogado);
    }
    // Pagamentos: prestador vê o que recebeu; cliente vê o que pagou
    function pagamentos() {
        return carregar()
            .filter(s => s.pagamento && (ehPrestador() ? s.profissional === nomeLogado : s.cliente === nomeLogado))
            .map(s => ({ servico: s.nome, cliente: s.cliente, prestador: s.profissional, ...s.pagamento }));
    }

    function badge(status) {
        if (status === 'Concluído') return '<span class="badge badge-success">Concluído</span>';
        if (status === 'Pendente') return '<span class="badge badge-pending">Pendente</span>';
        return '<span class="badge badge-warning">Em andamento</span>';
    }
    function enderecoTexto(e) {
        if (!e) return '—';
        return `${e.rua}, ${e.numero}${e.complemento ? ' - ' + e.complemento : ''} — ${e.bairro ? e.bairro + ', ' : ''}${e.cidade}/${e.uf} — CEP ${e.cep}`;
    }

    // ---------- Modais (injetados na página) ----------
    function criarModal(id, titulo, corpo) {
        const d = document.createElement('div');
        d.className = 'modal-overlay-dark';
        d.id = id;
        d.innerHTML = `<div class="modal-card-dark modal-wide">
            <div class="modal-card-dark-header"><h2>${titulo}</h2><button type="button" class="modal-close-dark" data-fechar>&times;</button></div>${corpo}</div>`;
        document.body.appendChild(d);
        d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-fechar]')) d.classList.remove('active'); });
        return d;
    }
    const opcoesFormas = FORMAS.map(f => `<option value="${f}">${f}</option>`).join('');

    function iniciarServicos(opcoes = {}) {
        const prestador = ehPrestador();
        const aoMudar = opcoes.aoMudar || (() => { });

        // Modal: novo serviço (cliente)
        const mNovo = criarModal('modalNovoServico', 'Novo Serviço', `
            <form id="formNovoServico" class="rj-grid" novalidate>
                <div class="rj-field full"><label>Nome do serviço</label><input id="svNome" placeholder="Ex: Troca de Torneira" required></div>
                <div class="rj-field"><label>Categoria</label><select id="svCategoria">
                    <option>Elétrica</option><option>Hidráulica</option><option>Climatização</option>
                    <option>Pintura</option><option>Limpeza</option><option>Outro</option></select></div>
                <div class="rj-field"><label>Forma de pagamento prevista</label><select id="svPagto">${opcoesFormas}</select></div>
                <div class="rj-field full"><label>Descrição (opcional)</label><textarea id="svDesc" rows="2" placeholder="Detalhe o que você precisa..."></textarea></div>

                <div class="rj-sec">Seus dados</div>
                <div class="rj-field"><label>Telefone / WhatsApp</label><input id="svTel" placeholder="(62) 99999-9999"></div>
                <div class="rj-field"><label>CPF</label><input id="svDoc" placeholder="000.000.000-00"></div>

                <div class="rj-sec">Endereço onde o serviço será feito</div>
                <div class="rj-field"><label>CEP</label><input id="svCep" placeholder="00000-000"></div>
                <div class="rj-field"><label>Número</label><input id="svNumero" placeholder="123"></div>
                <div class="rj-field full"><label>Rua</label><input id="svRua"></div>
                <div class="rj-field"><label>Complemento</label><input id="svCompl" placeholder="Apto, bloco, referência"></div>
                <div class="rj-field"><label>Bairro</label><input id="svBairro"></div>
                <div class="rj-field"><label>Cidade</label><input id="svCidade"></div>
                <div class="rj-field"><label>UF</label><input id="svUf" maxlength="2" placeholder="GO"></div>

                <div class="full"><p id="svErro" class="rj-erro"></p>
                <button type="submit" class="btn-action" style="width:100%">Solicitar Serviço</button></div>
            </form>`);

        // Modal: concluir + registrar pagamento (prestador)
        const mPag = criarModal('modalPagamento', 'Concluir e registrar pagamento', `
            <form id="formPagamento" class="rj-grid" novalidate>
                <div class="rj-field"><label>Valor recebido (R$)</label><input id="pgValor" type="number" step="0.01" min="0.01" placeholder="0,00"></div>
                <div class="rj-field"><label>Forma de pagamento</label><select id="pgForma">${opcoesFormas}</select></div>
                <div class="rj-field"><label>Data do pagamento</label><input id="pgData" type="date"></div>
                <div class="rj-field full"><label>Observação (opcional)</label><input id="pgObs" placeholder="Ex: pago metade em dinheiro"></div>
                <div class="full"><p id="pgErro" class="rj-erro"></p>
                <button type="submit" class="btn-action" style="width:100%">Concluir serviço</button></div>
            </form>`);

        const mDet = criarModal('modalDetalhes', 'Detalhes do serviço', '<div id="detalhesPessoas"></div><dl class="rj-detail" id="detalhesCorpo"></dl>');

        // Modal: avaliar (cliente avalia o serviço/prestador; prestador avalia o cliente)
        const mAva = criarModal('modalAvaliar', 'Avaliar serviço', `
            <form id="formAvaliar" class="rj-grid" novalidate>
                <p class="full rj-ava-info" id="avaInfo"></p>
                <p class="full rj-ava-info" id="avaPergunta"></p>
                <div class="full">
                    <div class="rj-estrelas" id="avaEstrelas" role="radiogroup" aria-label="Nota">
                        ${[1, 2, 3, 4, 5].map(n => `<button type="button" class="rj-estrela" data-n="${n}" role="radio" aria-checked="false" aria-label="${n} ★">★</button>`).join('')}
                    </div>
                    <p class="rj-ava-texto" id="avaTexto">&nbsp;</p>
                </div>
                <div class="rj-field full"><label>Comentário (opcional)</label><textarea id="avaComent" rows="3" maxlength="300" placeholder="Conte como foi a experiência..."></textarea></div>
                <div class="full"><p id="avaErro" class="rj-erro"></p>
                <button type="submit" class="btn-action" style="width:100%">Enviar avaliação</button></div>
            </form>`);

        const $ = id => document.getElementById(id);
        aplicarMascara($('svTel'), mascTel);
        aplicarMascara($('svDoc'), mascDoc);
        aplicarMascara($('svCep'), mascCep);
        $('svUf').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); });

        // Preenche rua/bairro/cidade a partir do CEP (ViaCEP); se falhar, o usuário digita
        $('svCep').addEventListener('blur', async () => {
            const cep = dig($('svCep').value);
            if (cep.length !== 8) return;
            try {
                const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const d = await r.json();
                if (d.erro) return;
                $('svRua').value = d.logradouro || $('svRua').value;
                $('svBairro').value = d.bairro || $('svBairro').value;
                $('svCidade').value = d.localidade || $('svCidade').value;
                $('svUf').value = d.uf || $('svUf').value;
            } catch (e) { /* sem internet: preenchimento manual */ }
        });

        const btnNovo = $('btnNovoServico');
        if (prestador && btnNovo) btnNovo.style.display = 'none';
        if (btnNovo && !prestador) {
            btnNovo.addEventListener('click', () => {
                const p = perfil(), e = ler(CHAVE_END, {});
                $('svTel').value = mascTel(p.telefone || '');
                $('svDoc').value = mascDoc(p.documento || '');
                $('svCep').value = e.cep || ''; $('svRua').value = e.rua || ''; $('svNumero').value = e.numero || '';
                $('svCompl').value = e.complemento || ''; $('svBairro').value = e.bairro || '';
                $('svCidade').value = e.cidade || ''; $('svUf').value = e.uf || '';
                $('svErro').innerText = '';
                mNovo.classList.add('active');
            });
        }

        $('formNovoServico').addEventListener('submit', ev => {
            ev.preventDefault();
            const f = id => $(id).value.trim();
            const erro = m => { $('svErro').innerText = m; };
            if (!f('svNome')) return erro('Informe o nome do serviço.');
            if (dig(f('svTel')).length < 10) return erro('Informe um telefone válido com DDD.');
            if (!validaDoc(f('svDoc'))) return erro('CPF inválido.');
            if (dig(f('svCep')).length !== 8) return erro('Informe um CEP válido.');
            if (!f('svRua') || !f('svNumero') || !f('svCidade') || f('svUf').length !== 2) return erro('Complete o endereço (rua, número, cidade e UF).');

            const endereco = { cep: f('svCep'), rua: f('svRua'), numero: f('svNumero'), complemento: f('svCompl'), bairro: f('svBairro'), cidade: f('svCidade'), uf: f('svUf') };
            const p = perfil();
            salvarPerfil({ telefone: f('svTel'), documento: f('svDoc') });
            localStorage.setItem(CHAVE_END, JSON.stringify(endereco));

            const todos = carregar();
            todos.push({
                id: Date.now(), nome: f('svNome'), categoria: $('svCategoria').value, descricao: f('svDesc'),
                data: new Date().toLocaleDateString('pt-BR'), status: 'Pendente', cliente: nomeLogado,
                clienteDados: { nome: nomeLogado, email: p.email || '', telefone: f('svTel'), documento: f('svDoc'), foto: safeFoto(p.foto) },
                endereco, formaPagamentoPrevista: $('svPagto').value, pagamento: null
            });
            salvar(todos);
            ev.target.reset();
            mNovo.classList.remove('active');
            renderizar(); aoMudar();
            alert('Serviço solicitado com sucesso!');
        });

        // Ações na tabela (delegação de eventos)
        let idPagamento = null;
        $('tabelaServicosBody').addEventListener('click', ev => {
            const btn = ev.target.closest('[data-acao]');
            if (!btn) return;
            const id = Number(btn.dataset.id);
            const acao = btn.dataset.acao;
            const todos = carregar();
            const s = todos.find(x => x.id === id);
            if (!s) return;

            if (acao === 'aceitar') {
                const p = perfil();
                if (!validaDoc(p.documento || '')) {
                    alert('Antes de aceitar, informe seu CPF ou CNPJ em "Meu Perfil".');
                    return;
                }
                s.status = 'Em andamento';
                s.profissional = nomeLogado;
                s.profissionalDados = { id: (ler('usuarioResolveJa', {}) || {}).id || '', nome: nomeLogado, documento: p.documento, telefone: p.telefone || '', foto: safeFoto(p.foto) };
                salvar(todos); renderizar(); aoMudar();
            } else if (acao === 'concluir') {
                idPagamento = id;
                $('pgValor').value = ''; $('pgData').value = hojeISO(); $('pgObs').value = '';
                $('pgForma').value = s.formaPagamentoPrevista || FORMAS[0];
                $('pgErro').innerText = '';
                mPag.classList.add('active');
            } else if (acao === 'avaliar') {
                idAvaliacao = id;
                notaEscolhida = 0;
                const outraParte = prestador ? s.cliente : ((s.profissionalDados || {}).nome || s.profissional || '');
                mAva.querySelector('h2').textContent = prestador ? 'Avaliar cliente' : 'Avaliar serviço';
                $('avaInfo').textContent = `${s.nome} · ${outraParte}`;
                $('avaPergunta').textContent = prestador ? 'Como foi o atendimento com este cliente?' : 'Como foi o serviço e o atendimento do prestador?';
                $('avaComent').value = ''; $('avaErro').textContent = '';
                pintarEstrelas(0);
                mAva.classList.add('active');
            } else if (acao === 'detalhes') {
                const c = s.clienteDados || {}, pr = s.profissionalDados, pg = s.pagamento;
                const linhas = [
                    ['Serviço', s.nome], ['Categoria', s.categoria], ['Descrição', s.descricao || '—'], ['Data', s.data], ['Status', s.status],
                    ['Telefone', c.telefone || '—'], ['E-mail', c.email || '—'], ['CPF do cliente', c.documento || '—'],
                    ['Endereço', enderecoTexto(s.endereco)],
                    ['Pagamento previsto', s.formaPagamentoPrevista || '—'],
                    ['CPF/CNPJ do prestador', pr ? pr.documento : '—'],
                    ['Pagamento', pg ? `${moeda(pg.valor)} via ${pg.forma} em ${dataBR(pg.data)}${pg.obs ? ' (' + pg.obs + ')' : ''}` : 'Ainda não registrado']
                ];
                if (s.status === 'Concluído') {
                    const av = s.avaliacoes || {};
                    const txtAv = a => a ? `${estrelasTxt(a.nota)} ${a.nota}/5${a.comentario ? ' — ' + a.comentario : ''}` : 'Ainda não avaliou';
                    linhas.push(['Avaliação feita pelo cliente', txtAv(av.doCliente)], ['Avaliação feita pelo prestador', txtAv(av.doPrestador)]);
                }
                const pessoa = (titulo, nome, foto, extra, vazio) => `<div class="rj-pessoa">${avatarHtml(nome, foto, 48, vazio)}<div><small>${titulo}</small><strong>${esc(nome)}</strong><span>${esc(extra)}</span></div></div>`;
                $('detalhesPessoas').innerHTML = `<div class="rj-pessoas">${pessoa('Cliente', c.nome || s.cliente, c.foto, c.telefone || '')}${pr ? pessoa('Prestador', pr.nome, pr.foto, pr.telefone || '') : pessoa('Prestador', 'Aguardando aceite', '', '', true)}</div>`;
                $('detalhesCorpo').innerHTML = linhas.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
                mDet.classList.add('active');
            }
        });

        $('formPagamento').addEventListener('submit', ev => {
            ev.preventDefault();
            const valor = parseFloat($('pgValor').value);
            if (!(valor > 0)) { $('pgErro').innerText = 'Informe o valor recebido.'; return; }
            if (!$('pgData').value) { $('pgErro').innerText = 'Informe a data do pagamento.'; return; }
            const todos = carregar();
            const s = todos.find(x => x.id === idPagamento);
            if (!s) return;
            s.status = 'Concluído';
            s.pagamento = { valor, forma: $('pgForma').value, data: $('pgData').value, obs: $('pgObs').value.trim() };
            salvar(todos);
            mPag.classList.remove('active');
            renderizar(); aoMudar();
        });

        let idAvaliacao = null, notaEscolhida = 0;
        function pintarEstrelas(n) {
            mAva.querySelectorAll('.rj-estrela').forEach(b => {
                const ativa = Number(b.dataset.n) <= n;
                b.classList.toggle('on', ativa);
                b.setAttribute('aria-checked', String(Number(b.dataset.n) === notaEscolhida));
            });
            $('avaTexto').textContent = n ? NOMES_NOTA[n - 1] : '\u00a0';
        }
        $('avaEstrelas').addEventListener('click', e => {
            const b = e.target.closest('.rj-estrela');
            if (!b) return;
            notaEscolhida = Number(b.dataset.n);
            pintarEstrelas(notaEscolhida);
        });
        $('avaEstrelas').addEventListener('mouseover', e => {
            const b = e.target.closest('.rj-estrela');
            if (b) pintarEstrelas(Number(b.dataset.n));
        });
        $('avaEstrelas').addEventListener('mouseleave', () => pintarEstrelas(notaEscolhida));

        $('formAvaliar').addEventListener('submit', ev => {
            ev.preventDefault();
            if (!notaEscolhida) { $('avaErro').textContent = 'Escolha uma nota de 1 a 5 estrelas.'; return; }
            const todos = carregar();
            const sv = todos.find(x => x.id === idAvaliacao);
            const chave = prestador ? 'doPrestador' : 'doCliente';
            const permitido = sv && sv.status === 'Concluído' && (prestador ? sv.profissional === nomeLogado : sv.cliente === nomeLogado);
            if (!permitido || (sv.avaliacoes && sv.avaliacoes[chave])) { mAva.classList.remove('active'); return; }
            sv.avaliacoes = sv.avaliacoes || {};
            sv.avaliacoes[chave] = { nota: notaEscolhida, comentario: $('avaComent').value.trim(), data: hojeISO(), por: nomeLogado };
            salvar(todos);
            mAva.classList.remove('active');
            renderizar(); aoMudar();
            alert('Avaliação enviada. Obrigado!');
        });

        function renderizar() {
            const lista = visiveis();
            const tbody = $('tabelaServicosBody');
            if (!lista.length) {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:28px 0;">${prestador ? 'Nenhuma solicitação recebida ainda.' : 'Nenhum serviço encontrado ainda.'}</td></tr>`;
                return;
            }
            tbody.innerHTML = lista.slice().reverse().map(s => {
                const outro = prestador ? { nome: s.cliente, foto: (s.clienteDados || {}).foto, info: s.endereco ? (s.endereco.bairro || s.endereco.cidade) : '' } : (s.profissionalDados ? { nome: s.profissionalDados.nome, foto: s.profissionalDados.foto, info: 'prestador' } : null);
                const sub = outro ? `<div class="rj-outro">${avatarHtml(outro.nome, outro.foto, 24)}<small>${esc(outro.nome)}${outro.info ? ' · ' + esc(outro.info) : ''}</small></div>` : '';
                let acoes = `<button type="button" class="btn-mini btn-mini-info" data-acao="detalhes" data-id="${s.id}">Detalhes</button>`;
                if (prestador && s.status === 'Pendente') acoes += `<button type="button" class="btn-mini btn-mini-accept" data-acao="aceitar" data-id="${s.id}">Aceitar</button>`;
                if (prestador && s.status === 'Em andamento') acoes += `<button type="button" class="btn-mini btn-mini-complete" data-acao="concluir" data-id="${s.id}">Concluir</button>`;
                const minha = (s.avaliacoes || {})[prestador ? 'doPrestador' : 'doCliente'];
                const possoAvaliar = s.status === 'Concluído' && (prestador ? s.profissional === nomeLogado : true);
                if (minha) acoes += `<span class="rj-nota" title="Sua avaliação">${estrelasTxt(minha.nota)}</span>`;
                else if (possoAvaliar) acoes += `<button type="button" class="btn-mini btn-mini-star" data-acao="avaliar" data-id="${s.id}">${prestador ? 'Avaliar cliente' : 'Avaliar serviço'}</button>`;
                return `<tr><td>${esc(s.nome)}${sub}</td><td>${esc(s.categoria)}</td><td>${esc(s.data)}</td><td>${badge(s.status)}</td><td><div class="rj-acoes">${acoes}</div></td></tr>`;
            }).join('');
        }
        renderizar();
        return { renderizar };
    }

    // ---------- Avaliações (guardadas junto do serviço: avaliacoes.doCliente / avaliacoes.doPrestador) ----------
    const NOMES_NOTA = ['Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente'];
    const estrelasTxt = n => '★'.repeat(n) + '☆'.repeat(5 - n);
    // Média das avaliações que EU recebi (prestador: das feitas por clientes; cliente: das feitas por prestadores)
    function resumoAvaliacao() {
        const prest = ehPrestador();
        const notas = carregar()
            .filter(sv => prest ? sv.profissional === nomeLogado : sv.cliente === nomeLogado)
            .map(sv => sv.avaliacoes && (prest ? sv.avaliacoes.doCliente : sv.avaliacoes.doPrestador))
            .filter(Boolean).map(a => a.nota);
        return { total: notas.length, media: notas.length ? notas.reduce((t, n) => t + n, 0) / notas.length : 0 };
    }

    window.RJ = { resumoAvaliacao, estrelasTxt, esc, ler, dig, moeda, dataBR, hojeISO, isoLocal, safeFoto, avatarHtml, pintarAvatar, mascDoc, mascTel, mascCep, aplicarMascara, validaDoc,
        ehPrestador, perfil, salvarPerfil, iniciarSessao, iniciarServicos, visiveis, pagamentos, nomeLogado, FORMAS, CHAVE_PERFIL };
})();