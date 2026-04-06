# JobFinder — текущий статус проекта

## Архитектура
- React Native 0.79 + Expo 54
- Навигация: RootStack (AuthStack, MainTabs, ProfileStack)
- Управление состоянием: TanStack Query, Zustand
- Стили: AppStyles.ts + динамическая тема

## Реализовано
- Авторизация (email + подтверждение)
- Вакансии (список, фильтры, детальный экран)
- Избранное (контекст + AsyncStorage)
- Отклики (форма, выбор резюме, toast-уведомления)
- Резюме (CRUD, опыт работы, языки, загрузка PDF)
- Профиль (личные данные, редактирование)
- Тема (светлая/тёмная/системная)

## Проблемы
- Сборка EAS падает из-за несовместимости react-native-gesture-handler и react-native-screens с RN 0.79
- Нужно понизить версии или обновить RN

## Файлы для анализа
- package.json (версии)
- android/build.gradle (ndkVersion)
- eas.json