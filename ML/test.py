import requests
import time


t1 = time.time()
requests.get('https://assets.pokemon.com/assets/cms2/img/pokedex/full/252.png').content
print(time.time() - t1)


t1 = time.time()
requests.get('https://j10s006.p.ssafy.io/images/a0e6c5a0-9e7c-4f87-a2c6-65c5473c8e5f.png').content
print(time.time() - t1)