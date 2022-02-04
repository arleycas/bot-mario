from multiprocessing import Process
import subprocess
import time
from datetime import datetime

DIAS_SEMANA = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
isRunning = 'false'
HORA_INICIO = '06:25'  # original 07:05
# HORA_INICIO = '06:05'  # original 07:05
HORA_FIN = '8:05'  # original 8:05


def ejecutarNode(arrComando):
    subprocess.run(arrComando)


print('bot de comandos activado')

while True:
    if datetime.now().strftime('%a') in DIAS_SEMANA:  # Si el día de hoy está entre L-V
        if datetime.now().strftime('%H:%M') == HORA_INICIO and isRunning == 'false':

            if __name__ == '__main__':
                isRunning = 'true'
                p1 = Process(target=ejecutarNode,
                             args=(['node', 'app', 'elk'],))
                p2 = Process(target=ejecutarNode, args=(['node', 'app'],))
                p3 = Process(target=ejecutarNode,
                             args=(['node', 'app', 'jul'],))
                p4 = Process(target=ejecutarNode,
                             args=(['node', 'app', 'jut'],))
                p5 = Process(target=ejecutarNode,
                             args=(['node', 'app', 'man'],))
                p6 = Process(target=ejecutarNode,
                             args=(['node', 'app', 'mar'],))
                p7 = Process(target=ejecutarNode,
                             args=(['node', 'app', 'cam'],))
                p8 = Process(target=ejecutarNode,
                             args=(['node', 'app', 'jua'],))
                # p9 = Process(target=ejecutarNode,
                #              args=(['node', 'app', 'ste'],))

                p1.start()
                time.sleep(5)
                p2.start()
                time.sleep(5)
                p3.start()
                time.sleep(5)
                p4.start()
                time.sleep(5)
                p5.start()
                time.sleep(5)
                p6.start()
                time.sleep(5)
                p7.start()
                time.sleep(5)
                p8.start()
                # time.sleep(5)
                # p9.start()

                p1.join()
                time.sleep(5)
                p2.join()
                time.sleep(5)
                p3.join()
                time.sleep(5)
                p4.join()
                time.sleep(5)
                p5.join()
                time.sleep(5)
                p6.join()
                time.sleep(5)
                p7.join()
                time.sleep(5)
                p8.join()
                # time.sleep(5)
                # p9.join()

                print('Python ha ejecutado todos los comandos de inicio de sesión')
                isRunning = 'false'
    time.sleep(5)
