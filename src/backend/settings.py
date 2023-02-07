
from pathlib import Path
import os
from datetime import timedelta
# from django.conf.global_settings import DATETIME_INPUT_FORMATS, DATE_INPUT_FORMATS

# Set your auth user to the new user you have created
# AUTH_USER_MODEL = 'api.User'

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # Path(__file__).resolve().parent.parent
BASE_DIR_GENERAL = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REACT_APP = '../web/build' 

RUN_SERVER_PORT = '8080'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-8%&1lo_wmv)y-e)v9+u-jy=u1l3mp@w+yt-)dwwix^nz@=dk%s'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True    

# Aplicacion de react

# REACT_APP = '../../Pagina_Colegio' 

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'django_filters',
    'corsheaders',
    'django_extensions',
    
    'apps.modelo',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ALLOWED_HOSTS = [
    "naturaliafood.cl",
    "www.naturaliafood.cl",
    "localhost",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ORIGIN_WHITELIST = (
    'http://naturaliafood.cl',
    'http://www.naturaliafood.cl',
    'https://naturaliafood.cl',
    'https://www.naturaliafood.cl',
    'http://naturaliafood.cl',
    'http://www.naturaliafood.cl',

    'http://localhost:4200',
    'https://localhost:4200',
)

CORS_ALLOWED_ORIGIN_REGEXES = (
    r'^naturaliafood.cl$',
    r'^www.naturaliafood.cl$',

    r'^localhost:4200$',
)

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]


ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # 'DIRS': [
        #     os.path.join(BASE_DIR_GENERAL, 'web', 'build'),
        # ],
        # 'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# TEMPLATE_DIRS = [
#     os.path.join(BASE_DIR_GENERAL, 'web', 'build'),
# ]
     


WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME':  os.path.join(BASE_DIR, 'db.sqlite3'), #BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/
STATIC_URL = "/static/"
MEDIA_URL = "/media/"
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
STATIC_ROOT = os.path.join(BASE_DIR, "static_root")
MEDIA_ROOT = os.path.join(BASE_DIR, "media_root")

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
WHITENOISE_INDEX_FILE = True

# REST framework settings
REST_FRAMEWORK = {

    'DATE_INPUT_FORMATS' : [
        '%d-%m-%Y',
        '%Y-%m-%d',
        '%d/%m/%Y',
        '%Y/%m/%d'
    ],
    'DATETIME_INPUT_FORMATS' : [
        '%Y-%m-%d %H:%M', 
        '%d-%m-%Y %H:%M',
        '%Y/%m/%d %H:%M', 
        '%d/%m/%Y %H:%M',
        '%Y-%m-%dT%H:%M:%S.%fZ',
        '%Y/%m/%dT%H:%M:%S.%fZ',
        '%Y-%m-%dT%H:%M:%SZ',
        '%Y/%m/%dT%H:%M:%SZ',
        '%b. %d, %Y, %H:%M %p'
    ],
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication'
    ),
    'DEFAULT_RENDERER_CLASSES': ( ### para produccion, elimina o no permite la aparicion de interfaz restframework
        'rest_framework.renderers.JSONRenderer',
    ),
}

# Configure the JWT settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=120),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=14),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('JWT',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}