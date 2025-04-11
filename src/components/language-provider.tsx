"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type Language = "en" | "kz" | "ru"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    "admin.panel": "Admin panel",
    users: "Users",
    "declaration.editor": "Declaration editor",
    "initial.declaration": "Initial declaration",
    "ad.hoc": "Ad hoc",
    "management.plan": "Management Plan",
    search: "Search",
    status: "Status",
    role: "Role",
    id: "ID",
    "first.name": "First name",
    "last.name": "Last name",
    email: "Email",
    department: "Department",
    position: "Position",
    "reg.date": "Reg date",
    "profile.link": "Profile Link",
    verified: "Verified",
    "not.verified": "Not verified",
    all: "All",
    user: "User",
    manager: "Manager",
    admin: "Admin",
  },
  kz: {
    "admin.panel": "Әкімші панелі",
    users: "Пайдаланушылар",
    "declaration.editor": "Декларация редакторы",
    "initial.declaration": "Бастапқы декларация",
    "ad.hoc": "Арнайы",
    "management.plan": "Басқару жоспары",
    search: "Іздеу",
    status: "Күй",
    role: "Рөл",
    id: "ID",
    "first.name": "Аты",
    "last.name": "Тегі",
    email: "Электрондық пошта",
    department: "Бөлім",
    position: "Лауазым",
    "reg.date": "Тіркелу күні",
    "profile.link": "Профиль сілтемесі",
    verified: "Расталған",
    "not.verified": "Расталмаған",
    all: "Барлығы",
    user: "Пайдаланушы",
    manager: "Менеджер",
    admin: "Әкімші",
  },
  ru: {
    "admin.panel": "Панель администратора",
    users: "Пользователи",
    "declaration.editor": "Редактор деклараций",
    "initial.declaration": "Начальная декларация",
    "ad.hoc": "Специальный",
    "management.plan": "План управления",
    search: "Поиск",
    status: "Статус",
    role: "Роль",
    id: "ID",
    "first.name": "Имя",
    "last.name": "Фамилия",
    email: "Эл. почта",
    department: "Отдел",
    position: "Должность",
    "reg.date": "Дата регистрации",
    "profile.link": "Ссылка на профиль",
    verified: "Подтвержден",
    "not.verified": "Не подтвержден",
    all: "Все",
    user: "Пользователь",
    manager: "Менеджер",
    admin: "Администратор",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string) => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

