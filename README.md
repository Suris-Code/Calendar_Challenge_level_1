# 📅 Proyecto de Calendario - Entrega Urgente al Cliente

## 🎬 La Situación
¡Bienvenido al equipo! Te acabas de incorporar a la empresa y **tienes una misión crítica**: el equipo de desarrollo anterior trabajó durante meses en una aplicación de gestión de calendario para un cliente importante, pero tuvieron que abandonar el proyecto por circunstancias imprevistas.

**El cliente está esperando la entrega final** y confía en que podamos completar el trabajo. La buena noticia es que el sistema está **casi terminado** - la mala noticia es que puede tener algunos problemas y funcionalidades incompletas que necesitas identificar y resolver **antes de la entrega**.

## 🎯 Tu Misión
Como el nuevo desarrollador a cargo, debes:
1. **Heredar el código existente** y entender qué construyó el equipo anterior
2. **Identificar qué está funcionando y qué no** en el sistema actual
3. **Completar las funcionalidades faltantes** y corregir cualquier error
4. **Entregar un producto funcional** que cumpla con todos los requisitos del cliente

## 📋 Requisitos del Cliente (Lo que Esperan Recibir)

### 🗓️ Sistema de Gestión de Citas Completo
El cliente necesita una aplicación donde sus usuarios puedan:

#### Crear y Gestionar Citas
- **Título**: Campo obligatorio (máximo 200 caracteres)
- **Descripción**: Campo obligatorio (máximo 2000 caracteres)  
- **Fecha y hora de inicio**: Campo obligatorio
- **Fecha y hora de finalización**: Campo obligatorio
- **Ubicación**: Campo opcional (máximo 500 caracteres)

#### Visualizar el Calendario
- **Vista Mensual**: Cuadrícula con todas las citas del mes
- **Vista Semanal**: Distribución por días con franjas horarias
- **Vista Diaria**: Detalle completo de las citas del día
- **Navegación**: Moverse fácilmente entre diferentes períodos

#### Funcionalidades Avanzadas
- Editar cualquier cita existente
- Eliminar citas con confirmación
- **Drag & Drop de citas** para reprogramarlas visualmente

#### Dashboard y Estadísticas
- **Panel de Control**: Vista general con métricas importantes del período seleccionado
- **Estadísticas Dinámicas**: 
  - Total de eventos en el período
  - Día con más eventos programados
  - Día con más horas acumuladas
  - Día con mayor ocupación porcentual
- **Selector de Rango de Fechas**: Filtrar estadísticas por período personalizado
- **Indicadores Visuales**: Cards informativos con iconos y descripciones claras

### ⚠️ Reglas de Negocio Críticas (No Negociables)
El cliente fue **muy específico** con estas restricciones que DEBEN funcionar:

1. **Máximo 5 citas por día** por usuario
2. **Máximo 6 horas acumuladas** de eventos por día
3. **Sin superposición de horarios** entre citas
4. **Validación de fechas**: La hora de fin debe ser posterior a la de inicio

### 🔐 Seguridad y Acceso
- Cada usuario solo puede ver y gestionar sus propias citas
- Sistema de autenticación seguro

## 🛠️ Lo que Dejó el Equipo Anterior

### Frontend (React + TypeScript)
- Configuración con **Vite** para desarrollo rápido
- **Schedule-X** como librería de calendario con drag & drop
- **Tailwind CSS** para estilos modernos
- **Zustand** para manejo de estado
- Sistema de **notificaciones toast**

### Backend (.NET Core)
- **Clean Architecture** con separación de capas
- **CQRS con MediatR** para comandos y consultas
- **Entity Framework Core** para base de datos
- **Autenticación con Cookies**
- Sistema de **auditoría y logging**

### Estructura del Proyecto
```
/
├── ReactNet.Server/          # Backend API (.NET)
│   ├── Domain/              # Entidades y reglas de negocio
│   ├── Application/         # Casos de uso y CQRS
│   ├── Infrastructure/      # Acceso a datos y servicios externos
│   └── WebAPI/             # Controladores y configuración
└── reactnet.client/        # Frontend React
    ├── src/
    │   ├── components/     # Componentes reutilizables
    │   ├── pages/         # Páginas principales
    │   ├── services/      # Llamadas a API
    │   └── stores/        # Manejo de estado
    └── public/
```

## 🚀 Cómo Empezar tu Investigación

### Configurar el Entorno
```bash
# Backend - desde la raíz del proyecto
dotnet build
dotnet run --project ReactNet.Server
# Disponible en: https://localhost:7154

# Frontend - en otra terminal
cd reactnet.client
npm install
npm run dev
# Disponible en: http://localhost:5173
```

### Credenciales de Prueba
- **Usuario**: candidato@suriscode.com
- **Contraseña**: Suris-challenge-2025

## 💡 Consejos del Mentor

1. **No te apresures** - Dedica tiempo a entender antes de cambiar
2. **Respeta el trabajo anterior** - El equipo tenía buenas razones para sus decisiones
3. **Prueba constantemente** - Cada cambio debe acercarte a los requisitos del cliente
4. **Piensa en el usuario final** - El cliente evaluará la experiencia completa
5. **Documenta tu proceso** - Será valioso para futuras entregas

## 🆘 Soporte de Emergencia
Si encuentras bloqueadores críticos o tienes dudas sobre los requisitos del cliente, contacta inmediatamente al equipo de evaluación.

---
**El cliente confía en ti. ¡Es hora de brillar! 🌟**

