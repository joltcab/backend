# 🔐 Configuración de Google OAuth para JoltCab

## 📋 Resumen de Cambios

Se han corregido errores críticos en el sistema de autenticación con Google OAuth que impedían su funcionamiento correcto.

### ✅ Errores Corregidos:

1. **Variable `googleAuthUrl` no definida** - Ahora se crea correctamente con la URL de Google OAuth
2. **Falta URL base de Google** - Se agregó `https://accounts.google.com/o/oauth2/v2/auth`
3. **Mejor manejo de errores** - Se agregó logging para debugging

---

## 🚀 Configuración en Google Cloud Console

### Paso 1: Crear Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API** o **Google Identity Services**

### Paso 2: Configurar OAuth Consent Screen

1. Ve a **APIs & Services** > **OAuth consent screen**
2. Selecciona **External** (para usuarios públicos)
3. Completa la información requerida:
   - **App name**: JoltCab
   - **User support email**: Tu email
   - **Developer contact**: Tu email
4. Agrega los scopes necesarios:
   - `openid`
   - `email`
   - `profile`
5. Guarda y continúa

### Paso 3: Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services** > **Credentials**
2. Click en **Create Credentials** > **OAuth client ID**
3. Selecciona **Web application**
4. Configura:
   - **Name**: JoltCab Backend
   - **Authorized JavaScript origins**:
     ```
     https://tu-dominio-railway.up.railway.app
     http://localhost:4000 (para desarrollo)
     ```
   - **Authorized redirect URIs**:
     ```
     https://tu-dominio-railway.up.railway.app/api/v1/auth/google/callback
     http://localhost:4000/api/v1/auth/google/callback (para desarrollo)
     ```
5. Click en **Create**
6. **Guarda el Client ID y Client Secret** - los necesitarás para Railway

---

## ⚙️ Configuración en Railway (Backend)

### Variables de Entorno Requeridas:

Agrega estas variables en tu proyecto de Railway:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret

# URLs
BACKEND_URL=https://tu-dominio-railway.up.railway.app
FRONTEND_URL=https://tu-dominio-vercel.app

# CORS - Importante para que funcione con Vercel
ALLOWED_ORIGINS=https://tu-dominio-vercel.app,http://localhost:5173
```

### Pasos en Railway:

1. Ve a tu proyecto en Railway
2. Click en **Variables**
3. Agrega cada variable con su valor correspondiente
4. Railway redesplegará automáticamente

---

## 🌐 Configuración en Vercel (Frontend)

### Variables de Entorno Requeridas:

```bash
VITE_API_URL=https://tu-dominio-railway.up.railway.app/api/v1
VITE_BACKEND_URL=https://tu-dominio-railway.up.railway.app
```

### Pasos en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Agrega las variables
4. Redespliega el frontend

---

## 🔄 Flujo de Autenticación

### Cómo Funciona:

1. **Usuario hace click en "Sign in with Google"** en el frontend
2. **Frontend redirige a**: `https://tu-backend.railway.app/api/v1/auth/google?role=admin&callback=/GoogleCallback`
3. **Backend redirige a Google** con los parámetros correctos
4. **Usuario autoriza en Google**
5. **Google redirige de vuelta al backend**: `/api/v1/auth/google/callback?code=...&state=...`
6. **Backend procesa el código**:
   - Intercambia el código por tokens de acceso
   - Obtiene información del usuario de Google
   - Crea o actualiza el usuario en la base de datos
   - Genera un JWT token
7. **Backend redirige al frontend**: `https://tu-frontend.vercel.app/GoogleCallback?token=...`
8. **Frontend guarda el token** y autentica al usuario

---

## 🧪 Testing

### Desarrollo Local:

1. Asegúrate de tener las variables en tu `.env`:
```bash
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret
BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

2. Inicia el backend:
```bash
npm run dev
```

3. Prueba el endpoint:
```bash
curl http://localhost:4000/api/v1/auth/google?role=admin
```

Deberías ser redirigido a Google OAuth.

### Producción:

1. Verifica que todas las variables estén configuradas en Railway
2. Verifica que las URLs de redirección en Google Cloud Console coincidan exactamente
3. Prueba desde tu frontend en Vercel

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Causa**: La URL de redirección no coincide con las configuradas en Google Cloud Console.

**Solución**:
1. Verifica que `BACKEND_URL` en Railway sea exactamente igual a tu dominio de Railway
2. Verifica que en Google Cloud Console tengas:
   ```
   https://tu-dominio-railway.up.railway.app/api/v1/auth/google/callback
   ```
3. No olvides el `/api/v1/auth/google/callback` al final

### Error: "CORS blocked"

**Causa**: El frontend no está en la lista de orígenes permitidos.

**Solución**:
1. Agrega tu dominio de Vercel a `ALLOWED_ORIGINS` en Railway:
   ```
   ALLOWED_ORIGINS=https://tu-dominio-vercel.app
   ```
2. Redespliega Railway

### Error: "Google OAuth not configured"

**Causa**: Falta `GOOGLE_CLIENT_ID` en las variables de entorno.

**Solución**:
1. Verifica que `GOOGLE_CLIENT_ID` esté configurado en Railway
2. Redespliega

### Error: "token_exchange_failed"

**Causa**: El `GOOGLE_CLIENT_SECRET` es incorrecto o falta.

**Solución**:
1. Verifica que `GOOGLE_CLIENT_SECRET` esté correctamente configurado en Railway
2. Verifica que sea el secret correcto de Google Cloud Console

---

## 📝 Checklist de Verificación

Antes de probar en producción, verifica:

- [ ] Google Cloud Console configurado correctamente
- [ ] OAuth Consent Screen completado
- [ ] Credenciales OAuth 2.0 creadas
- [ ] Redirect URIs configuradas en Google Cloud Console
- [ ] `GOOGLE_CLIENT_ID` configurado en Railway
- [ ] `GOOGLE_CLIENT_SECRET` configurado en Railway
- [ ] `BACKEND_URL` configurado en Railway (sin `/` al final)
- [ ] `FRONTEND_URL` configurado en Railway (sin `/` al final)
- [ ] `ALLOWED_ORIGINS` incluye tu dominio de Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] Backend redesplegado en Railway
- [ ] Frontend redesplegado en Vercel

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de Railway para ver errores específicos
2. Verifica que todas las URLs coincidan exactamente (sin espacios, sin `/` al final)
3. Usa las herramientas de desarrollo del navegador para ver errores de CORS
4. Verifica que el `trust proxy` esté habilitado en el servidor (ya está configurado)

---

## 🎉 ¡Listo!

Una vez configurado todo correctamente, el flujo de Google OAuth debería funcionar sin problemas tanto en desarrollo como en producción.