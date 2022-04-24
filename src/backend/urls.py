
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.modelo import views 
                          
urlpatterns = [
    path('api_auth/', include('rest_framework.urls')),
    path('admin/', admin.site.urls),

    #CONSULTAS
    path('modelo/predecir', views.realizarPrediccion.as_view()),
    path('modelo/traerComunas', views.traerComunas.as_view()),
]

if settings.DEBUG:
    urlpatterns+=static(settings.STATIC_URL,document_root= settings.STATIC_ROOT)
    urlpatterns+=static(settings.MEDIA_URL,document_root= settings.MEDIA_ROOT)