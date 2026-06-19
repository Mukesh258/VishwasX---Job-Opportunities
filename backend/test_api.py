import requests, json
r = requests.post('http://localhost:4000/api/auth/user/signin', json={'email': 'free.space2303@gmail.com', 'password': 'dummy'})
with open("api_response.json", "w") as f:
    json.dump(r.json(), f, indent=2)
print("DONE - see api_response.json")
