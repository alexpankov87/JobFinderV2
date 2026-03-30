export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  country: string;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  description?: string;
  requirements?: string[];
  posted_at?: string;
  url?: string;
}

export const mockJobs: Job[] = [
  { 
    id: 1, 
    title: 'React Developer', 
    company: 'Tech Corp', 
    location: 'Berlin',
    country: 'Germany',
    salary_min: 55000,
    salary_max: 75000,
    currency: 'EUR',
    description: 'Мы ищем опытного React разработчика для создания современных веб-приложений. Работа в международной команде, гибкий график.',
    requirements: ['React 18+', 'TypeScript', 'Redux Toolkit', 'Английский B2+', 'Опыт от 3 лет'],
  },
  { 
    id: 2, 
    title: 'Python Developer', 
    company: 'Data Ltd', 
    location: 'Warsaw',
    country: 'Poland',
    salary_min: 40000,
    salary_max: 60000,
    currency: 'EUR',
    description: 'Разработка бэкенд-сервисов на Python. Работа с большими данными и API.',
    requirements: ['Python 3.10+', 'FastAPI/Django', 'PostgreSQL', 'Английский B1+'],
  },
  { 
    id: 3, 
    title: 'iOS Developer', 
    company: 'Apple Inc', 
    location: 'Cupertino',
    country: 'USA',
    salary_min: 120000,
    salary_max: 160000,
    currency: 'USD',
    description: 'Разработка нативных iOS приложений для глобальных продуктов.',
    requirements: ['Swift', 'SwiftUI', 'iOS SDK', 'Английский C1'],
  },
  { 
    id: 4, 
    title: 'Java Developer', 
    company: 'Bank AG', 
    location: 'Frankfurt',
    country: 'Germany',
    salary_min: 65000,
    salary_max: 85000,
    currency: 'EUR',
    description: 'Разработка корпоративных банковских систем.',
    requirements: ['Java 17', 'Spring Boot', 'Microservices', 'Kafka'],
  },
  { 
    id: 5, 
    title: 'DevOps Engineer', 
    company: 'Cloud Systems', 
    location: 'Amsterdam',
    country: 'Netherlands',
    salary_min: 70000,
    salary_max: 90000,
    currency: 'EUR',
    description: 'Управление инфраструктурой и CI/CD процессами.',
    requirements: ['AWS', 'Kubernetes', 'Terraform', 'GitHub Actions'],
  },
];