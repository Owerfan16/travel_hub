## TravelHub

Фуллстек‑приложение для поиска и покупки авиабилетов, Ж/Д билетов и туров.  
Фронтенд: **Next.js 15 (App Router, TypeScript, Tailwind 4)**.  
Бэкенд: **Django 5 + Django REST Framework**.

---

## Стек и архитектура

- **Фронтенд**
  - **Next.js 15** (`frontend/`)
  - **React 19**, `react-dom 19`
  - Tailwind CSS 4
  - Контексты для авторизации, темизации, валют и данных (tickets/tours/travelIdeas)
  - Локализация через `next-intl` (язык по умолчанию: русский)
  - Импорт шрифта Roboto через `next/font`
- **Бэкенд**
  - Django 5 (`backend/`)
  - Django REST Framework (`rest_framework`)
  - `django-cors-headers` для CORS
  - SQLite база данных (`backend/db.sqlite3` по умолчанию)

Фронтенд общается с бэкендом по REST API (префикс `http://localhost:8000/api/...`).

---

## Требования

- **Node.js**: рекомендуется **>= 20** (Next 15 + React 19)
- **npm** или **pnpm/yarn** (в примерах используется `npm`)
- **Python**: **>= 3.11** (проект создан на Django 5.1.7)
- **Git** (опционально, для работы с репозиторием)

Рекомендуется запускать проект в отдельном виртуальном окружении Python и не использовать глобальные установки пакетов.

---

## Установка и первый запуск (локально)

### 1. Клонирование репозитория

```bash
git clone <url-репозитория>
cd travel_hub
```

### 2. Установка и запуск фронтенда (Next.js)

Перейдите в папку `frontend` и установите зависимости:

```bash
cd frontend
npm install --legacy-peer-deps
```

> **Почему `--legacy-peer-deps`?**  
> В проекте используется **React 19**, а библиотека `react-popper@2.3.0` официально поддерживает только React 16–18.  
> Из-за этого возникает конфликт peer‑зависимостей. Флаг `--legacy-peer-deps` говорит npm игнорировать эти конфликты и установить пакеты как есть.

Если после установки появятся жалобы на `fast-xml-parser`, можно принудительно переустановить:

```bash
npm install fast-xml-parser --legacy-peer-deps
```

Запуск дев‑сервера фронтенда:

```bash
npm run dev
```

По умолчанию приложение будет доступно по адресу:

```text
http://localhost:3000
```

### 3. Установка и запуск бэкенда (Django)

Откройте **новый терминал** в корневой директории проекта (`travel_hub`).

Создайте и активируйте виртуальное окружение Python (Windows, PowerShell):

```powershell
python -m venv venv
.\venv\Scripts\activate
```

Перейдите в папку `backend` и установите зависимости:

```powershell
cd backend
pip install django django-cors-headers djangorestframework
```

#### Миграции базы данных

Выполните миграции:

```powershell
python manage.py migrate
```

#### Создание суперпользователя (для админ‑панели)

```powershell
python manage.py createsuperuser
```

Следуйте инструкциям в терминале (email/логин/пароль).

#### Запуск дев‑сервера Django

```powershell
python manage.py runserver
```

По умолчанию сервер запустится на:

```text
http://localhost:8000
```

Теперь фронтенд (`localhost:3000`) может обращаться к API (`localhost:8000`).

---

## Структура проекта (кратко)

- **`frontend/`** — Next.js‑клиент
  - `app/` — App Router:
    - `page.tsx` — главная страница (поиск, горячие билеты, идеи для путешествий)
    - `auth/page.tsx` — страница авторизации
    - `profile/page.tsx` — профиль пользователя
    - `search/page.tsx` — поиск авиабилетов
    - `trains/page.tsx` — поиск Ж/Д билетов
    - `tours/page.tsx` — поиск туров
    - `favourites/page.tsx` — избранное
    - `menu/page.tsx` — меню/навигация
  - `app/components/` — компоненты интерфейса (карточки билетов, туров, фильтры, хедер/футер и т.д.)
  - `app/context/` — React‑контексты (авторизация, темы, данные поиска, локализация)
  - `public/` — статичные изображения (иконки, иллюстрации)
  - `next.config.js` — конфигурация Next (в т.ч. домены для `<Image>`)
- **`backend/`** — Django‑сервер
  - `backend/settings.py` — настройки проекта (БД, CORS, статика, медиа, REST)
  - `backend/urls.py` — маршруты API и админки
  - `api/` — основное приложение:
    - `models.py` — модели (авиабилеты, Ж/Д билеты, туры, страны/города/аэропорты и т.д.)
    - `serializers.py` — сериализаторы для REST API
    - `views.py` — API‑классы (поиск, фильтры, аутентификация, подсказки)
    - `admin.py` — регистрация моделей в админ‑панели
    - `migrations/` — миграции БД
  - `db.sqlite3` — локальная база данных (для разработки)

---

## Основные API‑эндпоинты (бэкенд)

Все маршруты начинаются с префикса `http://localhost:8000/api/`:

- **Горячие билеты и туры**
  - `GET /api/tickets/` — горячие авиабилеты
  - `GET /api/train-tickets/` — горячие Ж/Д билеты
  - `GET /api/popular-tours/` — популярные туры
  - `GET /api/travel-ideas/` — идеи для путешествий
- **Справочники**
  - `GET /api/countries/` — список стран
  - `GET /api/cities/` — список городов (с фильтрами по стране)
  - `GET /api/airlines/` — авиакомпании
  - `GET /api/railway-companies/` — Ж/Д компании
- **Поиск**
  - `GET /api/search/air-tickets/` — поиск авиабилетов (фильтры: города, аэропорты, дата, класс, цена, пересадки, авиакомпании и т.д.)
  - `GET /api/search/train-tickets/` — поиск Ж/Д билетов (фильтры: локации, дата, тип места, цена, длительность, Ж/Д компании)
  - `GET /api/search/tours/` — поиск туров (фильтры: город/страна, звезды отеля, опции (питание, с животными, у моря), рейтинг, цена, количество ночей)
  - `GET /api/search/suggestions/` — подсказки по локациям (города, аэропорты, Ж/Д станции) для автодополнения в формах
- **Аутентификация и профиль**
  - `GET /api/auth/csrf-token/` — установка CSRF‑cookie для фронтенда
  - `POST /api/auth/register/` — регистрация пользователя (по email/паролю)
  - `POST /api/auth/login/` — вход
  - `POST /api/auth/logout/` — выход
  - `GET /api/auth/profile/` — профиль текущего авторизованного пользователя

---

## CORS и CSRF

- В `backend/settings.py` включен `corsheaders`:
  - `CORS_ALLOW_ALL_ORIGINS = True` — все origin разрешены (для разработки).
  - `CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']` — доверенный фронтенд‑origin.
- REST API по умолчанию использует:
  - `SessionAuthentication` и `BasicAuthentication`
  - `IsAuthenticated` как базовый класс разрешений (для многих эндпоинтов явно заменён на `AllowAny`).

В продакшене обязательно:

- Ограничить `ALLOWED_HOSTS`
- Убрать `CORS_ALLOW_ALL_ORIGINS = True`
- Настроить `CSRF_TRUSTED_ORIGINS` под реальные домены

---

## Скрипты и полезные команды

- **Фронтенд (`frontend/`)**
  - `npm run dev` — запуск дев‑сервера Next.js
  - `npm run build` — сборка production‑бандла
  - `npm start` — запуск собранного приложения
  - `npm run lint` — линтер
- **Бэкенд (`backend/`)**
  - `python manage.py migrate` — применить миграции
  - `python manage.py makemigrations` — создать новые миграции
  - `python manage.py createsuperuser` — создать админа
  - `python manage.py runserver` — запустить дев‑сервер

---

## Продакшн и дальнейшая настройка (общие рекомендации)

Для развёртывания в продакшене:

- Собрать фронтенд:

  ```bash
  cd frontend
  npm install --legacy-peer-deps
  npm run build
  npm start
  ```

- Настроить Django:
  - `DEBUG = False`
  - `ALLOWED_HOSTS` с реальными доменами
  - Вынести `SECRET_KEY` и другие чувствительные данные в переменные окружения
  - Настроить постоянную БД (PostgreSQL/MySQL и т.п.) вместо SQLite
  - Настроить статику и медиа‑файлы (Nginx, WhiteNoise, CDN и т.д.)

Конкретная схема продакшн‑развёртывания зависит от выбранной инфраструктуры (VPS, Docker, PaaS и т.п.).

---

## Типичные проблемы и решения

- **Конфликт React 19 и `react-popper`**  
  - Симптом: npm ругается на несовместимые peer‑dependencies.
  - Решение: устанавливать зависимости с флагом `--legacy-peer-deps`, как описано выше.
  - Альтернатива (если в будущем потребуется): обновить `react-popper` до версии с поддержкой React 19 (когда она появится) или заменить на другой тултип/поповер‑пакет.

- **Нет доступа к API с фронтенда**
  - Проверить, что:
    - Django‑сервер запущен на `http://localhost:8000`
    - Фронтенд использует правильный базовый URL для запросов
    - В браузере нет блокировки CORS (в dev‑настройках она уже “расшита” максимально либерально).

