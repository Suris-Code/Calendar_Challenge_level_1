import { env } from 'process';

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7138';

const defaultProxyOptions = {
    target,
    secure: false
}

const endpoints = {
    '^/api/AuthManagement': defaultProxyOptions,
    '^/api/SecurityManagement': defaultProxyOptions,
    '^/api/Appointments': defaultProxyOptions,
    '^/api/Dashboard': defaultProxyOptions,
}

export { endpoints };
