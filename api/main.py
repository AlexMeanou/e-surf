import base64
from fastapi import FastAPI, File, Form, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from bs4 import BeautifulSoup as bs
from pydantic import BaseModel
from selenium import webdriver
from pymongo import MongoClient
from passlib.hash import sha256_crypt
import jwt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

client = MongoClient()
db = client.pfe
users = db.users


@app.get("/")
async def root():
    return {"Message" : "Welcome to e-surf API"}



@app.get('/test/app')
async def test():
    scrapp()

@app.post('/users/images')
async def blabla(file: UploadFile = File(...)):
    print(file.filename)
    file_location = f"files/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    
    return {"pathfile": file_location}

class User(BaseModel):
    username: str
    password: str


@app.post("/user/register/", tags=['user'])
async def create_user(body: User):
    hash_password = generate_hash(body.password)
    check_exist_user = users.find_one({"username": body.username})
    if check_exist_user is None or len(list(check_exist_user)) < 1:
        res = users.insert_one({
            "username": body.username,
            "password": hash_password,
        })

        user_id = str(res.inserted_id)

        token = encode_auth_token({
            "username": body.username,
            "password": body.password,
            "user_id": user_id,
            "exp": 13717209,
        })

        return {"token": token}
    else:
        return {
            "error": {
                "code": 403,
                "message": "Ce nom d'utilisateur existe déjà"
            }
        }


@app.post("/user/login/", tags=['user'])
async def login(body: User):
    # TODO : il faut récupérer le password du user qui est le hash dans le bdd
    user = users.find_one({'username': body.username})
    # print(user["password"])
    if user:
        hash = user["password"]
        if verify_hash(body.password, hash):
            token = encode_auth_token({
                "username": body.username,
                "password": body.password,
                "user_id": str(user["_id"]),
                "exp": 13717209,
            })

            return {
                "data": {
                    "token": token,
                    'username': body.username
                }
            }
        else:
            return {
                "error": {
                    "code": 403,
                    "message": "Mot de passe incorrect"
                }
            }
    else:
        return {
            "error": {
                "code": 403,
                "message": "Username incorrect"
            }
        }

@app.post('/users/update')
async def user_update(request: Request):
    body = await request.json()
    print(body)
    document = {"image" : body['pathfile']}
    res = users.insert_one(document)
    # print(res)
    return {
        "updated" : str(res.inserted_id)
    }


def save_image(image):
    # client = MongoClient()
    # db = client.pfe
    # users = db.users
    # image_to_save = base64.b64encode(image)
    # res = users.insert_one({"image" : image_to_save})
    print(image)
    return (1)




def scrapp():
    # url = 'https://www.surfsession.com/meteo/'
    # page=urllib.request.urlopen(url,timeout=5)
    winds=[] #List to store name of the product
    waves=[] #List to store price of the product
    pressures=[] #List to store rating of the product

    driver = webdriver.Chrome("/usr/lib/chromium-browser/chromedriver")

    driver.get("https://www.surfsession.com/meteo/?latitude=43.5452&longitude=-1.5513")
    content = driver.page_source
    soup = bs(content)
    for a in soup.findAll('a',href=True, attrs={'class':'col_a days-forecast'}):
        wave=a.find('div', attrs={'class':'waves-text-forecast'})
        wind=a.find('div', attrs={'class':'wind-text-forecast'})
        waves.append(wave.text)
        winds.append(wind.text)
    for b in soup.find_all('div', attrs={'class' : 'col_a pressure'}):
        pressure=b.find('div', attrs={'class':'round bgPressure'})
        pressures.append(pressure.text)

    print(winds)
    print(waves)
    print(pressures)
    # soup = bs(page)
    # # print(soup)
    # spots = [i for i in soup.findAll('div', attrs = {'class': 'waves-text-forecast'}) ]
    # print(soup.findAll('select', attrs = {'id': 'spots'}).get('option'))

    # times = soup.find_all('div', {'class': ''})
    # print(times)

def generate_hash(password):
    return sha256_crypt.hash(password)


def verify_hash(password, hash):
    return sha256_crypt.verify(password, hash)

def encode_auth_token(payload):
    """
    Generates the Auth Token
    :return: string
    """

    return jwt.encode(
        payload,
        'zefjzef3421Rhréhdzjefd34é',
        algorithm='HS256'
    )

if __name__ == "__main__":
    scrapp()