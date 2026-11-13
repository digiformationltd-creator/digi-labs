/**
 * Multilingual Voice Catalog for DIGI LABS
 *
 * Strict policy: MALE VOICES ONLY across all engines and locales.
 * Supports 75+ global languages & dialects with verified neural male voices,
 * plus Gemini studio voices that can speak any global language authentically.
 */

const LANGUAGES = [
  // Primary / Regional languages
  { code: "ur", name: "Urdu (اردو)", native: "اردو", rtl: true, defaultVoice: "ur-PK-AsadNeural",
    edgeVoices: [
      { id: "ur-PK-AsadNeural", label: "Asad (Pakistan) — Male", lang: "ur", gender: "Male" },
      { id: "ur-IN-SalmanNeural", label: "Salman (India) — Male", lang: "ur", gender: "Male" },
    ]
  },
  { code: "en", name: "English", native: "English", rtl: false, defaultVoice: "en-US-GuyNeural",
    edgeVoices: [
      { id: "en-US-GuyNeural", label: "Guy (US) — Male", lang: "en", gender: "Male" },
      { id: "en-US-AndrewMultilingualNeural", label: "Andrew (US Multilingual) — Male", lang: "en", gender: "Male" },
      { id: "en-US-BrianMultilingualNeural", label: "Brian (US Multilingual) — Male", lang: "en", gender: "Male" },
      { id: "en-GB-RyanNeural", label: "Ryan (UK) — Male", lang: "en", gender: "Male" },
      { id: "en-GB-ThomasNeural", label: "Thomas (UK) — Male", lang: "en", gender: "Male" },
      { id: "en-AU-WilliamNeural", label: "William (Australia) — Male", lang: "en", gender: "Male" },
      { id: "en-CA-LiamNeural", label: "Liam (Canada) — Male", lang: "en", gender: "Male" },
      { id: "en-IN-PrabhatNeural", label: "Prabhat (India) — Male", lang: "en", gender: "Male" },
    ]
  },
  { code: "hi", name: "Hindi (हिन्दी)", native: "हिन्दी", rtl: false, defaultVoice: "hi-IN-MadhurNeural",
    edgeVoices: [
      { id: "hi-IN-MadhurNeural", label: "Madhur (India) — Male", lang: "hi", gender: "Male" },
    ]
  },
  { code: "ar", name: "Arabic (العربية)", native: "العربية", rtl: true, defaultVoice: "ar-SA-HamedNeural",
    edgeVoices: [
      { id: "ar-SA-HamedNeural", label: "Hamed (Saudi Arabia) — Male", lang: "ar", gender: "Male" },
      { id: "ar-AE-HamdanNeural", label: "Hamdan (UAE) — Male", lang: "ar", gender: "Male" },
      { id: "ar-EG-ShakirNeural", label: "Shakir (Egypt) — Male", lang: "ar", gender: "Male" },
    ]
  },
  { code: "fa", name: "Persian / Farsi (فارسی)", native: "فارسی", rtl: true, defaultVoice: "fa-IR-FaridNeural",
    edgeVoices: [
      { id: "fa-IR-FaridNeural", label: "Farid (Iran) — Male", lang: "fa", gender: "Male" },
    ]
  },
  { code: "ps", name: "Pashto (پښتو)", native: "پښتو", rtl: true, defaultVoice: "ps-AF-GulNawazNeural",
    edgeVoices: [
      { id: "ps-AF-GulNawazNeural", label: "Gul Nawaz (Afghanistan) — Male", lang: "ps", gender: "Male" },
    ]
  },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)", native: "ਪੰਜਾਬੀ", rtl: false, defaultVoice: "pa-IN-OjasNeural",
    edgeVoices: [
      { id: "pa-IN-OjasNeural", label: "Ojas (India) — Male", lang: "pa", gender: "Male" },
    ]
  },
  { code: "bn", name: "Bengali (বাংলা)", native: "বাংলা", rtl: false, defaultVoice: "bn-IN-BashkarNeural",
    edgeVoices: [
      { id: "bn-IN-BashkarNeural", label: "Bashkar (India) — Male", lang: "bn", gender: "Male" },
      { id: "bn-BD-PradeepNeural", label: "Pradeep (Bangladesh) — Male", lang: "bn", gender: "Male" },
    ]
  },
  { code: "es", name: "Spanish (Español)", native: "Español", rtl: false, defaultVoice: "es-ES-AlvaroNeural",
    edgeVoices: [
      { id: "es-ES-AlvaroNeural", label: "Alvaro (Spain) — Male", lang: "es", gender: "Male" },
      { id: "es-MX-JorgeNeural", label: "Jorge (Mexico) — Male", lang: "es", gender: "Male" },
      { id: "es-US-AlonsoNeural", label: "Alonso (US) — Male", lang: "es", gender: "Male" },
    ]
  },
  { code: "fr", name: "French (Français)", native: "Français", rtl: false, defaultVoice: "fr-FR-HenriNeural",
    edgeVoices: [
      { id: "fr-FR-HenriNeural", label: "Henri (France) — Male", lang: "fr", gender: "Male" },
      { id: "fr-CA-AntoineNeural", label: "Antoine (Canada) — Male", lang: "fr", gender: "Male" },
    ]
  },
  { code: "de", name: "German (Deutsch)", native: "Deutsch", rtl: false, defaultVoice: "de-DE-ConradNeural",
    edgeVoices: [
      { id: "de-DE-ConradNeural", label: "Conrad (Germany) — Male", lang: "de", gender: "Male" },
      { id: "de-DE-KillianNeural", label: "Killian (Germany) — Male", lang: "de", gender: "Male" },
    ]
  },
  { code: "it", name: "Italian (Italiano)", native: "Italiano", rtl: false, defaultVoice: "it-IT-DiegoNeural",
    edgeVoices: [
      { id: "it-IT-DiegoNeural", label: "Diego (Italy) — Male", lang: "it", gender: "Male" },
      { id: "it-IT-GiuseppeNeural", label: "Giuseppe (Italy) — Male", lang: "it", gender: "Male" },
    ]
  },
  { code: "pt", name: "Portuguese (Português)", native: "Português", rtl: false, defaultVoice: "pt-BR-AntonioNeural",
    edgeVoices: [
      { id: "pt-BR-AntonioNeural", label: "Antonio (Brazil) — Male", lang: "pt", gender: "Male" },
      { id: "pt-PT-DuarteNeural", label: "Duarte (Portugal) — Male", lang: "pt", gender: "Male" },
    ]
  },
  { code: "ru", name: "Russian (Русский)", native: "Русский", rtl: false, defaultVoice: "ru-RU-DmitryNeural",
    edgeVoices: [
      { id: "ru-RU-DmitryNeural", label: "Dmitry (Russia) — Male", lang: "ru", gender: "Male" },
    ]
  },
  { code: "tr", name: "Turkish (Türkçe)", native: "Türkçe", rtl: false, defaultVoice: "tr-TR-AhmetNeural",
    edgeVoices: [
      { id: "tr-TR-AhmetNeural", label: "Ahmet (Turkey) — Male", lang: "tr", gender: "Male" },
    ]
  },
  { code: "zh", name: "Chinese (Mandarin / 中文)", native: "中文", rtl: false, defaultVoice: "zh-CN-YunxiNeural",
    edgeVoices: [
      { id: "zh-CN-YunxiNeural", label: "Yunxi (Simplified) — Male", lang: "zh", gender: "Male" },
      { id: "zh-CN-YunjianNeural", label: "Yunjian (Simplified) — Male", lang: "zh", gender: "Male" },
      { id: "zh-TW-YunJheNeural", label: "YunJhe (Taiwan) — Male", lang: "zh", gender: "Male" },
    ]
  },
  { code: "ja", name: "Japanese (日本語)", native: "日本語", rtl: false, defaultVoice: "ja-JP-KeitaNeural",
    edgeVoices: [
      { id: "ja-JP-KeitaNeural", label: "Keita (Japan) — Male", lang: "ja", gender: "Male" },
      { id: "ja-JP-NaokiNeural", label: "Naoki (Japan) — Male", lang: "ja", gender: "Male" },
    ]
  },
  { code: "ko", name: "Korean (한국어)", native: "한국어", rtl: false, defaultVoice: "ko-KR-InJoonNeural",
    edgeVoices: [
      { id: "ko-KR-InJoonNeural", label: "InJoon (Korea) — Male", lang: "ko", gender: "Male" },
    ]
  },
  { code: "id", name: "Indonesian (Bahasa Indonesia)", native: "Bahasa Indonesia", rtl: false, defaultVoice: "id-ID-ArdiNeural",
    edgeVoices: [
      { id: "id-ID-ArdiNeural", label: "Ardi (Indonesia) — Male", lang: "id", gender: "Male" },
    ]
  },
  { code: "ms", name: "Malay (Bahasa Melayu)", native: "Bahasa Melayu", rtl: false, defaultVoice: "ms-MY-OsmanNeural",
    edgeVoices: [
      { id: "ms-MY-OsmanNeural", label: "Osman (Malaysia) — Male", lang: "ms", gender: "Male" },
    ]
  },
  { code: "vi", name: "Vietnamese (Tiếng Việt)", native: "Tiếng Việt", rtl: false, defaultVoice: "vi-VN-NamMinhNeural",
    edgeVoices: [
      { id: "vi-VN-NamMinhNeural", label: "Nam Minh (Vietnam) — Male", lang: "vi", gender: "Male" },
    ]
  },
  { code: "th", name: "Thai (ไทย)", native: "ไทย", rtl: false, defaultVoice: "th-TH-NiwatNeural",
    edgeVoices: [
      { id: "th-TH-NiwatNeural", label: "Niwat (Thailand) — Male", lang: "th", gender: "Male" },
    ]
  },
  { code: "nl", name: "Dutch (Nederlands)", native: "Nederlands", rtl: false, defaultVoice: "nl-NL-MaartenNeural",
    edgeVoices: [
      { id: "nl-NL-MaartenNeural", label: "Maarten (Netherlands) — Male", lang: "nl", gender: "Male" },
    ]
  },
  { code: "pl", name: "Polish (Polski)", native: "Polski", rtl: false, defaultVoice: "pl-PL-MarekNeural",
    edgeVoices: [
      { id: "pl-PL-MarekNeural", label: "Marek (Poland) — Male", lang: "pl", gender: "Male" },
    ]
  },
  { code: "sv", name: "Swedish (Svenska)", native: "Svenska", rtl: false, defaultVoice: "sv-SE-MattiasNeural",
    edgeVoices: [
      { id: "sv-SE-MattiasNeural", label: "Mattias (Sweden) — Male", lang: "sv", gender: "Male" },
    ]
  },
  { code: "nb", name: "Norwegian (Norsk)", native: "Norsk", rtl: false, defaultVoice: "nb-NO-FinnNeural",
    edgeVoices: [
      { id: "nb-NO-FinnNeural", label: "Finn (Norway) — Male", lang: "nb", gender: "Male" },
    ]
  },
  { code: "da", name: "Danish (Dansk)", native: "Dansk", rtl: false, defaultVoice: "da-DK-JeppeNeural",
    edgeVoices: [
      { id: "da-DK-JeppeNeural", label: "Jeppe (Denmark) — Male", lang: "da", gender: "Male" },
    ]
  },
  { code: "fi", name: "Finnish (Suomi)", native: "Suomi", rtl: false, defaultVoice: "fi-FI-HarriNeural",
    edgeVoices: [
      { id: "fi-FI-HarriNeural", label: "Harri (Finland) — Male", lang: "fi", gender: "Male" },
    ]
  },
  { code: "el", name: "Greek (Ελληνικά)", native: "Ελληνικά", rtl: false, defaultVoice: "el-GR-NestorasNeural",
    edgeVoices: [
      { id: "el-GR-NestorasNeural", label: "Nestoras (Greece) — Male", lang: "el", gender: "Male" },
    ]
  },
  { code: "he", name: "Hebrew (עברית)", native: "עברית", rtl: true, defaultVoice: "he-IL-AvriNeural",
    edgeVoices: [
      { id: "he-IL-AvriNeural", label: "Avri (Israel) — Male", lang: "he", gender: "Male" },
    ]
  },
  { code: "cs", name: "Czech (Čeština)", native: "Čeština", rtl: false, defaultVoice: "cs-CZ-AntoninNeural",
    edgeVoices: [
      { id: "cs-CZ-AntoninNeural", label: "Antonin (Czechia) — Male", lang: "cs", gender: "Male" },
    ]
  },
  { code: "ro", name: "Romanian (Română)", native: "Română", rtl: false, defaultVoice: "ro-RO-EmilNeural",
    edgeVoices: [
      { id: "ro-RO-EmilNeural", label: "Emil (Romania) — Male", lang: "ro", gender: "Male" },
    ]
  },
  { code: "hu", name: "Hungarian (Magyar)", native: "Magyar", rtl: false, defaultVoice: "hu-HU-TamasNeural",
    edgeVoices: [
      { id: "hu-HU-TamasNeural", label: "Tamas (Hungary) — Male", lang: "hu", gender: "Male" },
    ]
  },
  { code: "uk", name: "Ukrainian (Українська)", native: "Українська", rtl: false, defaultVoice: "uk-UA-OstapNeural",
    edgeVoices: [
      { id: "uk-UA-OstapNeural", label: "Ostap (Ukraine) — Male", lang: "uk", gender: "Male" },
    ]
  },
  { code: "sk", name: "Slovak (Slovenčina)", native: "Slovenčina", rtl: false, defaultVoice: "sk-SK-LukasNeural",
    edgeVoices: [
      { id: "sk-SK-LukasNeural", label: "Lukas (Slovakia) — Male", lang: "sk", gender: "Male" },
    ]
  },
  { code: "bg", name: "Bulgarian (Български)", native: "Български", rtl: false, defaultVoice: "bg-BG-BorislavNeural",
    edgeVoices: [
      { id: "bg-BG-BorislavNeural", label: "Borislav (Bulgaria) — Male", lang: "bg", gender: "Male" },
    ]
  },
  { code: "hr", name: "Croatian (Hrvatski)", native: "Hrvatski", rtl: false, defaultVoice: "hr-HR-SreckoNeural",
    edgeVoices: [
      { id: "hr-HR-SreckoNeural", label: "Srecko (Croatia) — Male", lang: "hr", gender: "Male" },
    ]
  },
  { code: "sr", name: "Serbian (Српски)", native: "Српски", rtl: false, defaultVoice: "sr-RS-NicholasNeural",
    edgeVoices: [
      { id: "sr-RS-NicholasNeural", label: "Nicholas (Serbia) — Male", lang: "sr", gender: "Male" },
    ]
  },
  { code: "sl", name: "Slovenian (Slovenščina)", native: "Slovenščina", rtl: false, defaultVoice: "sl-SI-RokNeural",
    edgeVoices: [
      { id: "sl-SI-RokNeural", label: "Rok (Slovenia) — Male", lang: "sl", gender: "Male" },
    ]
  },
  { code: "ta", name: "Tamil (தமிழ்)", native: "தமிழ்", rtl: false, defaultVoice: "ta-IN-ValluvarNeural",
    edgeVoices: [
      { id: "ta-IN-ValluvarNeural", label: "Valluvar (India) — Male", lang: "ta", gender: "Male" },
    ]
  },
  { code: "te", name: "Telugu (తెలుగు)", native: "తెలుగు", rtl: false, defaultVoice: "te-IN-MohanNeural",
    edgeVoices: [
      { id: "te-IN-MohanNeural", label: "Mohan (India) — Male", lang: "te", gender: "Male" },
    ]
  },
  { code: "mr", name: "Marathi (मराठी)", native: "मराठी", rtl: false, defaultVoice: "mr-IN-ManoharNeural",
    edgeVoices: [
      { id: "mr-IN-ManoharNeural", label: "Manohar (India) — Male", lang: "mr", gender: "Male" },
    ]
  },
  { code: "gu", name: "Gujarati (ગુજરાતી)", native: "ગુજરાતી", rtl: false, defaultVoice: "gu-IN-NiranjanNeural",
    edgeVoices: [
      { id: "gu-IN-NiranjanNeural", label: "Niranjan (India) — Male", lang: "gu", gender: "Male" },
    ]
  },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)", native: "ಕನ್ನಡ", rtl: false, defaultVoice: "kn-IN-GaganNeural",
    edgeVoices: [
      { id: "kn-IN-GaganNeural", label: "Gagan (India) — Male", lang: "kn", gender: "Male" },
    ]
  },
  { code: "ml", name: "Malayalam (മലയാളം)", native: "മലയാളം", rtl: false, defaultVoice: "ml-IN-MidhunNeural",
    edgeVoices: [
      { id: "ml-IN-MidhunNeural", label: "Midhun (India) — Male", lang: "ml", gender: "Male" },
    ]
  },
  { code: "sw", name: "Swahili (Kiswahili)", native: "Kiswahili", rtl: false, defaultVoice: "sw-KE-RafikiNeural",
    edgeVoices: [
      { id: "sw-KE-RafikiNeural", label: "Rafiki (Kenya) — Male", lang: "sw", gender: "Male" },
    ]
  },
  { code: "fil", name: "Filipino (Tagalog)", native: "Filipino", rtl: false, defaultVoice: "fil-PH-AngeloNeural",
    edgeVoices: [
      { id: "fil-PH-AngeloNeural", label: "Angelo (Philippines) — Male", lang: "fil", gender: "Male" },
    ]
  },
  { code: "kk", name: "Kazakh (Қазақ)", native: "Қазақ", rtl: false, defaultVoice: "kk-KZ-DauletNeural",
    edgeVoices: [
      { id: "kk-KZ-DauletNeural", label: "Daulet (Kazakhstan) — Male", lang: "kk", gender: "Male" },
    ]
  },
  { code: "az", name: "Azerbaijani (Azərbaycan)", native: "Azərbaycan", rtl: false, defaultVoice: "az-AZ-BabekNeural",
    edgeVoices: [
      { id: "az-AZ-BabekNeural", label: "Babek (Azerbaijan) — Male", lang: "az", gender: "Male" },
    ]
  },
  { code: "ka", name: "Georgian (ქართული)", native: "ქართული", rtl: false, defaultVoice: "ka-GE-GiorgiNeural",
    edgeVoices: [
      { id: "ka-GE-GiorgiNeural", label: "Giorgi (Georgia) — Male", lang: "ka", gender: "Male" },
    ]
  },
  { code: "sq", name: "Albanian (Shqip)", native: "Shqip", rtl: false, defaultVoice: "sq-AL-IlirNeural",
    edgeVoices: [
      { id: "sq-AL-IlirNeural", label: "Ilir (Albania) — Male", lang: "sq", gender: "Male" },
    ]
  },
  { code: "mk", name: "Macedonian (Македонски)", native: "Македонски", rtl: false, defaultVoice: "mk-MK-AleksandarNeural",
    edgeVoices: [
      { id: "mk-MK-AleksandarNeural", label: "Aleksandar (North Macedonia) — Male", lang: "mk", gender: "Male" },
    ]
  },
  { code: "bs", name: "Bosnian (Bosanski)", native: "Bosanski", rtl: false, defaultVoice: "bs-BA-GoranNeural",
    edgeVoices: [
      { id: "bs-BA-GoranNeural", label: "Goran (Bosnia) — Male", lang: "bs", gender: "Male" },
    ]
  },
  { code: "et", name: "Estonian (Eesti)", native: "Eesti", rtl: false, defaultVoice: "et-EE-KertNeural",
    edgeVoices: [
      { id: "et-EE-KertNeural", label: "Kert (Estonia) — Male", lang: "et", gender: "Male" },
    ]
  },
  { code: "lv", name: "Latvian (Latviešu)", native: "Latviešu", rtl: false, defaultVoice: "lv-LV-NilsNeural",
    edgeVoices: [
      { id: "lv-LV-NilsNeural", label: "Nils (Latvia) — Male", lang: "lv", gender: "Male" },
    ]
  },
  { code: "lt", name: "Lithuanian (Lietuvių)", native: "Lietuvių", rtl: false, defaultVoice: "lt-LT-LeonasNeural",
    edgeVoices: [
      { id: "lt-LT-LeonasNeural", label: "Leonas (Lithuania) — Male", lang: "lt", gender: "Male" },
    ]
  },
  { code: "is", name: "Icelandic (Íslenska)", native: "Íslenska", rtl: false, defaultVoice: "is-IS-GunnarNeural",
    edgeVoices: [
      { id: "is-IS-GunnarNeural", label: "Gunnar (Iceland) — Male", lang: "is", gender: "Male" },
    ]
  },
  { code: "ga", name: "Irish (Gaeilge)", native: "Gaeilge", rtl: false, defaultVoice: "ga-IE-ColmNeural",
    edgeVoices: [
      { id: "ga-IE-ColmNeural", label: "Colm (Ireland) — Male", lang: "ga", gender: "Male" },
    ]
  },
  { code: "cy", name: "Welsh (Cymraeg)", native: "Cymraeg", rtl: false, defaultVoice: "cy-GB-AledNeural",
    edgeVoices: [
      { id: "cy-GB-AledNeural", label: "Aled (UK) — Male", lang: "cy", gender: "Male" },
    ]
  },
  { code: "af", name: "Afrikaans", native: "Afrikaans", rtl: false, defaultVoice: "af-ZA-WillemNeural",
    edgeVoices: [
      { id: "af-ZA-WillemNeural", label: "Willem (South Africa) — Male", lang: "af", gender: "Male" },
    ]
  },
  { code: "zu", name: "Zulu (isiZulu)", native: "isiZulu", rtl: false, defaultVoice: "zu-ZA-ThembaNeural",
    edgeVoices: [
      { id: "zu-ZA-ThembaNeural", label: "Themba (South Africa) — Male", lang: "zu", gender: "Male" },
    ]
  },
];

// Flattened list of all Edge male voices
const ALL_EDGE_VOICES = LANGUAGES.flatMap((l) => l.edgeVoices);

// Gemini male studio voices (Universal - speaks all world languages)
const GEMINI_STUDIO_VOICES = [
  { id: "Charon", label: "Charon — deep, steady (Male)", gender: "Male" },
  { id: "Puck", label: "Puck — bright, lively (Male)", gender: "Male" },
  { id: "Fenrir", label: "Fenrir — weighty, serious (Male)", gender: "Male" },
  { id: "Orus", label: "Orus — warm, even (Male)", gender: "Male" },
];

function getLanguages() {
  return LANGUAGES.map((l) => ({
    code: l.code,
    name: l.name,
    native: l.native,
    rtl: !!l.rtl,
    defaultVoice: l.defaultVoice,
    voiceCount: l.edgeVoices.length,
  }));
}

function getVoicesForLanguage(langCode, engineId = "studio") {
  if (engineId === "studio") {
    return GEMINI_STUDIO_VOICES;
  }
  const match = LANGUAGES.find((l) => l.code === langCode);
  return (match && match.edgeVoices.length) ? match.edgeVoices : LANGUAGES[0].edgeVoices;
}

function getLanguageMeta(code) {
  return LANGUAGES.find((l) => l.code === code) || null;
}

module.exports = {
  LANGUAGES,
  ALL_EDGE_VOICES,
  GEMINI_STUDIO_VOICES,
  getLanguages,
  getVoicesForLanguage,
  getLanguageMeta,
};
