
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from rest_framework_simplejwt import views as jwt_views
from django.conf import settings
from django.conf.urls.static import static
# from django.conf.urls import url
from django.views.static import serve
from apps.modelo import views 
                          
urlpatterns = [
    path('api_auth/', include('rest_framework.urls')),
    path('admin/', admin.site.urls),

    #CONSULTAS
    path('modelo/predecir', views.realizarPrediccion.as_view()),
    path('modelo/traerComunas', views.traerComunas.as_view()),

    # #Angular APP
    # re_path(r'^$', views.index, name='index'),

    # # REACT APP
    # path('',TemplateView.as_view(template_name="index.html")),
    # re_path(r'^(?:.*)/?$',TemplateView.as_view(template_name='index.html')),
    # re_path(r'^',views.ReactAppView.as_view()),

]+static(settings.MEDIA_URL,document_root= settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns+=static(settings.STATIC_URL,document_root= settings.STATIC_ROOT)
    urlpatterns+=static(settings.MEDIA_URL,document_root= settings.MEDIA_ROOT)