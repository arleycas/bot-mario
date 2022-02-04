from os import times
import time
import subprocess
from datetime import datetime

processServerWP = None
serverIsOn = 'false'
DIAS_SEMANA = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
HORA_INICIO = '06:25'  # original 07:05
# HORA_INICIO = '06:05'  # original 07:05
HORA_FIN = '8:05'  # original 8:05

print('bot de servidor activado')

while True:
    if datetime.now().strftime('%a') in DIAS_SEMANA:  # Si el día de hoy está entre L-V
        if datetime.now().strftime('%H:%M') == HORA_INICIO and serverIsOn == 'false':
            processServerWP = subprocess.Popen(['node', 'botwp'])
            serverIsOn = 'true'
            print(f'Servidor iniciado por python a las {HORA_INICIO} a.m')

        if datetime.now().strftime('%H:%M') == HORA_FIN and serverIsOn == 'true':
            processServerWP.terminate()
            serverIsOn = 'false'
            print(f'Servidor finalizado por python a las {HORA_FIN}')
    time.sleep(5)
