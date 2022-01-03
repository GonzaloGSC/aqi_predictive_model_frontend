from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
# from rest_framework.decorators import authentication_classes
from rest_framework.views import APIView
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer

import numpy as np
# import pandas as pd
import pickle
import sklearn
import datetime
import copy
import json
import os
from backend.settings import BASE_DIR, REACT_APP, BASE_DIR_GENERAL

from .serializers import (
    realizarPrediccionSerializer,
)
from .models import (
    modeloRespuesta,
)

def index(request): #PARA WEB
    return render(request, 'index.html', content_type="text/html")

# @api_view(('GET', ))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
class ReactAppView(View):
    permission_classes = (AllowAny,)  # IsAuthenticated
    def get(self, request):
        # try:
        # open(BASE_DIR_GENERAL + '\\web\\build\\index.html')
        with (os.path.join(REACT_APP, 'web', 'build', 'index.html'), 'rb') as file:
            return HttpResponse(file.read(), content_type='text/html')
        # except :
        #     status_code = status.HTTP_501_NOT_IMPLEMENTED
        #     response = {
        #         'success': False,
        #         'statusCode': status_code,
        #         'message': """index.html no encontrado ! parece que la app no existe :)   oh no...""",
        #         "data": None
        #     }
        #     return JsonResponse(response, status=status_code)

class traerComunas(APIView):
    serializer_class = realizarPrediccionSerializer
    permission_classes = (AllowAny,)  # IsAuthenticated
    def post(self, request, *args, **kwargs):
        try:
            comunas = [
                {
                    'nombre': "Talagante",
                    'id': 0,
                },
                {
                    'nombre': "Pudahuel",
                    'id': 1,
                },
                {
                    'nombre': "Santiago",
                    'id': 2,
                },
                {
                    'nombre': "Puente Alto",
                    'id': 3,
                },
                {
                    'nombre': "La Florida",
                    'id': 4,
                },
                {
                    'nombre': "Las Condes",
                    'id': 5,
                },
                {
                    'nombre': "Independencia",
                    'id': 6,
                },
                {
                    'nombre': "El Bosque",
                    'id': 7,
                },
                {
                    'nombre': "Cerro Navia",
                    'id': 8,
                },
                {
                    'nombre': "Cerrillos",
                    'id': 9,
                },
            ]

            response = {
                'success': True,
                'error': None,
                'message': 'Prediccion realizada exitosamente.',
                'data': comunas,
            }
            return Response(response, status.HTTP_200_OK)
        except:
            response = {
                'success': False,
                'error': 0,
                'message': 'Error de procesamiento. Si el problema persiste, contacte con un administrador.',
                'data': [],
            }
            return Response(response, status.HTTP_500_INTERNAL_SERVER_ERROR)


# @renderer_classes((TemplateHTMLRenderer, JSONRenderer))
# @authentication_classes([])
class realizarPrediccion(APIView):
    serializer_class = realizarPrediccionSerializer
    permission_classes = (AllowAny,)  # IsAuthenticated

    # def test():
    #     arregloPM25 = np.array([32,42,45,55,48,53,50,50,52,45,47,53,37,34,39,36,39,47,50,49,57,54,50,48,56,53,40,20,37,44,45], dtype="float")

    #     arregloPM10 = np.array([44,45,49,49,44,39,49,52,38,43,52,31,34,45,42,41,48,46,46,48,49,45,45,53,50,30,21,38,41,46,44], dtype="float")

    #     arregloO3 = np.array([39,43,42,34,44,46,43,31,30,47,32,25,38,34,28,32,39,36,50,52,31,31,42,39,31,28,28,31,34,39,34], dtype="float")

    #     arregloNO2 = np.array([13,14,17,14,12,11,16,15,10,18,15,7,8,12,12,10,14,12,13,15,12,10,11,18,13,7,4,8,11,13,17], dtype="float")

    #     arregloCO= np.array([4,4,5,5,5,6,6,5,4,29,2,0,0,1,1,1,2,6,6,7,5,4,5,6,5,4,3,4,4,4,4], dtype="float")

    #     for index in range(0,31):
    #         indice1 = realizarPrediccion.calcularAqi(arregloPM25[index], "pm25")
    #         indice2 = realizarPrediccion.calcularAqi(arregloPM10[index], "pm10")
    #         indice3 = realizarPrediccion.calcularAqi(arregloO3[index], "o3")
    #         indice4 = realizarPrediccion.calcularAqi(arregloNO2[index], "no2")
    #         indice5 = realizarPrediccion.calcularAqi(arregloCO[index], "co")
    #         arreglo = np.array([indice1, indice2, indice3, indice4, indice5], dtype="float")
    #         print(arreglo.max())



    def ajustarParametro(val: float, max: float, min: float):
        return round(((val-min)/(max-min)), 6)

    def rectaSubida(arreglo: list, max: float, min: float):
        diferencia = max - min - 1;
        porcion = diferencia / len(arreglo)
        temporal = []
        valor:float = min
        for index in range(0, len(arreglo)):
            valor = valor + porcion
            temporal.append(int(valor))
        # print("rectaSubida: ", temporal)
        return temporal
    
    def rectaBajada(arreglo: list, max: float, min: float):
        diferencia = max - min - 1;
        porcion = diferencia / len(arreglo)
        temporal = []
        valor:float = max
        for index in range(0, len(arreglo)):
            valor = valor - porcion
            temporal.append(int(valor))
        # print("rectaBajada: ", temporal)
        return temporal

    def curvaSubida(arreglo: list, max: float, min: float):
        diferencia = max - min - 1;
        porcion = diferencia / len(arreglo)
        temporal = []
        valor:float = min
        for index in range(0, len(arreglo)):
            if index <= int(len(arreglo)/2):
                valor = valor + porcion
            else:
                valor = valor - porcion
            temporal.append(int(valor))
        # print("curvaSubida: ", temporal)
        return temporal

    def curvaBajada(arreglo: list, max: float, min: float):
        diferencia = max - min - 1;
        porcion = diferencia / len(arreglo)
        temporal = []
        valor:float = max
        for index in range(0, len(arreglo)):
            if index <= int(len(arreglo)/2):
                valor = valor - porcion
            else:
                valor = valor + porcion
            temporal.append(int(valor))
        # print("curvaBajada: ", temporal)
        return temporal

    def definirCurva(arreglo: list):
        # print('definirCurva: ', arreglo)
        nivel_1_min = 0
        nivel_1_max = 50
        nivel_2_min = 50
        nivel_2_max = 100
        nivel_3_min = 100
        nivel_3_max = 150
        nivel_4_min = 150
        nivel_4_max = 200
        nivel_5_min = 200
        nivel_5_max = 300
        maximo = 0
        minimo = 0
        respuesta = []
        for index in range(0, len(arreglo)):
            anterior = 0
            actual = arreglo[index][0]
            siguiente = 0
            if actual == 1:
                maximo = nivel_1_max
                minimo = nivel_1_min
            if actual == 2:
                maximo = nivel_2_max
                minimo = nivel_2_min
            if actual == 3:
                maximo = nivel_3_max
                minimo = nivel_3_min
            if actual == 4:
                maximo = nivel_4_max
                minimo = nivel_4_min
            if actual == 5:
                maximo = nivel_5_max
                minimo = nivel_5_min
            if index == 0:
                anterior = arreglo[index][0]
                if len(arreglo) > 1:
                    anterior = arreglo[index+1][0]
            else:
                anterior = arreglo[index-1][0]
            if index == len(arreglo)-1:
                siguiente = arreglo[index][0]
                if len(arreglo) > 1:
                    siguiente = arreglo[index-1][0]
            else:
                siguiente = arreglo[index+1][0]
            if actual > anterior and actual < siguiente:
                respuesta = respuesta + realizarPrediccion.rectaSubida(arreglo[index], maximo, minimo)
            elif actual < anterior and actual > siguiente:
                respuesta = respuesta + realizarPrediccion.rectaBajada(arreglo[index], maximo, minimo)
            elif actual > anterior and actual > siguiente:
                respuesta = respuesta + realizarPrediccion.curvaSubida(arreglo[index], maximo, minimo)
            elif actual < anterior and actual < siguiente:
                respuesta = respuesta + realizarPrediccion.curvaBajada(arreglo[index], maximo, minimo)
            else:
                respuesta = respuesta + realizarPrediccion.rectaSubida(arreglo[index], maximo, minimo)
        return respuesta

    def calcularAqi(val: float, componente: str):
        indice = 0.000000
        if componente == "co":
            if val <= 4.4:
                Il = 0
                Ih = 50
                Cl = 0
                Ch = 4.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 4.4 and val <= 9.4:
                Il = 51
                Ih = 100
                Cl = 4.5
                Ch = 9.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 9.4 and val <= 12.4:
                Il = 101
                Ih = 150
                Cl = 9.5
                Ch = 12.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 12.4 and val <= 15.4:
                Il = 151
                Ih = 200
                Cl = 12.5
                Ch = 15.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 15.4 and val <= 30.4:
                Il = 200
                Ih = 300
                Cl = 15.5
                Ch = 30.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 30.4 and val <= 40.4:
                Il = 301
                Ih = 400
                Cl = 30.5
                Ch = 40.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 40.4:
                Il = 401
                Ih = 500
                Cl = 40.5
                Ch = 50.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il

        if componente == "no2":
            if val <= 53:
                Il = 0
                Ih = 50
                Cl = 0
                Ch = 53
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 53 and val <= 100:
                Il = 51
                Ih = 100
                Cl = 54
                Ch = 100
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 100 and val <= 360:
                Il = 101
                Ih = 150
                Cl = 101
                Ch = 360
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 360 and val <= 649:
                Il = 151
                Ih = 200
                Cl = 361
                Ch = 649
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 649 and val <= 1249:
                Il = 200
                Ih = 300
                Cl = 650
                Ch = 1249
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 1249 and val <= 1649:
                Il = 301
                Ih = 400
                Cl = 1250
                Ch = 1649
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 1649:
                Il = 401
                Ih = 500
                Cl = 1650
                Ch = 2049
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il

        if componente == "o3":
            if val <= 54:
                Il = 0
                Ih = 50
                Cl = 0
                Ch = 54
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 54 and val <= 70:
                Il = 51
                Ih = 100
                Cl = 55
                Ch = 70
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 70 and val <= 85:
                Il = 101
                Ih = 150
                Cl = 71
                Ch = 85
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 85 and val <= 105:
                Il = 151
                Ih = 200
                Cl = 86
                Ch = 105
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 105:
                Il = 200
                Ih = 300
                Cl = 106
                Ch = 200
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il

        if componente == "pm10":
            if val <= 54:
                Il = 0
                Ih = 50
                Cl = 0
                Ch = 54
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 54 and val <= 154:
                Il = 51
                Ih = 100
                Cl = 55
                Ch = 154
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 154 and val <= 254:
                Il = 101
                Ih = 150
                Cl = 155
                Ch = 254
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 254 and val <= 354:
                Il = 151
                Ih = 200
                Cl = 255
                Ch = 354
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 354 and val <= 424:
                Il = 200
                Ih = 300
                Cl = 354
                Ch = 424
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 424 and val <= 504:
                Il = 301
                Ih = 400
                Cl = 425
                Ch = 504
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 504:
                Il = 401
                Ih = 500
                Cl = 505
                Ch = 604
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il

        if componente == "pm25":
            if val <= 12:
                Il = 0
                Ih = 50
                Cl = 0
                Ch = 12
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 12 and val <= 35.4:
                Il = 51
                Ih = 100
                Cl = 12.1
                Ch = 35.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 35.4 and val <= 55.4:
                Il = 101
                Ih = 150
                Cl = 35.5
                Ch = 55.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 55.4 and val <= 150.4:
                Il = 151
                Ih = 200
                Cl = 55.5
                Ch = 150.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 150.4 and val <= 250.4:
                Il = 200
                Ih = 300
                Cl = 150.5
                Ch = 250.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 250.4 and val <= 350.4:
                Il = 301
                Ih = 400
                Cl = 250.5
                Ch = 350.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
            if val > 350.4:
                Il = 401
                Ih = 500
                Cl = 350.5
                Ch = 500.4
                indice_fraccion = (Ih - Il)/(Ch - Cl)
                indice = (indice_fraccion * (val - Cl)) + Il
        return indice

    def post(self, request, *args, **kwargs):
        # try:
        # realizarPrediccion.test()
        body_unicode = request.body.decode('utf-8')
        body_data = json.loads(body_unicode)
        i_pm25 = body_data['pm25']
        i_pm10 = body_data['pm10']
        i_o3 = body_data['o3']
        i_no2 = body_data['no2']
        i_co = body_data['co']
        i_temperatura = body_data['temperatura']

        i_codigo_comuna = body_data['codigo_comuna']
        i_fecha_d = body_data['fecha_d']
        i_fecha_m = body_data['fecha_m']
        i_fecha_y = body_data['fecha_y']

        i_pm25_prom:float = 71.152611
        i_pm10_prom:float = 51.406576
        i_o3_prom:float = 25.441282
        i_no2_prom:float = 16.942445
        i_co_prom:float = 6.849192
        i_temperatura_prom:float = 16.623137

        i_pm25_min:float = 1.000000
        i_pm10_min:float = 10.000000
        i_o3_min:float = 1.000000
        i_no2_min:float = 1.000000
        i_co_min:float = 1.000000
        i_codigo_comuna_min:float = 0.000000
        i_fecha_d_min:float = 1.000000
        i_fecha_m_min:float = 1.000000
        i_fecha_y_min:float = 2014.000000
        i_dia_futuro_min:float = 1.000000
        i_aqi_max_actual_min:float = 21.296296
        i_aqi_mean_actual_min:float = 15.441681
        i_temperatura_min:float = 0.600000

        i_pm25_max:float = 162.000000
        i_pm10_max:float = 98.000000
        i_o3_max:float = 60.000000
        i_no2_max:float = 43.000000
        i_co_max:float = 19.000000
        i_codigo_comuna_max:float = 9.000000
        i_fecha_d_max:float = 31.000000
        i_fecha_m_max:float = 12.000000
        i_fecha_y_max:float = 2021.000000
        i_dia_futuro_max:float = 30.000000
        i_aqi_max_actual_max:float = 223.489933
        i_aqi_mean_actual_max:float = 113.633873
        i_temperatura_max:float = 30.766667

        if (i_codigo_comuna == None or i_codigo_comuna < 0 or i_codigo_comuna > 9):
            response = {
                'success': False,
                'error': 1,
                'message': 'Ingreso de datos incorrecto, debe ingresar una comuna.',
                'data': []
            }
            return Response(response, status.HTTP_200_OK)
        if (i_fecha_d == None or i_fecha_d <= 0 or i_fecha_m == None or i_fecha_m <= 0 or i_fecha_y == None or i_fecha_y <= 0):
            response = {
                'success': False,
                'error': 2,
                'message': 'Ingreso de datos incorrecto, debe ingresar fecha.',
                'data': []
            }
            return Response(response, status.HTTP_200_OK)
        if ((i_pm25 == None or i_pm25 <= 0) and
            (i_pm10 == None or i_pm10 <= 0) and
            (i_o3 == None or i_o3 <= 0) and
            (i_no2 == None or i_no2 <= 0) and
                (i_co == None or i_co <= 0)):
            response = {
                'success': False,
                'error': 3,
                'message': 'Ingreso de datos incorrecto, debe ingresar al menos un material o compuesto.',
                'data': []
            }
            return Response(response, status.HTTP_200_OK)

        if (i_pm25 == None or i_pm25 < 0):
            i_pm25 = 0
        if (i_pm10 == None or i_pm10 < 0):
            i_pm10 = 0
        if (i_o3 == None or i_o3 < 0):
            i_o3 = 0
        if (i_no2 == None or i_no2 < 0):
            i_no2 = 0
        if (i_co == None or i_co < 0):
            i_co = 0
        if (i_temperatura == None or i_temperatura < 0):
            i_co = 0

        aqi_pm25 = realizarPrediccion.calcularAqi(i_pm25, "pm25")
        aqi_pm10 = realizarPrediccion.calcularAqi(i_pm10, "pm10")
        aqi_o3 = realizarPrediccion.calcularAqi(i_o3, "o3")
        aqi_no2 = realizarPrediccion.calcularAqi(i_no2, "no2")
        aqi_co = realizarPrediccion.calcularAqi(i_co, "co")
        arreglo_aqi = [aqi_pm25, aqi_pm10, aqi_o3, aqi_no2, aqi_co]
        i_aqi_max_actual = 0
        temporal_suma = 0
        for i in range(0, len(arreglo_aqi)):
            temporal_suma = temporal_suma + arreglo_aqi[i]
            if (arreglo_aqi[i] > i_aqi_max_actual):
                i_aqi_max_actual = arreglo_aqi[i]
        # i_aqi_max_actual = arreglo_aqi.max()
        i_aqi_mean_actual = temporal_suma/len(arreglo_aqi)

        i_aqi_max_actual_final = realizarPrediccion.ajustarParametro(i_aqi_max_actual, i_aqi_max_actual_max, i_aqi_max_actual_min)
        i_aqi_mean_actual_final = realizarPrediccion.ajustarParametro(i_aqi_mean_actual, i_aqi_mean_actual_max, i_aqi_mean_actual_min)
        i_pm25_final = realizarPrediccion.ajustarParametro(i_pm25, i_pm25_max, i_pm25_min)
        i_pm10_final = realizarPrediccion.ajustarParametro(i_pm10, i_pm10_max, i_pm10_min)
        i_o3_final = realizarPrediccion.ajustarParametro(i_o3, i_o3_max, i_o3_min)
        i_no2_final = realizarPrediccion.ajustarParametro(i_no2, i_no2_max, i_no2_min)
        i_co_final = realizarPrediccion.ajustarParametro(i_co, i_co_max, i_co_min)
        i_codigo_comuna_final = realizarPrediccion.ajustarParametro(i_codigo_comuna, i_codigo_comuna_max, i_codigo_comuna_min)
        i_fecha_d_final = realizarPrediccion.ajustarParametro(i_fecha_d, i_fecha_d_max, i_fecha_d_min)
        i_fecha_m_final = realizarPrediccion.ajustarParametro(i_fecha_m, i_fecha_m_max, i_fecha_m_min)
        i_fecha_y_final = realizarPrediccion.ajustarParametro(i_fecha_y, i_fecha_y_max, i_fecha_y_min)
        i_temperatura_final = realizarPrediccion.ajustarParametro(i_temperatura, i_temperatura_max, i_temperatura_min)

        # data = {}
        a_aqi_max_actual = []
        a_aqi_mean_actual = []
        a_pm25 = []
        a_pm10 = []
        a_o3 = []
        a_no2 = []
        a_co = []
        a_codigo_comuna = []
        a_fecha_d = []
        a_fecha_m = []
        a_fecha_y = []
        a_dia_futuro = []
        a_temperatura_final = []

        fechas = []
        fecha_inicial = datetime.datetime(int(i_fecha_y), int(i_fecha_m), int(i_fecha_d))
        for num in range(1, 31):
            fecha_inicial = fecha_inicial + datetime.timedelta(days=1)
            fechas.append(fecha_inicial)
            a_aqi_max_actual.append(i_aqi_max_actual_final)
            a_aqi_mean_actual.append(i_aqi_mean_actual_final)
            a_pm25.append(i_pm25_final)
            a_pm10.append(i_pm10_final)
            a_o3.append(i_o3_final)
            a_no2.append(i_no2_final)
            a_co.append(i_co_final)
            a_codigo_comuna.append(i_codigo_comuna_final)
            a_fecha_d.append(i_fecha_d_final)
            a_fecha_m.append(i_fecha_m_final)
            a_fecha_y.append(i_fecha_y_final)
            a_dia_futuro.append(realizarPrediccion.ajustarParametro(num, i_dia_futuro_max, i_dia_futuro_min))
            a_temperatura_final.append(i_temperatura_final)
            
        data = np.array([a_pm25, a_pm10, a_o3, a_no2, a_co, a_codigo_comuna, a_fecha_d, a_fecha_m, a_fecha_y, a_dia_futuro, a_aqi_max_actual, a_aqi_mean_actual, a_temperatura_final]).T
        # data["pm25"] = a_pm25
        # data["pm10"] = a_pm10
        # data["o3"] = a_o3
        # data["no2"] = a_no2
        # data["co"] = a_co
        # data["codigo_comuna"] = a_codigo_comuna
        # data["fecha_d"] = a_fecha_d
        # data["fecha_m"] = a_fecha_m
        # data["fecha_y"] = a_fecha_y
        # data["dia_futuro"] = a_dia_futuro
        # data["aqi_max_actual"] = a_aqi_max_actual
        # data["aqi_mean_actual"] = a_aqi_mean_actual
        # data["temperatura"] = a_temperatura_final

        filename = BASE_DIR + '\\modelo1.sav'
        loaded_model = pickle.load(open(filename, 'rb'))
        result = loaded_model.predict(data)
        marcaAnterior = 0
        marca = 0
        arregloTemporal = []
        arregloNiveles = []
        for index in range(0,len(result)):
            if index == 0:
                marca = result[index]
                marcaAnterior = result[index]
            else:
                marca = result[index]
            if marca == marcaAnterior:
                arregloTemporal.append(marca)
                if index == len(result)-1:
                    arregloNiveles.append(arregloTemporal)
            else:
                arregloNiveles.append(arregloTemporal)
                arregloTemporal = []
                arregloTemporal.append(marca)
                marcaAnterior = copy.copy(marca)

        
        curva = realizarPrediccion.definirCurva(arregloNiveles)
        # ##############BORRAR
        # print("------------------------------------AQI SIMULADOS------------------------------------")
        # for cosa in curva:
        #     print(cosa)
        # ##############BORRAR

        response = {
            'success': True,
            'error': None,
            'message': 'Prediccion realizada exitosamente.',
            'data': {
                'cod_calidad_aire': result,
                'fechas': fechas,
                'puntos': curva
            }
        }
        return Response(response, status.HTTP_200_OK)
        # except: 
        #     response = {
        #         'success': False,
        #         'error': 0,
        #         'message': 'Error de procesamiento. Si el problema persiste, contacte con un administrador.',
        #         'data': [],
        #     }
        #     return Response(response, status.HTTP_500_INTERNAL_SERVER_ERROR)

