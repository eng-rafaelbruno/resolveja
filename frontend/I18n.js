// =====================================================================
// ResolveJá - tradução (pt-BR / en / es)
// O texto das páginas é escrito em português. Quando o idioma escolhido em
// Configurações é outro, este arquivo troca os textos (e avisos, placeholders)
// pela tradução. Os dados salvos continuam em português.
// Para traduzir um texto novo: adicione uma linha [português, inglês, espanhol].
// =====================================================================
(function () {
    const IDIOMAS = ['pt-BR', 'en', 'es'];
    let cfg = {};
    try { cfg = JSON.parse(localStorage.getItem('configuracoesResolveJa')) || {}; } catch (e) { /* ignora */ }
    const lang = IDIOMAS.includes(cfg.idioma) ? cfg.idioma : 'pt-BR';
    document.documentElement.lang = lang;
    window.I18N = { lang, t: s => s };
    console.info('[ResolveJá] idioma ativo:', lang);
    if (lang === 'pt-BR') return;
    const idx = lang === 'en' ? 1 : 2;

    const TEXTOS = [
        // ---- menu lateral / comum ----
        ['Visão Geral', 'Overview', 'Resumen'],
        ['Meus Serviços', 'My Services', 'Mis Servicios'],
        ['Pagamentos', 'Payments', 'Pagos'],
        ['Meu Perfil', 'My Profile', 'Mi Perfil'],
        ['Configurações', 'Settings', 'Configuración'],
        ['Sair', 'Log out', 'Salir'],
        ['E-mail', 'Email', 'Correo electrónico'],
        ['Senha', 'Password', 'Contraseña'],
        ['© 2026 Resolve Já. Todos os direitos reservados.', '© 2026 Resolve Já. All rights reserved.', '© 2026 Resolve Já. Todos los derechos reservados.'],
        ['© 2026 ResolveJá. Todos os direitos reservados.', '© 2026 ResolveJá. All rights reserved.', '© 2026 ResolveJá. Todos los derechos reservados.'],
        ['Não foi possível conectar ao servidor.', 'Could not connect to the server.', 'No se pudo conectar con el servidor.'],
        ['Sessão expirada. Faça login novamente.', 'Session expired. Please log in again.', 'Sesión expirada. Inicia sesión de nuevo.'],
        ['Preencha todos os campos.', 'Fill in all fields.', 'Completa todos los campos.'],

        // ---- painel ----
        ['Painel - ResolveJá', 'Dashboard - ResolveJá', 'Panel - ResolveJá'],
        ['Olá,', 'Hello,', 'Hola,'],
        ['Aqui está o resumo das suas atividades na ResolveJá.', 'Here is a summary of your activity on ResolveJá.', 'Aquí está el resumen de tu actividad en ResolveJá.'],
        ['Aqui está o resumo dos seus atendimentos na ResolveJá.', 'Here is a summary of your jobs on ResolveJá.', 'Aquí está el resumen de tus atenciones en ResolveJá.'],
        ['Serviços Solicitados', 'Requested Services', 'Servicios Solicitados'],
        ['Ativos no momento', 'Active right now', 'Activos en este momento'],
        ['Concluídos', 'Completed', 'Completados'],
        ['Total histórico', 'All-time total', 'Total histórico'],
        ['Avaliação', 'Rating', 'Valoración'],
        ['Nenhuma avaliação ainda', 'No ratings yet', 'Aún no hay valoraciones'],
        ['Últimos Serviços', 'Latest Services', 'Últimos Servicios'],
        ['+ Novo Serviço', '+ New Service', '+ Nuevo Servicio'],
        ['Serviço', 'Service', 'Servicio'],
        ['Categoria', 'Category', 'Categoría'],
        ['Data', 'Date', 'Fecha'],
        ['Status', 'Status', 'Estado'],
        ['Ações', 'Actions', 'Acciones'],
        ['Nenhum serviço encontrado ainda.', 'No services found yet.', 'Aún no se encontraron servicios.'],
        ['Solicitações Recebidas', 'Requests Received', 'Solicitudes Recibidas'],
        ['Pendentes no momento', 'Pending right now', 'Pendientes en este momento'],
        ['Atendimentos Concluídos', 'Completed Jobs', 'Atenciones Completadas'],
        ['Últimas Solicitações Recebidas', 'Latest Requests Received', 'Últimas Solicitudes Recibidas'],
        ['Nenhuma solicitação recebida ainda.', 'No requests received yet.', 'Aún no se recibieron solicitudes.'],
        ['Pendente', 'Pending', 'Pendiente'],
        ['Em andamento', 'In progress', 'En curso'],
        ['Concluído', 'Completed', 'Completado'],
        ['Detalhes', 'Details', 'Detalles'],
        ['Aceitar', 'Accept', 'Aceptar'],
        ['Concluir', 'Complete', 'Completar'],
        ['Avaliar serviço', 'Rate service', 'Valorar servicio'],
        ['Avaliar cliente', 'Rate customer', 'Valorar cliente'],
        ['Como foi o serviço e o atendimento do prestador?', 'How was the service and the provider’s work?', '¿Cómo fue el servicio y la atención del prestador?'],
        ['Como foi o atendimento com este cliente?', 'How was your experience with this customer?', '¿Cómo fue la atención con este cliente?'],
        ['Comentário (opcional)', 'Comment (optional)', 'Comentario (opcional)'],
        ['Conte como foi a experiência...', 'Tell us how it went...', 'Cuéntanos cómo fue...'],
        ['Enviar avaliação', 'Submit rating', 'Enviar valoración'],
        ['Muito ruim', 'Very bad', 'Muy malo'],
        ['Ruim', 'Bad', 'Malo'],
        ['Regular', 'Fair', 'Regular'],
        ['Bom', 'Good', 'Bueno'],
        ['Excelente', 'Excellent', 'Excelente'],
        ['Nota', 'Rating', 'Nota'],
        ['Sua avaliação', 'Your rating', 'Tu valoración'],
        ['Escolha uma nota de 1 a 5 estrelas.', 'Choose a rating from 1 to 5 stars.', 'Elige una nota de 1 a 5 estrellas.'],
        ['Avaliação enviada. Obrigado!', 'Rating submitted. Thank you!', 'Valoración enviada. ¡Gracias!'],
        ['Avaliação feita pelo cliente', 'Rating by the customer', 'Valoración del cliente'],
        ['Avaliação feita pelo prestador', 'Rating by the provider', 'Valoración del prestador'],
        ['Ainda não avaliou', 'Not rated yet', 'Aún sin valorar'],

        // ---- novo serviço ----
        ['Novo Serviço', 'New Service', 'Nuevo Servicio'],
        ['Nome do serviço', 'Service name', 'Nombre del servicio'],
        ['Ex: Troca de Torneira', 'E.g. Faucet replacement', 'Ej.: Cambio de grifo'],
        ['Elétrica', 'Electrical', 'Eléctrica'],
        ['Hidráulica', 'Plumbing', 'Hidráulica'],
        ['Climatização', 'Air conditioning', 'Climatización'],
        ['Pintura', 'Painting', 'Pintura'],
        ['Limpeza', 'Cleaning', 'Limpieza'],
        ['Outro', 'Other', 'Otro'],
        ['Forma de pagamento prevista', 'Expected payment method', 'Forma de pago prevista'],
        ['Descrição (opcional)', 'Description (optional)', 'Descripción (opcional)'],
        ['Detalhe o que você precisa...', 'Describe what you need...', 'Detalla lo que necesitas...'],
        ['Seus dados', 'Your details', 'Tus datos'],
        ['Telefone', 'Phone', 'Teléfono'],
        ['Telefone / WhatsApp', 'Phone / WhatsApp', 'Teléfono / WhatsApp'],
        ['Telefone / WhatsApp (opcional)', 'Phone / WhatsApp (optional)', 'Teléfono / WhatsApp (opcional)'],
        ['CPF ou CNPJ', 'CPF or CNPJ', 'CPF o CNPJ'],
        ['Endereço onde o serviço será feito', 'Address where the service will be done', 'Dirección donde se realizará el servicio'],
        ['CEP', 'Postal code (CEP)', 'Código postal (CEP)'],
        ['Número', 'Number', 'Número'],
        ['Rua', 'Street', 'Calle'],
        ['Complemento', 'Address line 2', 'Complemento'],
        ['Apto, bloco, referência', 'Apt, block, landmark', 'Apto., bloque, referencia'],
        ['Bairro', 'Neighborhood', 'Barrio'],
        ['Cidade', 'City', 'Ciudad'],
        ['UF', 'State', 'Estado (UF)'],
        ['Solicitar Serviço', 'Request Service', 'Solicitar Servicio'],
        ['Informe o nome do serviço.', 'Enter the service name.', 'Ingresa el nombre del servicio.'],
        ['Informe um telefone válido com DDD.', 'Enter a valid phone number with area code.', 'Ingresa un teléfono válido con código de área.'],
        ['CPF inválido.', 'Invalid CPF.', 'CPF inválido.'],
        ['CPF ou CNPJ inválido.', 'Invalid CPF or CNPJ.', 'CPF o CNPJ inválido.'],
        ['Informe um CEP válido.', 'Enter a valid postal code.', 'Ingresa un código postal válido.'],
        ['Complete o endereço (rua, número, cidade e UF).', 'Complete the address (street, number, city and state).', 'Completa la dirección (calle, número, ciudad y estado).'],
        ['Serviço solicitado com sucesso!', 'Service requested successfully!', '¡Servicio solicitado con éxito!'],

        // ---- pagamento / detalhes ----
        ['Concluir e registrar pagamento', 'Complete and record payment', 'Completar y registrar pago'],
        ['Valor recebido (R$)', 'Amount received (R$)', 'Valor recibido (R$)'],
        ['Forma de pagamento', 'Payment method', 'Forma de pago'],
        ['Data do pagamento', 'Payment date', 'Fecha del pago'],
        ['Observação (opcional)', 'Note (optional)', 'Observación (opcional)'],
        ['Ex: pago metade em dinheiro', 'E.g. paid half in cash', 'Ej.: pagó la mitad en efectivo'],
        ['Concluir serviço', 'Complete service', 'Completar servicio'],
        ['Informe o valor recebido.', 'Enter the amount received.', 'Ingresa el valor recibido.'],
        ['Informe a data do pagamento.', 'Enter the payment date.', 'Ingresa la fecha del pago.'],
        ['Detalhes do serviço', 'Service details', 'Detalles del servicio'],
        ['Descrição', 'Description', 'Descripción'],
        ['CPF do cliente', "Customer's CPF", 'CPF del cliente'],
        ['Endereço', 'Address', 'Dirección'],
        ['Pagamento previsto', 'Expected payment', 'Pago previsto'],
        ['CPF/CNPJ do prestador', "Provider's CPF/CNPJ", 'CPF/CNPJ del prestador'],
        ['Pagamento', 'Payment', 'Pago'],
        ['Cliente', 'Customer', 'Cliente'],
        ['Prestador', 'Provider', 'Prestador'],
        ['Aguardando aceite', 'Awaiting acceptance', 'Esperando aceptación'],
        ['Ainda não registrado', 'Not recorded yet', 'Aún no registrado'],
        ['Antes de aceitar, informe seu CPF ou CNPJ em "Meu Perfil".', 'Before accepting, add your CPF or CNPJ in "My Profile".', 'Antes de aceptar, ingresa tu CPF o CNPJ en "Mi Perfil".'],
        ['Dinheiro', 'Cash', 'Efectivo'],
        ['Cartão de crédito', 'Credit card', 'Tarjeta de crédito'],
        ['Cartão de débito', 'Debit card', 'Tarjeta de débito'],
        ['Transferência bancária', 'Bank transfer', 'Transferencia bancaria'],
        ['Boleto', 'Bank slip (boleto)', 'Boleto bancario'],

        // ---- meus serviços ----
        ['Meus Serviços - ResolveJá', 'My Services - ResolveJá', 'Mis Servicios - ResolveJá'],
        ['Gerencie todos os seus serviços solicitados e histórico.', 'Manage all your requested services and history.', 'Gestiona todos tus servicios solicitados y el historial.'],
        ['Todos os Serviços', 'All Services', 'Todos los Servicios'],
        ['Acompanhe os chamados que os clientes enviaram para você.', 'Follow the requests customers sent you.', 'Sigue las solicitudes que los clientes te enviaron.'],
        ['Todas as Solicitações Recebidas', 'All Requests Received', 'Todas las Solicitudes Recibidas'],

        // ---- pagamentos ----
        ['Pagamentos - ResolveJá', 'Payments - ResolveJá', 'Pagos - ResolveJá'],
        ['Pagamentos recebidos', 'Payments received', 'Pagos recibidos'],
        ['Veja quanto você recebeu pelos serviços concluídos.', 'See how much you received for completed services.', 'Mira cuánto recibiste por los servicios completados.'],
        ['Pagamentos realizados', 'Payments made', 'Pagos realizados'],
        ['Veja quanto você pagou pelos serviços contratados.', 'See how much you paid for the services you hired.', 'Mira cuánto pagaste por los servicios contratados.'],
        ['Todo o período', 'All time', 'Todo el período'],
        ['Este mês', 'This month', 'Este mes'],
        ['Últimos 30 dias', 'Last 30 days', 'Últimos 30 días'],
        ['Este ano', 'This year', 'Este año'],
        ['todo o período', 'all time', 'todo el período'],
        ['este mês', 'this month', 'este mes'],
        ['últimos 30 dias', 'last 30 days', 'últimos 30 días'],
        ['este ano', 'this year', 'este año'],
        ['Total recebido', 'Total received', 'Total recibido'],
        ['Total pago', 'Total paid', 'Total pagado'],
        ['serviços pagos', 'paid services', 'servicios pagados'],
        ['Ticket médio', 'Average ticket', 'Ticket promedio'],
        ['por serviço', 'per service', 'por servicio'],
        ['Forma mais usada', 'Most used method', 'Forma más usada'],
        ['sem pagamentos', 'no payments', 'sin pagos'],
        ['Por forma de pagamento', 'By payment method', 'Por forma de pago'],
        ['Segue o período escolhido acima', 'Follows the period selected above', 'Sigue el período elegido arriba'],
        ['Últimos 6 meses', 'Last 6 months', 'Últimos 6 meses'],
        ['Mostra sempre os 6 meses mais recentes', 'Always shows the 6 most recent months', 'Siempre muestra los 6 meses más recientes'],
        ['Histórico de pagamentos', 'Payment history', 'Historial de pagos'],
        ['Valor', 'Amount', 'Valor'],
        ['Nenhum pagamento neste período.', 'No payments in this period.', 'No hay pagos en este período.'],
        ['Nenhum pagamento registrado neste período.', 'No payments recorded in this period.', 'No hay pagos registrados en este período.'],
        ['Jan', 'Jan', 'Ene'], ['Fev', 'Feb', 'Feb'], ['Abr', 'Apr', 'Abr'], ['Mai', 'May', 'May'],
        ['Ago', 'Aug', 'Ago'], ['Set', 'Sep', 'Sep'], ['Out', 'Oct', 'Oct'], ['Dez', 'Dec', 'Dic'],

        // ---- perfil ----
        ['Meu Perfil - ResolveJá', 'My Profile - ResolveJá', 'Mi Perfil - ResolveJá'],
        ['Visualize e edite suas informações pessoais.', 'View and edit your personal information.', 'Consulta y edita tu información personal.'],
        ['Informações da Conta', 'Account Information', 'Información de la Cuenta'],
        ['Alterar foto', 'Change photo', 'Cambiar foto'],
        ['Remover foto', 'Remove photo', 'Quitar foto'],
        ['Sua foto aparece para o cliente ou prestador do serviço. JPG, PNG ou WebP.', 'Your photo is shown to the customer or provider of the service. JPG, PNG or WebP.', 'Tu foto se muestra al cliente o prestador del servicio. JPG, PNG o WebP.'],
        ['Nome Completo', 'Full Name', 'Nombre Completo'],
        ['Salvar Alterações', 'Save Changes', 'Guardar Cambios'],
        ['Perfil atualizado com sucesso!', 'Profile updated successfully!', '¡Perfil actualizado con éxito!'],
        ['Telefone inválido. Informe o DDD.', 'Invalid phone number. Include the area code.', 'Teléfono inválido. Incluye el código de área.'],
        ['Não foi possível salvar a foto.', 'Could not save the photo.', 'No se pudo guardar la foto.'],
        ['Escolha uma imagem JPG, PNG ou WebP.', 'Choose a JPG, PNG or WebP image.', 'Elige una imagen JPG, PNG o WebP.'],
        ['A imagem é muito grande. Escolha uma de até 8 MB.', 'The image is too large. Choose one up to 8 MB.', 'La imagen es muy grande. Elige una de hasta 8 MB.'],
        ['Não foi possível ler essa imagem.', 'Could not read this image.', 'No se pudo leer esta imagen.'],
        ['Remover sua foto de perfil?', 'Remove your profile photo?', '¿Quitar tu foto de perfil?'],
        ['Imagem inválida ou muito grande.', 'Invalid or too large image.', 'Imagen inválida o demasiado grande.'],
        ['Meus prestadores', 'My providers', 'Mis prestadores'],
        ['Prestadores que atenderam seus serviços. Toque na estrela para favoritar.', 'Providers who handled your services. Tap the star to favorite.', 'Prestadores que atendieron tus servicios. Toca la estrella para marcar como favorito.'],
        ['Quando um prestador aceitar um serviço seu, ele aparece aqui para você favoritar.', 'When a provider accepts one of your services, they will appear here so you can favorite them.', 'Cuando un prestador acepte uno de tus servicios, aparecerá aquí para que lo marques como favorito.'],
        ['Favoritar', 'Favorite', 'Marcar favorito'],
        ['Favorito', 'Favorite', 'Favorito'],
        ['Adicionar aos favoritos', 'Add to favorites', 'Añadir a favoritos'],
        ['Remover dos favoritos', 'Remove from favorites', 'Quitar de favoritos'],
        ['Sem telefone cadastrado', 'No phone on file', 'Sin teléfono registrado'],
        ['Não foi possível atualizar os favoritos.', 'Could not update favorites.', 'No se pudieron actualizar los favoritos.'],
        ['Não foi possível carregar seus favoritos agora.', 'Could not load your favorites right now.', 'No se pudieron cargar tus favoritos ahora.'],
        ['Prestador não encontrado.', 'Provider not found.', 'Prestador no encontrado.'],

        // ---- configurações ----
        ['Configurações - ResolveJá', 'Settings - ResolveJá', 'Configuración - ResolveJá'],
        ['Personalize as preferências da sua conta e do sistema.', 'Customize your account and system preferences.', 'Personaliza las preferencias de tu cuenta y del sistema.'],
        ['Preferências Gerais', 'General Preferences', 'Preferencias Generales'],
        ['Ajuste o idioma do sistema.', 'Choose the system language.', 'Elige el idioma del sistema.'],
        ['Idioma', 'Language', 'Idioma'],
        ['Notificações', 'Notifications', 'Notificaciones'],
        ['Escolha o que você quer receber por e-mail.', 'Choose what you want to receive by email.', 'Elige qué quieres recibir por correo.'],
        ['Novos serviços e atualizações de status', 'New services and status updates', 'Nuevos servicios y cambios de estado'],
        ['Avisos quando o status de um serviço mudar', 'Alerts when a service status changes', 'Avisos cuando cambie el estado de un servicio'],
        ['Promoções e novidades', 'Promotions and news', 'Promociones y novedades'],
        ['Ofertas e novos recursos da ResolveJá', 'Offers and new ResolveJá features', 'Ofertas y nuevas funciones de ResolveJá'],
        ['Notificações no navegador', 'Browser notifications', 'Notificaciones en el navegador'],
        ['Alertas em tempo real enquanto estiver navegando', 'Real-time alerts while you browse', 'Alertas en tiempo real mientras navegas'],
        ['Aparência e Acessibilidade', 'Appearance and Accessibility', 'Apariencia y Accesibilidad'],
        ['Personalize a exibição do painel.', 'Customize how the dashboard looks.', 'Personaliza cómo se ve el panel.'],
        ['Alto contraste', 'High contrast', 'Alto contraste'],
        ['Aumenta o contraste de cores para melhor leitura', 'Increases color contrast for easier reading', 'Aumenta el contraste de colores para leer mejor'],
        ['Modo escuro', 'Dark mode', 'Modo oscuro'],
        ['Usa cores escuras para descansar a vista', 'Uses dark colors to rest your eyes', 'Usa colores oscuros para descansar la vista'],
        ['Modo compacto', 'Compact mode', 'Modo compacto'],
        ['Reduz espaçamentos para ver mais conteúdo na tela', 'Reduces spacing to show more content on screen', 'Reduce los espacios para ver más contenido en pantalla'],
        ['Segurança', 'Security', 'Seguridad'],
        ['Mantenha sua conta protegida com uma senha forte.', 'Keep your account safe with a strong password.', 'Mantén tu cuenta protegida con una contraseña segura.'],
        ['Senha atual', 'Current password', 'Contraseña actual'],
        ['Nova senha', 'New password', 'Nueva contraseña'],
        ['Confirmar nova senha', 'Confirm new password', 'Confirmar nueva contraseña'],
        ['Atualizar Senha', 'Update Password', 'Actualizar Contraseña'],
        ['Zona de Risco', 'Danger Zone', 'Zona de Riesgo'],
        ['Ação permanente — tenha certeza antes de continuar.', 'Permanent action — make sure before continuing.', 'Acción permanente — asegúrate antes de continuar.'],
        ['Excluir minha conta', 'Delete my account', 'Eliminar mi cuenta'],
        ['Remove permanentemente seus dados e histórico da ResolveJá', 'Permanently removes your data and history from ResolveJá', 'Elimina permanentemente tus datos e historial de ResolveJá'],
        ['Excluir Conta', 'Delete Account', 'Eliminar Cuenta'],
        ['Preencha todos os campos de senha.', 'Fill in all password fields.', 'Completa todos los campos de contraseña.'],
        ['A nova senha deve ter pelo menos 6 caracteres.', 'The new password must be at least 6 characters.', 'La nueva contraseña debe tener al menos 6 caracteres.'],
        ['A confirmação não confere com a nova senha.', 'The confirmation does not match the new password.', 'La confirmación no coincide con la nueva contraseña.'],
        ['Senha atualizada com sucesso!', 'Password updated successfully!', '¡Contraseña actualizada con éxito!'],
        ['Senha atual incorreta.', 'Current password is incorrect.', 'La contraseña actual es incorrecta.'],
        ['Não foi possível atualizar a senha.', 'Could not update the password.', 'No se pudo actualizar la contraseña.'],
        ['Erro ao alterar a senha.', 'Error changing the password.', 'Error al cambiar la contraseña.'],
        ['Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.', 'Are you sure you want to delete your account? This cannot be undone.', '¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'],
        ['Conta excluída. Sentiremos sua falta!', 'Account deleted. We will miss you!', 'Cuenta eliminada. ¡Te extrañaremos!'],

        // ---- login / cadastro / esqueci a senha ----
        ['Entrar - Resolve Já', 'Log in - Resolve Já', 'Entrar - Resolve Já'],
        ['Conectando você às melhores soluções rápidas.', 'Connecting you to the best quick solutions.', 'Conectándote con las mejores soluciones rápidas.'],
        ['Acesse seu painel para acompanhar solicitações, gerenciar serviços ou prestar suporte com total agilidade e segurança.', 'Access your dashboard to follow requests, manage services or provide support with speed and security.', 'Accede a tu panel para seguir solicitudes, gestionar servicios o dar soporte con agilidad y seguridad.'],
        ['Bem-vindo de volta', 'Welcome back', 'Bienvenido de nuevo'],
        ['Digite suas credenciais para acessar sua conta.', 'Enter your credentials to access your account.', 'Ingresa tus credenciales para acceder a tu cuenta.'],
        ['Sua senha secreta', 'Your secret password', 'Tu contraseña secreta'],
        ['Lembrar de mim', 'Remember me', 'Recordarme'],
        ['Esqueceu a senha?', 'Forgot your password?', '¿Olvidaste tu contraseña?'],
        ['Entrar na plataforma', 'Log in to the platform', 'Entrar a la plataforma'],
        ['Não tem uma conta?', "Don't have an account?", '¿No tienes una cuenta?'],
        ['Cadastre-se', 'Sign up', 'Regístrate'],
        ['Ocultar', 'Hide', 'Ocultar'],
        ['Informe um e-mail válido.', 'Enter a valid email.', 'Ingresa un correo válido.'],
        ['Digite um e-mail válido.', 'Enter a valid email.', 'Ingresa un correo válido.'],
        ['O campo de e-mail não pode ficar vazio.', 'The email field cannot be empty.', 'El campo de correo no puede estar vacío.'],
        ['Informe sua senha.', 'Enter your password.', 'Ingresa tu contraseña.'],
        ['Informe e-mail e senha.', 'Enter email and password.', 'Ingresa correo y contraseña.'],
        ['Login realizado com sucesso!', 'Logged in successfully!', '¡Sesión iniciada con éxito!'],
        ['E-mail ou senha inválidos.', 'Invalid email or password.', 'Correo o contraseña inválidos.'],
        ['Conta inativa ou bloqueada.', 'Inactive or blocked account.', 'Cuenta inactiva o bloqueada.'],
        ['Erro ao realizar login.', 'Error logging in.', 'Error al iniciar sesión.'],
        ['Cadastro - ResolveJá', 'Sign up - ResolveJá', 'Registro - ResolveJá'],
        ['Faça parte da nossa plataforma.', 'Join our platform.', 'Forma parte de nuestra plataforma.'],
        ['Conectamos você aos melhores serviços de forma rápida, prática e segura. Crie sua conta para começar.', 'We connect you to the best services in a fast, practical and safe way. Create your account to get started.', 'Te conectamos con los mejores servicios de forma rápida, práctica y segura. Crea tu cuenta para comenzar.'],
        ['Criar Conta', 'Create Account', 'Crear Cuenta'],
        ['Preencha os dados abaixo para se cadastrar.', 'Fill in the details below to sign up.', 'Completa los datos a continuación para registrarte.'],
        ['Digite seu nome completo', 'Enter your full name', 'Ingresa tu nombre completo'],
        ['Crie uma senha segura', 'Create a secure password', 'Crea una contraseña segura'],
        ['Tipo de Conta', 'Account Type', 'Tipo de Cuenta'],
        ['Cliente (Quero contratar)', 'Customer (I want to hire)', 'Cliente (Quiero contratar)'],
        ['Profissional (Quero prestar serviços)', 'Professional (I want to offer services)', 'Profesional (Quiero ofrecer servicios)'],
        ['Cadastrar', 'Sign up', 'Registrarme'],
        ['Já tem uma conta?', 'Already have an account?', '¿Ya tienes una cuenta?'],
        ['Faça login', 'Log in', 'Inicia sesión'],
        ['← Voltar para a tela inicial', '← Back to the home page', '← Volver a la página de inicio'],
        ['Preencha seu nome.', 'Enter your name.', 'Ingresa tu nombre.'],
        ['Digite uma senha.', 'Enter a password.', 'Ingresa una contraseña.'],
        ['Informe um CPF ou CNPJ válido.', 'Enter a valid CPF or CNPJ.', 'Ingresa un CPF o CNPJ válido.'],
        ['Informe um CPF válido.', 'Enter a valid CPF.', 'Ingresa un CPF válido.'],
        ['Conta cadastrada com sucesso!', 'Account created successfully!', '¡Cuenta creada con éxito!'],
        ['Cadastro realizado com sucesso!', 'Registration completed successfully!', '¡Registro completado con éxito!'],
        ['Erro ao cadastrar usuário.', 'Error creating the user.', 'Error al crear el usuario.'],
        ['Erro interno ao cadastrar usuário.', 'Internal error creating the user.', 'Error interno al crear el usuario.'],
        ['Este e-mail já está cadastrado.', 'This email is already registered.', 'Este correo ya está registrado.'],
        ['Este CPF/CNPJ já está cadastrado.', 'This CPF/CNPJ is already registered.', 'Este CPF/CNPJ ya está registrado.'],
        ['A senha deve ter pelo menos 6 caracteres.', 'The password must be at least 6 characters.', 'La contraseña debe tener al menos 6 caracteres.'],
        ['ResolveJá - Recuperar Senha', 'ResolveJá - Recover Password', 'ResolveJá - Recuperar Contraseña'],
        ['Redefinir Senha', 'Reset Password', 'Restablecer Contraseña'],
        ['Informe seu e-mail e seu CPF/CNPJ cadastrado para definir uma nova senha.', 'Enter your email and registered CPF/CNPJ to set a new password.', 'Ingresa tu correo y tu CPF/CNPJ registrado para definir una nueva contraseña.'],
        ['Documento usado no cadastro', 'Document used at sign-up', 'Documento usado en el registro'],
        ['Nova Senha', 'New Password', 'Nueva Contraseña'],
        ['Confirmar Nova Senha', 'Confirm New Password', 'Confirmar Nueva Contraseña'],
        ['Digite a nova senha', 'Enter the new password', 'Ingresa la nueva contraseña'],
        ['Confirme a nova senha', 'Confirm the new password', 'Confirma la nueva contraseña'],
        ['Alterar Senha', 'Change Password', 'Cambiar Contraseña'],
        ['Voltar para o login', 'Back to login', 'Volver al inicio de sesión'],
        ['Os dados informados não conferem.', 'The details provided do not match.', 'Los datos ingresados no coinciden.'],
        ['Senha redefinida com sucesso!', 'Password reset successfully!', '¡Contraseña restablecida con éxito!'],
        ['Não foi possível redefinir a senha.', 'Could not reset the password.', 'No se pudo restablecer la contraseña.'],
        ['Erro ao redefinir a senha.', 'Error resetting the password.', 'Error al restablecer la contraseña.'],

        // ---- página inicial ----
        ['ResolveJá - Soluções para você', 'ResolveJá - Solutions for you', 'ResolveJá - Soluciones para ti'],
        ['Início', 'Home', 'Inicio'],
        ['Sobre nós', 'About us', 'Sobre nosotros'],
        ['Serviços', 'Services', 'Servicios'],
        ['Equipe', 'Team', 'Equipo'],
        ['Contato', 'Contact', 'Contacto'],
        ['Login', 'Log in', 'Iniciar sesión'],
        ['SOLUÇÕES INTELIGENTES', 'SMART SOLUTIONS', 'SOLUCIONES INTELIGENTES'],
        ['Resolva seus problemas', 'Solve your problems', 'Resuelve tus problemas'],
        ['de forma simples.', 'the simple way.', 'de forma sencilla.'],
        ['A ResolveJá conecta você às melhores soluções para tornar seu dia mais fácil, rápido e eficiente.', 'ResolveJá connects you to the best solutions to make your day easier, faster and more efficient.', 'ResolveJá te conecta con las mejores soluciones para hacer tu día más fácil, rápido y eficiente.'],
        ['Começar agora', 'Get started', 'Comenzar ahora'],
        ['Conheça a ResolveJá', 'Meet ResolveJá', 'Conoce ResolveJá'],
        ['SOBRE NÓS', 'ABOUT US', 'SOBRE NOSOTROS'],
        ['Simplificando problemas e criando soluções.', 'Simplifying problems and creating solutions.', 'Simplificando problemas y creando soluciones.'],
        ['A ResolveJá nasceu com o objetivo de facilitar a vida das pessoas através de soluções simples, rápidas e eficientes.', 'ResolveJá was born to make people’s lives easier through simple, fast and efficient solutions.', 'ResolveJá nació para facilitar la vida de las personas con soluciones simples, rápidas y eficientes.'],
        ['O QUE FAZEMOS', 'WHAT WE DO', 'QUÉ HACEMOS'],
        ['Soluções para facilitar sua vida', 'Solutions to make your life easier', 'Soluciones para facilitar tu vida'],
        ['Soluções rápidas', 'Quick solutions', 'Soluciones rápidas'],
        ['Encontre soluções práticas para problemas do seu dia a dia.', 'Find practical solutions for your everyday problems.', 'Encuentra soluciones prácticas para tus problemas del día a día.'],
        ['Nossa Equipe de Especialistas', 'Our Team of Specialists', 'Nuestro Equipo de Especialistas'],
        ['Profissionais qualificados prontos para resolver o seu problema com rapidez e segurança.', 'Qualified professionals ready to solve your problem quickly and safely.', 'Profesionales calificados listos para resolver tu problema con rapidez y seguridad.'],
        ['Desenvolvedor de Software', 'Software Developer', 'Desarrollador de Software'],
        ['2 anos de experiência.', '2 years of experience.', '2 años de experiencia.'],
        ['2 anos de experiência', '2 years of experience', '2 años de experiencia'],
        ['A plataforma definitiva para conectar clientes que buscam soluções rápidas a profissionais altamente qualificados.', 'The ultimate platform connecting customers who need quick solutions with highly qualified professionals.', 'La plataforma definitiva para conectar clientes que buscan soluciones rápidas con profesionales altamente calificados.'],
        ['Navegação', 'Navigation', 'Navegación'],
        ['Área do Cliente', 'Customer Area', 'Área del Cliente'],
        ['Suporte', 'Support', 'Soporte'],
        ['Central de Ajuda', 'Help Center', 'Centro de Ayuda'],
        ['Termos de Uso', 'Terms of Use', 'Términos de Uso'],
        ['Política de Privacidade', 'Privacy Policy', 'Política de Privacidad'],
        ['E-mail: contato@resolveja.com', 'Email: contato@resolveja.com', 'Correo: contato@resolveja.com'],
        ['Telefone: (62) 99999-9999', 'Phone: (62) 99999-9999', 'Teléfono: (62) 99999-9999'],
        ['Atendimento: Seg à Sex das 8h às 18h', 'Hours: Mon to Fri, 8am to 6pm', 'Atención: Lun a Vie de 8h a 18h']
    ];

    // Textos com partes variáveis ($1, $2... são trocados pelo trecho capturado, já traduzido)
    const PADROES = [
        [/^(.+) · (\d+) pagamento\(s\)$/, ['$1 · $2 payment(s)', '$1 · $2 pago(s)']],
        [/^(\d+) pagamento\(s\)$/, ['$1 payment(s)', '$1 pago(s)']],
        [/^(\d+) avaliação\(ões\)$/, ['$1 rating(s)', '$1 valoración(es)']],
        [/^(.+) via (.+) em (\d{2}\/\d{2}\/\d{4})(.*)$/, ['$1 via $2 on $3$4', '$1 vía $2 el $3$4']]
    ];

    const norm = s => String(s).replace(/\s+/g, ' ').trim();
    const dic = new Map(TEXTOS.map(l => [norm(l[0]), l[idx]]));

    function tr(texto) {
        const n = norm(texto);
        if (!n) return null;
        if (dic.has(n)) return dic.get(n);
        for (const [re, modelos] of PADROES) {
            const m = n.match(re);
            if (m) return modelos[idx - 1].replace(/\$(\d)/g, (_, i) => (m[i] ? (tr(m[i]) ?? m[i]) : ''));
        }
        return null;
    }
    window.I18N = { lang, t: s => tr(s) ?? s };

    // ---- aplica na página ----
    const feitos = new WeakMap();
    const ATRIBUTOS = ['placeholder', 'title', 'aria-label'];

    function traduzirTexto(no) {
        const v = no.nodeValue;
        if (feitos.get(no) === v) return;
        const r = tr(v);
        if (r === null || r === norm(v)) return;
        const novo = v.match(/^\s*/)[0] + r + v.match(/\s*$/)[0];
        feitos.set(no, novo);
        no.nodeValue = novo;
    }
    function traduzirAtributos(el) {
        ATRIBUTOS.forEach(a => {
            if (!el.hasAttribute || !el.hasAttribute(a)) return;
            const r = tr(el.getAttribute(a));
            if (r !== null) el.setAttribute(a, r);
        });
    }
    function traduzirArvore(raiz) {
        if (raiz.nodeType === 3) {
            if (!/^(SCRIPT|STYLE)$/.test(raiz.parentNode ? raiz.parentNode.nodeName : '')) traduzirTexto(raiz);
            return;
        }
        if (raiz.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(raiz.nodeName)) return;
        traduzirAtributos(raiz);
        raiz.querySelectorAll('[placeholder],[title],[aria-label]').forEach(traduzirAtributos);
        const andador = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
            acceptNode: n => /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        });
        const nos = [];
        while (andador.nextNode()) nos.push(andador.currentNode);
        nos.forEach(traduzirTexto);
    }

    // Alertas e confirmações
    const _alert = window.alert.bind(window);
    const _confirm = window.confirm.bind(window);
    window.alert = m => _alert(window.I18N.t(String(m)));
    window.confirm = m => _confirm(window.I18N.t(String(m)));

    function iniciar() {
        const titulo = tr(document.title);
        if (titulo !== null) document.title = titulo;
        traduzirArvore(document.body);
        // Acompanha o que o JavaScript das páginas escreve depois (tabelas, avisos, janelas)
        new MutationObserver(registros => {
            registros.forEach(r => {
                if (r.type === 'characterData') traduzirTexto(r.target);
                else if (r.type === 'attributes') traduzirAtributos(r.target);
                else r.addedNodes.forEach(traduzirArvore);
            });
        }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATRIBUTOS });
    }
    if (document.body) iniciar(); else document.addEventListener('DOMContentLoaded', iniciar);
})();