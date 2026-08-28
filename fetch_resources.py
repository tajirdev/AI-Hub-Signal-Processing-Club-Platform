import urllib.request
import urllib.error

try:
    with urllib.request.urlopen("http://localhost:8000/resources") as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(e.code)
    print(e.read().decode())
