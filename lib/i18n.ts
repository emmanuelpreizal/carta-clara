import { LANGUAGES } from "./languages";

export type UiLanguage = "en" | "fr" | "es" | "uk" | "hi" | "zh";

export const DEFAULT_UI_LANGUAGE: UiLanguage = "en";

const DATE_LOCALES: Record<UiLanguage, string> = {
  en: "en-GB",
  fr: "fr-FR",
  es: "es-ES",
  uk: "uk-UA",
  hi: "hi-IN",
  zh: "zh-CN",
};

export function detectUiLanguage(tag: string | undefined): UiLanguage {
  const base = (tag ?? "").split("-")[0].toLowerCase();
  const known = LANGUAGES.some((l) => l.code === base);
  return known ? (base as UiLanguage) : DEFAULT_UI_LANGUAGE;
}

export function formatDate(deadline: string, lang: UiLanguage, withYear = true): string {
  const [y, m, d] = deadline.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(DATE_LOCALES[lang], {
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}

export type Messages = {
  uiBeta: boolean;
  tagline: string;
  audienceBadge: string;
  intro: string;
  steps: [string, string, string];
  yourLetter: string;
  howToAdd: string;
  modeFile: string;
  modeText: string;
  letterText: string;
  placeholder: string;
  hideData: string;
  takePhoto: string;
  photoHint: string;
  preparingFile: string;
  readyToDecode: string;
  remove: string;
  yourPhoto: string;
  explainIn: string;
  decode: string;
  reading: string;
  loading: string;
  nothingStored: string;
  languagesCount: (n: number) => string;
  notLegalAdvice: string;
  goodToKnow: string;
  privacy: string;
  footer: string;
  uiBetaNote: string;
  betaNotice: string;
  errors: {
    needFile: string;
    needText: string;
    tooLong: (max: number) => string;
    pdfTooLarge: (mb: number) => string;
    fileUnopenable: string;
    fileTooLarge: string;
    badFile: string;
    invalidResponse: string;
    aiUnavailable: string;
    generic: string;
    noConnection: string;
    tryAgain: string;
  };
  unreadableTitle: string;
  unreadableHint: string;
  notOfficial: string;
  readFromFile: string;
  preview: {
    title: string;
    example: string;
    urgentReason: string;
    docType: string;
    from: string;
    asWritten: string;
    actions: [string, string, string];
    addToCalendar: string;
  };
  card: {
    urgency: { overdue: string; high: string; medium: string; low: string };
    resultBeta: string;
    from: string;
    deadline: string;
    amount: string;
    inShort: string;
    whatToDo: string;
    keyWords: string;
    toConfirm: string;
    relativeHint: string;
    inTheLetter: string;
    nothingToDo: string;
    daysLeft: (n: number) => string;
    daysOverdue: (n: number) => string;
    today: string;
    calendarTitle: string;
    icsButton: string;
    eventPrefix: string;
    eventAmount: string;
    eventNote: string;
  };
  reply: {
    title: string;
    optional: string;
    onlyUseful: string;
    placeholders: string;
    ownLabel: string;
    update: string;
    translating: string;
    outOfSync: string;
    aiNote: string;
    ptLabel: string;
    copy: string;
    copied: string;
    openEmail: string;
    emailGiven: (email: string) => string;
    noEmail: string;
  };
};

function plural(lang: string, n: number, forms: Partial<Record<Intl.LDMLPluralRule, string>>) {
  const rule = new Intl.PluralRules(lang).select(n);
  return (forms[rule] ?? forms.other ?? "").replace("{n}", String(n));
}

const en: Messages = {
  uiBeta: false,
  tagline: "AI tools that make everyday life simpler.",
  audienceBadge: "For newcomers to Portugal",
  intro:
    "Paste an official Portuguese letter. Understand in seconds what it asks, by when, and what to do.",
  steps: ["Paste or photograph the letter", "Pick your language", "Get what to do and by when"],
  yourLetter: "Your letter",
  howToAdd: "How to add your letter",
  modeFile: "Photo or PDF",
  modeText: "Paste text",
  letterText: "Letter text",
  placeholder: "Paste the text of the letter or email here…",
  hideData: "Hide your name, NIF and address before pasting.",
  takePhoto: "Take a photo or choose a file",
  photoHint: "JPG, PNG or PDF. The whole page, flat, in good light.",
  preparingFile: "Preparing your file…",
  readyToDecode: "Ready to decode.",
  remove: "Remove",
  yourPhoto: "Your photo",
  explainIn: "Explain it in",
  decode: "Decode it",
  reading: "Reading your letter…",
  loading: "Finding the sender, the deadline and what you need to do…",
  nothingStored: "Nothing stored",
  languagesCount: (n) => `${n} languages`,
  notLegalAdvice: "Not legal advice",
  goodToKnow: "Good to know",
  privacy:
    "Not stored by this app. Your text or file is processed by an AI service to produce the result.",
  footer: "This is not legal or tax advice.",
  uiBetaNote: "",
  betaNotice: "beta — not verified by a native speaker",
  errors: {
    needFile: "Take a photo or choose a file first.",
    needText: "Paste the text of a letter first.",
    tooLong: (max) => `This text is too long. Keep it under ${max} characters.`,
    pdfTooLarge: (mb) => `This PDF is too large (max ${mb} MB). Paste the text instead.`,
    fileUnopenable: "This file could not be opened. Use a JPG or PNG photo, a PDF, or paste the text.",
    fileTooLarge: "This file is too large. Try a smaller photo or paste the text.",
    badFile: "This file could not be read. Try another photo or paste the text.",
    invalidResponse: "The AI answer could not be read. Please try again.",
    aiUnavailable: "The AI service is not available right now. Please try again.",
    generic: "Something went wrong. Please try again.",
    noConnection: "No connection. Check your internet and try again.",
    tryAgain: "Try again",
  },
  unreadableTitle: "We could not read this file clearly.",
  unreadableHint: "Take a new photo of the whole page, flat, in good light. Or paste the text instead.",
  notOfficial:
    "This does not look like an official letter. Descodifica works with letters from Portuguese public bodies, like the tax office, social security or the city hall.",
  readFromFile: "Read from your file: compare the dates and amounts with your document.",
  preview: {
    title: "What you will get",
    example: "example",
    urgentReason: "A payment is due soon.",
    docType: "Payment notice",
    from: "From: Tax office (Finanças)",
    asWritten: "as written in the letter",
    actions: [
      "Pay using the reference in the letter.",
      "Keep the receipt.",
      "Contact the office if you think it is a mistake.",
    ],
    addToCalendar: "Add to calendar",
  },
  card: {
    urgency: { overdue: "Overdue", high: "Urgent", medium: "Soon", low: "No rush" },
    resultBeta: "This result language is in beta — not verified by a native speaker.",
    from: "From:",
    deadline: "Deadline",
    amount: "Amount",
    inShort: "In short",
    whatToDo: "What to do",
    keyWords: "Key Portuguese words",
    toConfirm: "To confirm on the original",
    relativeHint:
      "The exact date depends on when you received the letter. Check the date on the envelope or the notification.",
    inTheLetter: "In the letter:",
    nothingToDo: "Nothing to do. You can keep this letter for your records.",
    daysLeft: (n) => plural("en", n, { one: "{n} day left", other: "{n} days left" }),
    daysOverdue: (n) => plural("en", n, { one: "{n} day overdue", other: "{n} days overdue" }),
    today: "today",
    calendarTitle: "Add the deadline to your calendar",
    icsButton: "Apple / Outlook (.ics file, reminder 3 days before)",
    eventPrefix: "Deadline",
    eventAmount: "Amount",
    eventNote:
      "Check the date on the original letter. Created with Descodifica. Not legal or tax advice.",
  },
  reply: {
    title: "Draft reply in Portuguese",
    optional: "optional",
    onlyUseful: "Only useful in this case:",
    placeholders:
      "Replace every part in [brackets] with your own details, for example [NOME] (your name) and [NIF] (your tax number). Send it yourself through the official channel.",
    ownLabel: "1. Your reply in your language — you can edit it",
    update: "Update the Portuguese version",
    translating: "Translating…",
    outOfSync: "You changed your reply. Update the Portuguese version before sending.",
    aiNote: "The AI translates what you write, without adding anything.",
    ptLabel: "Português (Portugal) — this is what you send",
    copy: "Copy the Portuguese text",
    copied: "Copied",
    openEmail: "Open in my email app",
    emailGiven: (email) =>
      `The letter gives this email address for replies: ${email}. Check it on the original before sending.`,
    noEmail:
      "The letter gives no email address. Check how to answer (online portal, post or in person) before sending, and add the address yourself.",
  },
};

const fr: Messages = {
  uiBeta: false,
  tagline: "Des outils d'IA qui simplifient la vie de tous les jours.",
  audienceBadge: "Pour les nouveaux arrivants au Portugal",
  intro:
    "Collez un courrier officiel portugais. Comprenez en quelques secondes ce qu'il demande, pour quand, et quoi faire.",
  steps: ["Collez ou photographiez le courrier", "Choisissez votre langue", "Sachez quoi faire et pour quand"],
  yourLetter: "Votre courrier",
  howToAdd: "Comment ajouter votre courrier",
  modeFile: "Photo ou PDF",
  modeText: "Coller le texte",
  letterText: "Texte du courrier",
  placeholder: "Collez ici le texte du courrier ou de l'email…",
  hideData: "Masquez votre nom, votre NIF et votre adresse avant de coller.",
  takePhoto: "Prendre une photo ou choisir un fichier",
  photoHint: "JPG, PNG ou PDF. Toute la page, à plat, bien éclairée.",
  preparingFile: "Préparation du fichier…",
  readyToDecode: "Prêt à décoder.",
  remove: "Retirer",
  yourPhoto: "Votre photo",
  explainIn: "Expliquer en",
  decode: "Décoder",
  reading: "Lecture du courrier…",
  loading: "Recherche de l'expéditeur, de l'échéance et de ce que vous devez faire…",
  nothingStored: "Rien n'est conservé",
  languagesCount: (n) => `${n} langues`,
  notLegalAdvice: "Pas un conseil juridique",
  goodToKnow: "Bon à savoir",
  privacy:
    "Rien n'est conservé par cette application. Votre texte ou fichier est traité par un service d'IA pour produire le résultat.",
  footer: "Ceci n'est pas un conseil juridique ou fiscal.",
  uiBetaNote: "",
  betaNotice: "beta — non vérifiée par un locuteur natif",
  errors: {
    needFile: "Prenez d'abord une photo ou choisissez un fichier.",
    needText: "Collez d'abord le texte d'un courrier.",
    tooLong: (max) => `Ce texte est trop long. Restez sous ${max} caractères.`,
    pdfTooLarge: (mb) => `Ce PDF est trop lourd (${mb} Mo maximum). Collez plutôt le texte.`,
    fileUnopenable:
      "Ce fichier n'a pas pu être ouvert. Utilisez une photo JPG ou PNG, un PDF, ou collez le texte.",
    fileTooLarge: "Ce fichier est trop lourd. Essayez une photo plus petite ou collez le texte.",
    badFile: "Ce fichier n'a pas pu être lu. Essayez une autre photo ou collez le texte.",
    invalidResponse: "La réponse de l'IA n'a pas pu être lue. Merci de réessayer.",
    aiUnavailable: "Le service d'IA n'est pas disponible pour le moment. Merci de réessayer.",
    generic: "Une erreur est survenue. Merci de réessayer.",
    noConnection: "Pas de connexion. Vérifiez internet et réessayez.",
    tryAgain: "Réessayer",
  },
  unreadableTitle: "Nous n'avons pas pu lire ce fichier clairement.",
  unreadableHint:
    "Reprenez une photo de toute la page, à plat, bien éclairée. Ou collez plutôt le texte.",
  notOfficial:
    "Cela ne ressemble pas à un courrier officiel. Descodifica fonctionne avec les courriers des organismes publics portugais, comme les impôts, la sécurité sociale ou la mairie.",
  readFromFile: "Lu depuis votre fichier : comparez les dates et les montants avec votre document.",
  preview: {
    title: "Ce que vous obtiendrez",
    example: "exemple",
    urgentReason: "Un paiement arrive bientôt à échéance.",
    docType: "Avis de paiement",
    from: "De : Impôts (Finanças)",
    asWritten: "tel qu'écrit dans le courrier",
    actions: [
      "Payez avec la référence indiquée dans le courrier.",
      "Gardez le reçu.",
      "Contactez le service si vous pensez qu'il y a une erreur.",
    ],
    addToCalendar: "Ajouter à l'agenda",
  },
  card: {
    urgency: { overdue: "En retard", high: "Urgent", medium: "Bientôt", low: "Pas pressé" },
    resultBeta: "Cette langue de résultat est en beta — non vérifiée par un locuteur natif.",
    from: "De :",
    deadline: "Échéance",
    amount: "Montant",
    inShort: "En bref",
    whatToDo: "Que faire",
    keyWords: "Mots portugais importants",
    toConfirm: "À vérifier sur l'original",
    relativeHint:
      "La date exacte dépend du jour où vous avez reçu le courrier. Vérifiez la date sur l'enveloppe ou la notification.",
    inTheLetter: "Dans le courrier :",
    nothingToDo: "Rien à faire. Vous pouvez garder ce courrier dans vos papiers.",
    daysLeft: (n) => plural("fr", n, { one: "{n} jour restant", other: "{n} jours restants" }),
    daysOverdue: (n) => plural("fr", n, { one: "{n} jour de retard", other: "{n} jours de retard" }),
    today: "aujourd'hui",
    calendarTitle: "Ajouter l'échéance à votre agenda",
    icsButton: "Apple / Outlook (fichier .ics, rappel 3 jours avant)",
    eventPrefix: "Échéance",
    eventAmount: "Montant",
    eventNote:
      "Vérifiez la date sur le courrier original. Créé avec Descodifica. Pas un conseil juridique ou fiscal.",
  },
  reply: {
    title: "Brouillon de réponse en portugais",
    optional: "facultatif",
    onlyUseful: "Utile seulement dans ce cas :",
    placeholders:
      "Remplacez chaque partie entre [crochets] par vos informations, par exemple [NOME] (votre nom) et [NIF] (votre numéro fiscal). Envoyez-le vous-même par le canal officiel.",
    ownLabel: "1. Votre réponse dans votre langue — vous pouvez la modifier",
    update: "Mettre à jour la version portugaise",
    translating: "Traduction…",
    outOfSync:
      "Vous avez modifié votre réponse. Mettez à jour la version portugaise avant d'envoyer.",
    aiNote: "L'IA traduit ce que vous écrivez, sans rien ajouter.",
    ptLabel: "Português (Portugal) — c'est ce que vous envoyez",
    copy: "Copier le texte portugais",
    copied: "Copié",
    openEmail: "Ouvrir dans ma messagerie",
    emailGiven: (email) =>
      `Le courrier donne cette adresse email pour répondre : ${email}. Vérifiez-la sur l'original avant d'envoyer.`,
    noEmail:
      "Le courrier ne donne pas d'adresse email. Vérifiez comment répondre (portail en ligne, courrier ou sur place) avant d'envoyer, et ajoutez l'adresse vous-même.",
  },
};

const es: Messages = {
  uiBeta: true,
  tagline: "Herramientas de IA que simplifican el día a día.",
  audienceBadge: "Para recién llegados a Portugal",
  intro:
    "Pega una carta oficial portuguesa. Entiende en segundos qué pide, para cuándo y qué hacer.",
  steps: ["Pega o fotografía la carta", "Elige tu idioma", "Descubre qué hacer y para cuándo"],
  yourLetter: "Tu carta",
  howToAdd: "Cómo añadir tu carta",
  modeFile: "Foto o PDF",
  modeText: "Pegar texto",
  letterText: "Texto de la carta",
  placeholder: "Pega aquí el texto de la carta o del correo…",
  hideData: "Oculta tu nombre, NIF y dirección antes de pegar.",
  takePhoto: "Hacer una foto o elegir un archivo",
  photoHint: "JPG, PNG o PDF. La página entera, plana y con buena luz.",
  preparingFile: "Preparando el archivo…",
  readyToDecode: "Listo para descodificar.",
  remove: "Quitar",
  yourPhoto: "Tu foto",
  explainIn: "Explicar en",
  decode: "Descodificar",
  reading: "Leyendo tu carta…",
  loading: "Buscando el remitente, el plazo y lo que tienes que hacer…",
  nothingStored: "No se guarda nada",
  languagesCount: (n) => `${n} idiomas`,
  notLegalAdvice: "No es asesoría legal",
  goodToKnow: "Bueno saber",
  privacy:
    "Esta aplicación no guarda nada. Tu texto o archivo lo procesa un servicio de IA para producir el resultado.",
  footer: "Esto no es asesoría legal ni fiscal.",
  uiBetaNote: "Interfaz traducida automáticamente (beta).",
  betaNotice: "beta — no verificado por un hablante nativo",
  errors: {
    needFile: "Primero haz una foto o elige un archivo.",
    needText: "Primero pega el texto de una carta.",
    tooLong: (max) => `Este texto es demasiado largo. Máximo ${max} caracteres.`,
    pdfTooLarge: (mb) => `Este PDF es demasiado grande (máximo ${mb} MB). Pega el texto en su lugar.`,
    fileUnopenable: "No se pudo abrir este archivo. Usa una foto JPG o PNG, un PDF o pega el texto.",
    fileTooLarge: "Este archivo es demasiado grande. Prueba con una foto más pequeña o pega el texto.",
    badFile: "No se pudo leer este archivo. Prueba con otra foto o pega el texto.",
    invalidResponse: "No se pudo leer la respuesta de la IA. Inténtalo de nuevo.",
    aiUnavailable: "El servicio de IA no está disponible ahora. Inténtalo de nuevo.",
    generic: "Algo ha fallado. Inténtalo de nuevo.",
    noConnection: "Sin conexión. Revisa internet e inténtalo de nuevo.",
    tryAgain: "Reintentar",
  },
  unreadableTitle: "No hemos podido leer bien este archivo.",
  unreadableHint:
    "Haz una nueva foto de la página entera, plana y con buena luz. O pega el texto.",
  notOfficial:
    "Esto no parece una carta oficial. Descodifica funciona con cartas de organismos públicos portugueses, como Hacienda, la Seguridad Social o el ayuntamiento.",
  readFromFile: "Leído de tu archivo: compara las fechas y los importes con tu documento.",
  preview: {
    title: "Lo que obtendrás",
    example: "ejemplo",
    urgentReason: "Hay un pago que vence pronto.",
    docType: "Aviso de pago",
    from: "De: Hacienda (Finanças)",
    asWritten: "tal como aparece en la carta",
    actions: [
      "Paga con la referencia de la carta.",
      "Guarda el recibo.",
      "Contacta con la oficina si crees que es un error.",
    ],
    addToCalendar: "Añadir al calendario",
  },
  card: {
    urgency: { overdue: "Vencido", high: "Urgente", medium: "Pronto", low: "Sin prisa" },
    resultBeta: "Este idioma de resultado está en beta — no verificado por un hablante nativo.",
    from: "De:",
    deadline: "Plazo",
    amount: "Importe",
    inShort: "En resumen",
    whatToDo: "Qué hacer",
    keyWords: "Palabras portuguesas clave",
    toConfirm: "Comprobar en el original",
    relativeHint:
      "La fecha exacta depende de cuándo recibiste la carta. Comprueba la fecha en el sobre o en la notificación.",
    inTheLetter: "En la carta:",
    nothingToDo: "No hay que hacer nada. Puedes guardar esta carta.",
    daysLeft: (n) => plural("es", n, { one: "queda {n} día", other: "quedan {n} días" }),
    daysOverdue: (n) => plural("es", n, { one: "{n} día de retraso", other: "{n} días de retraso" }),
    today: "hoy",
    calendarTitle: "Añade el plazo a tu calendario",
    icsButton: "Apple / Outlook (archivo .ics, aviso 3 días antes)",
    eventPrefix: "Plazo",
    eventAmount: "Importe",
    eventNote:
      "Comprueba la fecha en la carta original. Creado con Descodifica. No es asesoría legal ni fiscal.",
  },
  reply: {
    title: "Borrador de respuesta en portugués",
    optional: "opcional",
    onlyUseful: "Solo útil en este caso:",
    placeholders:
      "Sustituye cada parte entre [corchetes] por tus datos, por ejemplo [NOME] (tu nombre) y [NIF] (tu número fiscal). Envíala tú mismo por el canal oficial.",
    ownLabel: "1. Tu respuesta en tu idioma — puedes editarla",
    update: "Actualizar la versión en portugués",
    translating: "Traduciendo…",
    outOfSync: "Has cambiado tu respuesta. Actualiza la versión en portugués antes de enviarla.",
    aiNote: "La IA traduce lo que escribes, sin añadir nada.",
    ptLabel: "Português (Portugal) — esto es lo que envías",
    copy: "Copiar el texto en portugués",
    copied: "Copiado",
    openEmail: "Abrir en mi correo",
    emailGiven: (email) =>
      `La carta indica esta dirección para responder: ${email}. Compruébala en el original antes de enviar.`,
    noEmail:
      "La carta no indica ninguna dirección de correo. Comprueba cómo responder (portal en línea, correo postal o en persona) antes de enviar, y añade tú la dirección.",
  },
};

const uk: Messages = {
  uiBeta: true,
  tagline: "Інструменти ШІ, які спрощують повсякденне життя.",
  audienceBadge: "Для тих, хто нещодавно переїхав до Португалії",
  intro:
    "Вставте офіційний португальський лист. За кілька секунд зрозумійте, що в ньому просять, до якого терміну і що робити.",
  steps: ["Вставте або сфотографуйте лист", "Оберіть мову", "Дізнайтеся, що робити і до коли"],
  yourLetter: "Ваш лист",
  howToAdd: "Як додати лист",
  modeFile: "Фото або PDF",
  modeText: "Вставити текст",
  letterText: "Текст листа",
  placeholder: "Вставте сюди текст листа або електронного листа…",
  hideData: "Приховайте ім'я, NIF і адресу перед вставленням.",
  takePhoto: "Зробити фото або вибрати файл",
  photoHint: "JPG, PNG або PDF. Уся сторінка, рівно, при доброму світлі.",
  preparingFile: "Готуємо файл…",
  readyToDecode: "Готово до розшифрування.",
  remove: "Видалити",
  yourPhoto: "Ваше фото",
  explainIn: "Пояснити мовою",
  decode: "Розшифрувати",
  reading: "Читаємо ваш лист…",
  loading: "Шукаємо відправника, термін і що вам потрібно зробити…",
  nothingStored: "Нічого не зберігається",
  languagesCount: (n) => `${n} мов`,
  notLegalAdvice: "Не юридична порада",
  goodToKnow: "Корисно знати",
  privacy:
    "Цей застосунок нічого не зберігає. Ваш текст або файл обробляє сервіс ШІ, щоб отримати результат.",
  footer: "Це не юридична і не податкова порада.",
  uiBetaNote: "Інтерфейс перекладено автоматично (бета).",
  betaNotice: "бета — не перевірено носієм мови",
  errors: {
    needFile: "Спочатку зробіть фото або виберіть файл.",
    needText: "Спочатку вставте текст листа.",
    tooLong: (max) => `Текст задовгий. Не більше ${max} символів.`,
    pdfTooLarge: (mb) => `Цей PDF завеликий (максимум ${mb} МБ). Вставте текст замість нього.`,
    fileUnopenable: "Не вдалося відкрити файл. Використайте фото JPG або PNG, PDF або вставте текст.",
    fileTooLarge: "Файл завеликий. Спробуйте менше фото або вставте текст.",
    badFile: "Не вдалося прочитати файл. Спробуйте інше фото або вставте текст.",
    invalidResponse: "Не вдалося прочитати відповідь ШІ. Спробуйте ще раз.",
    aiUnavailable: "Сервіс ШІ зараз недоступний. Спробуйте ще раз.",
    generic: "Щось пішло не так. Спробуйте ще раз.",
    noConnection: "Немає з'єднання. Перевірте інтернет і спробуйте ще раз.",
    tryAgain: "Спробувати ще раз",
  },
  unreadableTitle: "Не вдалося чітко прочитати цей файл.",
  unreadableHint:
    "Сфотографуйте всю сторінку ще раз, рівно, при доброму світлі. Або вставте текст.",
  notOfficial:
    "Це не схоже на офіційний лист. Descodifica працює з листами від португальських державних установ, наприклад податкової, соціального страхування або мерії.",
  readFromFile: "Прочитано з вашого файлу: порівняйте дати й суми з документом.",
  preview: {
    title: "Що ви отримаєте",
    example: "приклад",
    urgentReason: "Незабаром термін оплати.",
    docType: "Повідомлення про оплату",
    from: "Від: податкова (Finanças)",
    asWritten: "як написано в листі",
    actions: [
      "Сплатіть за реквізитами з листа.",
      "Збережіть квитанцію.",
      "Зверніться до установи, якщо вважаєте, що це помилка.",
    ],
    addToCalendar: "Додати в календар",
  },
  card: {
    urgency: { overdue: "Прострочено", high: "Терміново", medium: "Незабаром", low: "Не терміново" },
    resultBeta: "Ця мова результату в бета-версії — не перевірено носієм мови.",
    from: "Від:",
    deadline: "Термін",
    amount: "Сума",
    inShort: "Коротко",
    whatToDo: "Що робити",
    keyWords: "Важливі португальські слова",
    toConfirm: "Перевірте в оригіналі",
    relativeHint:
      "Точна дата залежить від того, коли ви отримали лист. Перевірте дату на конверті або в повідомленні.",
    inTheLetter: "У листі:",
    nothingToDo: "Нічого робити не потрібно. Можете зберегти цей лист.",
    daysLeft: (n) =>
      plural("uk", n, {
        one: "залишився {n} день",
        few: "залишилося {n} дні",
        many: "залишилося {n} днів",
        other: "залишилося {n} дня",
      }),
    daysOverdue: (n) =>
      plural("uk", n, {
        one: "прострочено на {n} день",
        few: "прострочено на {n} дні",
        many: "прострочено на {n} днів",
        other: "прострочено на {n} дня",
      }),
    today: "сьогодні",
    calendarTitle: "Додайте термін у календар",
    icsButton: "Apple / Outlook (файл .ics, нагадування за 3 дні)",
    eventPrefix: "Термін",
    eventAmount: "Сума",
    eventNote:
      "Перевірте дату в оригіналі листа. Створено в Descodifica. Не юридична і не податкова порада.",
  },
  reply: {
    title: "Чернетка відповіді португальською",
    optional: "необов'язково",
    onlyUseful: "Корисно лише в такому випадку:",
    placeholders:
      "Замініть кожну частину в [дужках] своїми даними, наприклад [NOME] (ваше ім'я) і [NIF] (ваш податковий номер). Надішліть самостійно через офіційний канал.",
    ownLabel: "1. Ваша відповідь вашою мовою — її можна змінити",
    update: "Оновити португальську версію",
    translating: "Перекладаємо…",
    outOfSync: "Ви змінили відповідь. Оновіть португальську версію перед надсиланням.",
    aiNote: "ШІ перекладає те, що ви пишете, нічого не додаючи.",
    ptLabel: "Português (Portugal) — це ви надсилаєте",
    copy: "Копіювати португальський текст",
    copied: "Скопійовано",
    openEmail: "Відкрити в моїй пошті",
    emailGiven: (email) =>
      `У листі вказано адресу для відповіді: ${email}. Перевірте її в оригіналі перед надсиланням.`,
    noEmail:
      "У листі немає адреси електронної пошти. Перевірте, як відповісти (онлайн-портал, пошта або особисто), і додайте адресу самостійно.",
  },
};

const hi: Messages = {
  uiBeta: true,
  tagline: "एआई टूल जो रोज़मर्रा की ज़िंदगी आसान बनाते हैं।",
  audienceBadge: "पुर्तगाल में नए आए लोगों के लिए",
  intro:
    "पुर्तगाल का कोई सरकारी पत्र चिपकाएँ। कुछ ही सेकंड में समझें कि उसमें क्या माँगा गया है, कब तक, और क्या करना है।",
  steps: ["पत्र चिपकाएँ या उसकी फ़ोटो लें", "अपनी भाषा चुनें", "जानें क्या करना है और कब तक"],
  yourLetter: "आपका पत्र",
  howToAdd: "पत्र कैसे जोड़ें",
  modeFile: "फ़ोटो या PDF",
  modeText: "टेक्स्ट चिपकाएँ",
  letterText: "पत्र का टेक्स्ट",
  placeholder: "पत्र या ईमेल का टेक्स्ट यहाँ चिपकाएँ…",
  hideData: "चिपकाने से पहले अपना नाम, NIF और पता छिपा दें।",
  takePhoto: "फ़ोटो लें या फ़ाइल चुनें",
  photoHint: "JPG, PNG या PDF। पूरा पन्ना, सीधा, अच्छी रोशनी में।",
  preparingFile: "फ़ाइल तैयार हो रही है…",
  readyToDecode: "पढ़ने के लिए तैयार।",
  remove: "हटाएँ",
  yourPhoto: "आपकी फ़ोटो",
  explainIn: "इस भाषा में समझाएँ",
  decode: "समझाएँ",
  reading: "आपका पत्र पढ़ा जा रहा है…",
  loading: "भेजने वाला, समय-सीमा और आपको क्या करना है, ढूँढ़ा जा रहा है…",
  nothingStored: "कुछ भी सेव नहीं होता",
  languagesCount: (n) => `${n} भाषाएँ`,
  notLegalAdvice: "कानूनी सलाह नहीं",
  goodToKnow: "जानना ज़रूरी",
  privacy:
    "यह ऐप कुछ भी सेव नहीं करता। नतीजा बनाने के लिए आपका टेक्स्ट या फ़ाइल एक एआई सेवा द्वारा प्रोसेस की जाती है।",
  footer: "यह कानूनी या टैक्स सलाह नहीं है।",
  uiBetaNote: "इंटरफ़ेस का अनुवाद अपने-आप हुआ है (बीटा)।",
  betaNotice: "बीटा — मूल भाषी द्वारा जाँचा नहीं गया",
  errors: {
    needFile: "पहले फ़ोटो लें या फ़ाइल चुनें।",
    needText: "पहले किसी पत्र का टेक्स्ट चिपकाएँ।",
    tooLong: (max) => `यह टेक्स्ट बहुत लंबा है। ${max} अक्षरों से कम रखें।`,
    pdfTooLarge: (mb) => `यह PDF बहुत बड़ी है (अधिकतम ${mb} MB)। इसके बजाय टेक्स्ट चिपकाएँ।`,
    fileUnopenable: "यह फ़ाइल नहीं खुल सकी। JPG या PNG फ़ोटो, PDF इस्तेमाल करें, या टेक्स्ट चिपकाएँ।",
    fileTooLarge: "यह फ़ाइल बहुत बड़ी है। छोटी फ़ोटो आज़माएँ या टेक्स्ट चिपकाएँ।",
    badFile: "यह फ़ाइल पढ़ी नहीं जा सकी। दूसरी फ़ोटो आज़माएँ या टेक्स्ट चिपकाएँ।",
    invalidResponse: "एआई का जवाब पढ़ा नहीं जा सका। कृपया फिर से कोशिश करें।",
    aiUnavailable: "एआई सेवा अभी उपलब्ध नहीं है। कृपया फिर से कोशिश करें।",
    generic: "कुछ गड़बड़ हो गई। कृपया फिर से कोशिश करें।",
    noConnection: "इंटरनेट कनेक्शन नहीं है। जाँचें और फिर से कोशिश करें।",
    tryAgain: "फिर से कोशिश करें",
  },
  unreadableTitle: "हम यह फ़ाइल साफ़-साफ़ नहीं पढ़ सके।",
  unreadableHint: "पूरे पन्ने की नई फ़ोटो लें, सीधी और अच्छी रोशनी में। या टेक्स्ट चिपकाएँ।",
  notOfficial:
    "यह सरकारी पत्र नहीं लगता। Descodifica पुर्तगाली सरकारी संस्थाओं, जैसे टैक्स ऑफ़िस, सोशल सिक्योरिटी या नगर निगम, के पत्रों के साथ काम करता है।",
  readFromFile: "आपकी फ़ाइल से पढ़ा गया: तारीख़ें और रकम अपने दस्तावेज़ से मिलाएँ।",
  preview: {
    title: "आपको क्या मिलेगा",
    example: "उदाहरण",
    urgentReason: "जल्द ही भुगतान करना है।",
    docType: "भुगतान सूचना",
    from: "भेजने वाला: टैक्स ऑफ़िस (Finanças)",
    asWritten: "जैसा पत्र में लिखा है",
    actions: [
      "पत्र में दिए संदर्भ नंबर से भुगतान करें।",
      "रसीद संभाल कर रखें।",
      "अगर आपको लगता है कि गलती है तो दफ़्तर से संपर्क करें।",
    ],
    addToCalendar: "कैलेंडर में जोड़ें",
  },
  card: {
    urgency: { overdue: "समय निकल गया", high: "ज़रूरी", medium: "जल्द", low: "जल्दी नहीं" },
    resultBeta: "नतीजे की यह भाषा बीटा में है — मूल भाषी द्वारा जाँची नहीं गई।",
    from: "भेजने वाला:",
    deadline: "समय-सीमा",
    amount: "रकम",
    inShort: "संक्षेप में",
    whatToDo: "क्या करना है",
    keyWords: "ज़रूरी पुर्तगाली शब्द",
    toConfirm: "मूल पत्र में जाँचें",
    relativeHint:
      "सही तारीख़ इस पर निर्भर है कि आपको पत्र कब मिला। लिफ़ाफ़े या सूचना पर तारीख़ देखें।",
    inTheLetter: "पत्र में:",
    nothingToDo: "कुछ करने की ज़रूरत नहीं। आप यह पत्र अपने रिकॉर्ड के लिए रख सकते हैं।",
    daysLeft: (n) => `${n} दिन बाकी`,
    daysOverdue: (n) => `${n} दिन की देरी`,
    today: "आज",
    calendarTitle: "समय-सीमा अपने कैलेंडर में जोड़ें",
    icsButton: "Apple / Outlook (.ics फ़ाइल, 3 दिन पहले याद दिलाएगा)",
    eventPrefix: "समय-सीमा",
    eventAmount: "रकम",
    eventNote:
      "मूल पत्र में तारीख़ जाँचें। Descodifica से बनाया गया। कानूनी या टैक्स सलाह नहीं।",
  },
  reply: {
    title: "पुर्तगाली में जवाब का मसौदा",
    optional: "वैकल्पिक",
    onlyUseful: "सिर्फ़ इस स्थिति में उपयोगी:",
    placeholders:
      "[कोष्ठक] वाले हर हिस्से को अपनी जानकारी से बदलें, जैसे [NOME] (आपका नाम) और [NIF] (आपका टैक्स नंबर)। इसे खुद आधिकारिक माध्यम से भेजें।",
    ownLabel: "1. आपकी भाषा में आपका जवाब — आप इसे बदल सकते हैं",
    update: "पुर्तगाली संस्करण अपडेट करें",
    translating: "अनुवाद हो रहा है…",
    outOfSync: "आपने जवाब बदला है। भेजने से पहले पुर्तगाली संस्करण अपडेट करें।",
    aiNote: "एआई वही अनुवाद करता है जो आप लिखते हैं, कुछ जोड़े बिना।",
    ptLabel: "Português (Portugal) — यही आप भेजेंगे",
    copy: "पुर्तगाली टेक्स्ट कॉपी करें",
    copied: "कॉपी हो गया",
    openEmail: "मेरे ईमेल ऐप में खोलें",
    emailGiven: (email) =>
      `पत्र में जवाब के लिए यह ईमेल पता दिया गया है: ${email}। भेजने से पहले मूल पत्र में जाँच लें।`,
    noEmail:
      "पत्र में कोई ईमेल पता नहीं दिया गया है। भेजने से पहले देखें कि जवाब कैसे देना है (ऑनलाइन पोर्टल, डाक या खुद जाकर), और पता खुद जोड़ें।",
  },
};

const zh: Messages = {
  uiBeta: true,
  tagline: "让日常生活更简单的人工智能工具。",
  audienceBadge: "为刚到葡萄牙的人而设计",
  intro: "粘贴一封葡萄牙官方信件。几秒钟内了解它要求什么、截止日期以及该怎么做。",
  steps: ["粘贴或拍摄信件", "选择你的语言", "了解该做什么以及截止时间"],
  yourLetter: "你的信件",
  howToAdd: "如何添加信件",
  modeFile: "照片或 PDF",
  modeText: "粘贴文字",
  letterText: "信件文字",
  placeholder: "在此粘贴信件或邮件的文字…",
  hideData: "粘贴前请隐藏你的姓名、税号（NIF）和地址。",
  takePhoto: "拍照或选择文件",
  photoHint: "JPG、PNG 或 PDF。整页、平放、光线充足。",
  preparingFile: "正在准备文件…",
  readyToDecode: "可以开始解读。",
  remove: "移除",
  yourPhoto: "你的照片",
  explainIn: "解释语言",
  decode: "解读",
  reading: "正在阅读你的信件…",
  loading: "正在查找发件机构、截止日期以及你需要做的事…",
  nothingStored: "不保存任何内容",
  languagesCount: (n) => `${n} 种语言`,
  notLegalAdvice: "非法律建议",
  goodToKnow: "须知",
  privacy: "本应用不保存任何内容。你的文字或文件由人工智能服务处理以生成结果。",
  footer: "本内容不构成法律或税务建议。",
  uiBetaNote: "界面为自动翻译（测试版）。",
  betaNotice: "测试版 — 未经母语人士核对",
  errors: {
    needFile: "请先拍照或选择文件。",
    needText: "请先粘贴信件文字。",
    tooLong: (max) => `文字太长。请控制在 ${max} 个字符以内。`,
    pdfTooLarge: (mb) => `该 PDF 太大（最大 ${mb} MB）。请改为粘贴文字。`,
    fileUnopenable: "无法打开该文件。请使用 JPG 或 PNG 照片、PDF，或粘贴文字。",
    fileTooLarge: "文件太大。请尝试更小的照片或粘贴文字。",
    badFile: "无法读取该文件。请换一张照片或粘贴文字。",
    invalidResponse: "无法读取人工智能的回复。请重试。",
    aiUnavailable: "人工智能服务暂时不可用。请重试。",
    generic: "出现了问题。请重试。",
    noConnection: "没有网络连接。请检查网络后重试。",
    tryAgain: "重试",
  },
  unreadableTitle: "我们无法清楚地读取该文件。",
  unreadableHint: "请重新拍摄整页，平放、光线充足。或者改为粘贴文字。",
  notOfficial:
    "这看起来不像官方信件。Descodifica 适用于葡萄牙公共机构的信件，例如税务局、社会保障局或市政厅。",
  readFromFile: "从你的文件中读取：请将日期和金额与原件核对。",
  preview: {
    title: "你将得到",
    example: "示例",
    urgentReason: "一笔款项即将到期。",
    docType: "缴款通知",
    from: "发件机构：税务局（Finanças）",
    asWritten: "与信中所写一致",
    actions: ["使用信中的参考号付款。", "保留收据。", "如果你认为有误，请联系该机构。"],
    addToCalendar: "添加到日历",
  },
  card: {
    urgency: { overdue: "已逾期", high: "紧急", medium: "即将到期", low: "不急" },
    resultBeta: "此结果语言为测试版 — 未经母语人士核对。",
    from: "发件机构：",
    deadline: "截止日期",
    amount: "金额",
    inShort: "简要说明",
    whatToDo: "该做什么",
    keyWords: "重要葡萄牙语词汇",
    toConfirm: "请在原件上核对",
    relativeHint: "具体日期取决于你收到信件的时间。请查看信封或通知上的日期。",
    inTheLetter: "信中原文：",
    nothingToDo: "无需任何操作。你可以保存这封信备查。",
    daysLeft: (n) => `还剩 ${n} 天`,
    daysOverdue: (n) => `已逾期 ${n} 天`,
    today: "今天截止",
    calendarTitle: "将截止日期添加到日历",
    icsButton: "Apple / Outlook（.ics 文件，提前 3 天提醒）",
    eventPrefix: "截止日期",
    eventAmount: "金额",
    eventNote: "请在原始信件上核对日期。由 Descodifica 创建。不构成法律或税务建议。",
  },
  reply: {
    title: "葡萄牙语回复草稿",
    optional: "可选",
    onlyUseful: "仅在以下情况下有用：",
    placeholders:
      "请将每个 [方括号] 中的内容替换为你的信息，例如 [NOME]（你的姓名）和 [NIF]（你的税号）。请自行通过官方渠道发送。",
    ownLabel: "1. 用你的语言写的回复 — 可以修改",
    update: "更新葡萄牙语版本",
    translating: "正在翻译…",
    outOfSync: "你修改了回复。发送前请更新葡萄牙语版本。",
    aiNote: "人工智能只翻译你写的内容，不会添加任何东西。",
    ptLabel: "Português (Portugal) — 这是你要发送的内容",
    copy: "复制葡萄牙语文本",
    copied: "已复制",
    openEmail: "在我的邮件应用中打开",
    emailGiven: (email) => `信中给出的回复邮箱是：${email}。发送前请在原件上核对。`,
    noEmail: "信中没有给出邮箱地址。发送前请确认回复方式（在线平台、邮寄或亲自前往），并自行填写地址。",
  },
};

const MESSAGES: Record<UiLanguage, Messages> = { en, fr, es, uk, hi, zh };

export function getMessages(lang: UiLanguage): Messages {
  return MESSAGES[lang];
}
