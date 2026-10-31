import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageOption = 'English' | 'Français' | 'العربية' | 'Español';
export type CurrencyOption = 'DH MAD' | 'EUR (€)' | 'USD ($)' | 'GBP (£)';
export type ThemeOption = 'dark' | 'light' | 'system';

interface AccountSettingsContextType {
  language: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  currency: CurrencyOption;
  setCurrency: (curr: CurrencyOption) => void;
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
  isLight: boolean;
  isRTL: boolean;
  formatPrice: (amountInMAD: number) => string;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<LanguageOption, Record<string, string>> = {
  English: {
    dashboard: 'Dashboard',
    vehicles: 'Fleet & Vehicles',
    bookings: 'Bookings',
    carSharing: 'B2B Car Sharing',
    messages: 'Messages',
    earnings: 'Earnings',
    analytics: 'Analytics',
    calendar: 'Calendar',
    reviews: 'Reviews',
    policies: 'Rental Policies',
    profile: 'Profile',
    settings: 'Settings',
    manualBooking: 'Manual Booking',
    welcomeBack: 'Welcome back',
    monthlyNetPayout: 'Monthly Net Payout',
    activeFleetOnTrip: 'Active Fleet on Trip',
    pendingRequests: 'Pending Requests',
    replySpeed: 'REPLY SPEED',
    viewPublicProfile: 'View Public Profile',
    seePublicProfileDesc: 'See how your partner profile looks to customers',
    accountSettings: 'Account Settings',
    manageAccountSettingsDesc: 'Manage your account settings on the platform',
    language: 'Language',
    chooseLanguageDesc: 'Choose your preferred language',
    currency: 'Currency',
    setCurrencyDesc: 'Set your preferred currency for prices',
    darkLightMode: 'Dark / Light mode',
    chooseThemeDesc: 'Choose your interface appearance',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    systemMode: 'System Preference',
    saveSettings: 'Save Account Settings',
    settingsSaved: 'Account settings saved successfully!',
    perDay: '/ day',
    instantReserve: 'Instant Reserve',
    dailyRate: 'Daily Rate',
    deposit: 'Security Deposit',
    available: 'Available',
    onTrip: 'On Trip',
    status: 'Status',
    actions: 'Actions',
    partnerPortal: 'Partner Workspace',
    renterPortal: 'Renter Portal',
  },
  Français: {
    dashboard: 'Tableau de bord',
    vehicles: 'Flotte & Véhicules',
    bookings: 'Réservations',
    carSharing: 'Partage B2B',
    messages: 'Messagerie',
    earnings: 'Revenus & Payouts',
    analytics: 'Analytiques',
    calendar: 'Calendrier',
    reviews: 'Avis Clients',
    policies: 'Conditions de Location',
    profile: 'Profil Agence',
    settings: 'Paramètres',
    manualBooking: 'Réservation Manuelle',
    welcomeBack: 'Bienvenue',
    monthlyNetPayout: 'Revenu Net Mensuel',
    activeFleetOnTrip: 'Flotte en Trajet',
    pendingRequests: 'Demandes en Attente',
    replySpeed: 'VITESSE DE RÉPONSE',
    viewPublicProfile: 'Voir le Profil Public',
    seePublicProfileDesc: 'Découvrez comment votre profil partenaire apparaît aux clients',
    accountSettings: 'Paramètres du Compte',
    manageAccountSettingsDesc: 'Gérez les paramètres de votre compte sur la plateforme',
    language: 'Langue',
    chooseLanguageDesc: 'Choisissez votre langue préférée',
    currency: 'Devise',
    setCurrencyDesc: 'Définissez votre devise pour les tarifs',
    darkLightMode: 'Mode Sombre / Clair',
    chooseThemeDesc: 'Choisissez l’apparence de votre interface',
    darkMode: 'Mode Sombre',
    lightMode: 'Mode Clair',
    systemMode: 'Système',
    saveSettings: 'Enregistrer les Paramètres',
    settingsSaved: 'Paramètres enregistrés avec succès !',
    perDay: '/ jour',
    instantReserve: 'Réservation Immédiate',
    dailyRate: 'Tarif Journalier',
    deposit: 'Caution Garantie',
    available: 'Disponible',
    onTrip: 'En Trajet',
    status: 'Statut',
    actions: 'Actions',
    partnerPortal: 'Espace Partenaire',
    renterPortal: 'Espace Locataire',
  },
  العربية: {
    dashboard: 'لوحة القيادة',
    vehicles: 'الأسطول والسيارات',
    bookings: 'الحجوزات والعقود',
    carSharing: 'مشاركة السيارات B2B',
    messages: 'الرسائل والمحادثات',
    earnings: 'الأرباح والتحويلات',
    analytics: 'التحليلات والأداء',
    calendar: 'جدول المواعيد',
    reviews: 'تقييمات الزبائن',
    policies: 'شروط الإيجار',
    profile: 'ملف الوكالة',
    settings: 'الإعدادات والربط',
    manualBooking: 'حجز يدوي جديد',
    welcomeBack: 'مرحباً بك مجدداً',
    monthlyNetPayout: 'صافي الأرباح الشهرية',
    activeFleetOnTrip: 'الأسطول النشط حالياً',
    pendingRequests: 'الطلبات بانتظار التأكيد',
    replySpeed: 'سرعة الرد',
    viewPublicProfile: 'عرض الملف العام للزبائن',
    seePublicProfileDesc: 'شاهد كيف تظهر وكالتك وأسطولك لزبائن إيربكار',
    accountSettings: 'إعدادات الحساب',
    manageAccountSettingsDesc: 'إدارة إعدادات حسابك وتفضيلاتك على المنصة',
    language: 'اللغة',
    chooseLanguageDesc: 'اختر لغتك المفضلة',
    currency: 'العملة',
    setCurrencyDesc: 'حدد عملتك المفضلة لعرض الأسعار',
    darkLightMode: 'الوضع الليلي / النهاري',
    chooseThemeDesc: 'اختر مظهر الواجهة المناسب لك',
    darkMode: 'الوضع الليلي',
    lightMode: 'الوضع النهاري',
    systemMode: 'تلقائي حسب الجهاز',
    saveSettings: 'حفظ الإعدادات',
    settingsSaved: 'تم حفظ إعدادات الحساب بنجاح!',
    perDay: '/ يوم',
    instantReserve: 'حجز فوري',
    dailyRate: 'السعر اليومي',
    deposit: 'مبلغ الضمان',
    available: 'متاح للإيجار',
    onTrip: 'في رحلة نشطة',
    status: 'الحالة',
    actions: 'الإجراءات',
    partnerPortal: 'بوابة الشركاء',
    renterPortal: 'بوابة المستأجرين',
  },
  Español: {
    dashboard: 'Panel de Control',
    vehicles: 'Flota y Vehículos',
    bookings: 'Reservas y Contratos',
    carSharing: 'Compartir Coches B2B',
    messages: 'Mensajes',
    earnings: 'Ingresos y Pagos',
    analytics: 'Analítica',
    calendar: 'Calendario',
    reviews: 'Opiniones',
    policies: 'Políticas de Alquiler',
    profile: 'Perfil de Agencia',
    settings: 'Ajustes',
    manualBooking: 'Reserva Manual',
    welcomeBack: 'Bienvenido de nuevo',
    monthlyNetPayout: 'Pago Neto Mensual',
    activeFleetOnTrip: 'Flota Activa en Viaje',
    pendingRequests: 'Solicitudes Pendientes',
    replySpeed: 'VELOCIDAD DE RESPUESTA',
    viewPublicProfile: 'Ver Perfil Público',
    seePublicProfileDesc: 'Vea cómo ven su perfil de agencia los clientes',
    accountSettings: 'Ajustes de la Cuenta',
    manageAccountSettingsDesc: 'Gestione la configuración de su cuenta en la plataforma',
    language: 'Idioma',
    chooseLanguageDesc: 'Elija su idioma preferido',
    currency: 'Moneda',
    setCurrencyDesc: 'Establezca su moneda preferida para los precios',
    darkLightMode: 'Modo Oscuro / Claro',
    chooseThemeDesc: 'Elija la apariencia de su interfaz',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    systemMode: 'Preferencia del Sistema',
    saveSettings: 'Guardar Ajustes',
    settingsSaved: '¡Ajustes guardados correctamente!',
    perDay: '/ día',
    instantReserve: 'Reserva Inmediata',
    dailyRate: 'Tarifa Diaria',
    deposit: 'Fianza',
    available: 'Disponible',
    onTrip: 'En Viaje',
    status: 'Estado',
    actions: 'Acciones',
    partnerPortal: 'Área de Socios',
    renterPortal: 'Portal del Conductor',
  },
};

const AccountSettingsContext = createContext<AccountSettingsContextType | undefined>(undefined);

export const AccountSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageOption>(() => {
    const saved = localStorage.getItem('airbcar_language');
    if (saved && ['English', 'Français', 'العربية', 'Español'].includes(saved)) {
      return saved as LanguageOption;
    }
    return 'English';
  });

  const [currency, setCurrencyState] = useState<CurrencyOption>(() => {
    const saved = localStorage.getItem('airbcar_currency');
    if (saved && ['DH MAD', 'EUR (€)', 'USD ($)', 'GBP (£)'].includes(saved)) {
      return saved as CurrencyOption;
    }
    return 'DH MAD';
  });

  const [theme, setThemeState] = useState<ThemeOption>(() => {
    const saved = localStorage.getItem('airbcar_theme');
    if (saved && ['dark', 'light', 'system'].includes(saved)) {
      return saved as ThemeOption;
    }
    return 'dark';
  });

  const setLanguage = (lang: LanguageOption) => {
    setLanguageState(lang);
    localStorage.setItem('airbcar_language', lang);
  };

  const setCurrency = (curr: CurrencyOption) => {
    setCurrencyState(curr);
    localStorage.setItem('airbcar_currency', curr);
  };

  const setTheme = (t: ThemeOption) => {
    setThemeState(t);
    localStorage.setItem('airbcar_theme', t);
  };

  const isLight = theme === 'light';
  const isRTL = language === 'العربية';

  const formatPrice = (amountInMAD: number): string => {
    if (currency === 'EUR (€)') {
      const eur = Math.round(amountInMAD / 10.8);
      return `${eur.toLocaleString()} €`;
    }
    if (currency === 'USD ($)') {
      const usd = Math.round(amountInMAD / 10.0);
      return `$${usd.toLocaleString()}`;
    }
    if (currency === 'GBP (£)') {
      const gbp = Math.round(amountInMAD / 12.6);
      return `£${gbp.toLocaleString()}`;
    }
    // Default DH MAD
    return `${amountInMAD.toLocaleString()} DH MAD`;
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    return fallback || translations.English[key] || key;
  };

  return (
    <AccountSettingsContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        theme,
        setTheme,
        isLight,
        isRTL,
        formatPrice,
        t,
      }}
    >
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isLight ? 'light-mode' : 'dark-mode'}>
        {children}
      </div>
    </AccountSettingsContext.Provider>
  );
};

export const useAccountSettings = (): AccountSettingsContextType => {
  const context = useContext(AccountSettingsContext);
  if (!context) {
    throw new Error('useAccountSettings must be used within an AccountSettingsProvider');
  }
  return context;
};
