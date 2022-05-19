import base64
import re
from fastapi import FastAPI, File, Form, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from bs4 import BeautifulSoup as bs
from pydantic import BaseModel
from selenium import webdriver
from pymongo import MongoClient
from passlib.hash import sha256_crypt
import jwt
from tools import jwt_auth

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
spots = db.spots


@app.get("/")
async def root():
    return {"Message" : "Welcome to e-surf API"}



@app.get('/meteo/fulldata/{spot_name}')
async def test(request: Request, spot_name : str):
    error = jwt_auth(request)
    if error:
        return error
    else:
        return scrapp(spot_name)

@app.post('/users/images')
async def blabla(file: UploadFile = File(...)):
    print(file.filename)
    file_location = f"../src/assets/files/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    
    return {"pathfile": file_location.split(sep='src')[1]}

@app.get('/user/{username}/spot')
async def get_spot_user(username: str):
    res = users.find_one({"username" : username})
    return res['spot']

class User(BaseModel):
    username: str
    password: str
    spot: str = None


@app.post("/user/register/", tags=['user'])
async def create_user(body: User):
    hash_password = generate_hash(body.password)
    check_exist_user = users.find_one({"username": body.username})
    if check_exist_user is None or len(list(check_exist_user)) < 1:
        res = users.insert_one({
            "username": body.username,
            "password": hash_password,
            "spot": "Capbreton (Capbreton)"
        })

        user_id = str(res.inserted_id)

        token = encode_auth_token({
            "username": body.username,
            "password": body.password,
            "user_id": user_id
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
                "user_id": str(user["_id"])
            })

            return {
                "data": {
                    "token": token,
                    'username': body.username,
                    'spot': user['spot']
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
    check = True
    body = await request.json()
    print(body)
    document = {"images" : body['pathfile']}
    image_already_posted = users.find_one(
        {"username": body['user']}, {"images": 1, "_id": 0})
    if len(list(image_already_posted)) == 0:
        res = users.update_one({"username": body['user']}, {"$push": document})
    else:
        test = image_already_posted["images"]
        for x in test:
            if x == body['pathfile']:
                check = False
        if check :
            res = users.update_one({"username": body['user']}, {"$push": document})
        else:
            return {
                "error": {
                    "code": 400,
                    "message": "Une image portant le même nom est déjà présente"
                }
            }
    # print(res)
    return {
        "updated" : str(res.modified_count)
    }

@app.get('/user/{username}/images')
async def get_images_user(request: Request, username: str):
    error = jwt_auth(request)
    if error:
        return error
    else:
        image_already_posted = users.find_one(
        {"username": username}, {"images": 1, "_id": 0})
        if len(list(image_already_posted)) != 0:
            res = users.find_one({"username": username})["images"]
            return res
        else:
            return []

@app.get('/news')
async def get_news_from_scrapp(request: Request):
    error = jwt_auth(request)
    if error:
        return error
    else:
        return test()

@app.get('/spots')
async def get_spots():
    return [m for m in spots.find({},{"_id" : 0}).limit(20)]

@app.post('/user/spot/update')
async def update_spot_user(request: Request):
    error = jwt_auth(request)
    print(request.headers)
    body = await request.json()
    if error:
        print('coucou')
        return error
    else:
        username = body['username']
        new_spot = body['spot']
        print(username)
        print(new_spot)
        users.update_one({"username" : username}, {"$set": {"spot" : new_spot}})

def save_image(image):
    # client = MongoClient()
    # db = client.pfe
    # users = db.users
    # image_to_save = base64.b64encode(image)
    # res = users.insert_one({"image" : image_to_save})
    print(image)
    return (1)

def test():
    img_articles = []
    url_articles = []
    titles_articles = []
    driver = webdriver.Chrome("/usr/lib/chromium-browser/chromedriver")

    driver.get("https://www.surf-report.com/search.html")
    content = driver.page_source
    soup = bs(content)
    for a in soup.findAll('div', attrs={'class':'card simple'}):
        img_article = a.find('div', attrs={'class':'cover-img'})
        img_articles.append(re.findall('\((.*?)\)',img_article['style']))
        info_article_tmp = a.find('div', attrs={'class':'title'})
        info_article = info_article_tmp.find('a')
        url_articles.append(info_article['href'])
        titles_articles.append(info_article['title'])
    res = [item for sublist in img_articles for item in sublist]
    res = [ i.replace("'","") for i in res]
    # print(res[0])
    # print(res[5])
    # for x in img_articles:
    #     print(x)
    # print(res)
    # for x in url_articles:
    #     print(x)
    # for x in titles_articles:
    #     print(x)
    # print(len(res))
    # print(res)
    resultat = {}
    resultat['img'] = res
    resultat['url'] = url_articles
    resultat['titles'] = titles_articles
    data = []
    for i in range(0,len(res)):
        data.append({
            "img": resultat['img'][i],
            "url": resultat['url'][i],
            "title": resultat['titles'][i],
        })
    return data
    



def scrapp(spot_name : str):

    spot_url = spots.find_one({"name" : spot_name})['url']
    print(spot_url)
    # url = 'https://www.surfsession.com/meteo/'
    # page=urllib.request.urlopen(url,timeout=5)
    winds_forecast=[] #List to store name of the product
    winds_directions = []
    winds_speed = []
    winds_gust = []
    waves_forecast=[] #List to store price of the product
    waves_min = []
    waves_max = []
    temperatures = []
    houle_moy = []
    pressures=[] #List to store rating of the product
    hours= []
    spots_titles = []
    spots_url = []

    driver = webdriver.Chrome("/usr/lib/chromium-browser/chromedriver")

    driver.get(f"https://www.surfsession.com{spot_url}")
    content = driver.page_source
    soup = bs(content)
    # Forecast + today
    for abis in soup.find_all('a',href=True, attrs={'class':'col_a active days-forecast'}):
        wave_day = abis.find('div', attrs={'class':'waves-text-forecast'})
        wind_day = abis.find('div', attrs={'class':'wind-text-forecast'})
        waves_forecast.append(wave_day.text)
        winds_forecast.append(wind_day.text)
    for a in soup.findAll('a',href=True, attrs={'class':'col_a days-forecast'}):
        wave_week = a.find('div', attrs={'class':'waves-text-forecast'})
        wind_week = a.find('div', attrs={'class':'wind-text-forecast'})
        waves_forecast.append(wave_week.text)
        winds_forecast.append(wind_week.text)
    # Pressure
    for b in soup.find_all('div', attrs={'class' : 'col_a pressure'}):
        pressure = b.find('div', attrs={'class':'round bgPressure'})
        pressures.append(pressure.text)
    # Hours
    for c in soup.find('div', attrs={'class':'hoursForecast dimension'}):
        for d in c.find_all('div', attrs={'class':'col_a hours'}):
            hours.append(d.text)

    # Wind block
    for w in soup.find_all('div', attrs={'class':'col_a wind-direction-txt'}):
        winds_directions.append(w.text)
    for w2 in soup.find_all('div', attrs={'class':'col_a wind-speed'}):
        res = w2.find('div')
        winds_speed.append(res.text)
    for w2 in soup.find_all('div', attrs={'class':'col_a wind-gust'}):
        res = w2.find('div')
        winds_gust.append(res.text)

    # Wave block
    for w in soup.find_all('div', attrs={'class':'col_a houle-min'}):
        res = w.find('div')
        waves_min.append(res.text)
    for w in soup.find_all('div', attrs={'class':'col_a houle-max'}):
        res = w.find('div')
        waves_max.append(res.text)

    # Houle block
    for h in soup.find('div', attrs={'id':'lineHoulePrimaire'}): 
        for w2 in h.find_all('div', attrs={'class':'col_a houle-primaire'}):
            res = w2.find('div')
            houle_moy.append(res.text)

    # Temperature
    for t in soup.find_all('div', attrs={'class':'col_a temperature'}):
        res = t.find('div')
        temperatures.append(res.text)

    # Spots surf
    s = soup.find('select', attrs={'id':'spots'})
    check_exist_spots = spots.find()
    for i in s.find_all("option")[1:]:
        spot = {"name" : i.text, "url" : i['value']}
        if check_exist_spots is None or len(list(check_exist_spots)) < 1:
            res = spots.insert_one(spot)
        # spots_titles.append(i.text)
        # spots_url.append(i['value'])
        # for w in s.find_all('option'):
            # print(w)

    
    # print("Hours : ", hours)
    # print("Wind Direction : ",winds_directions)
    # print("Wind Speed : ",winds_speed)
    # print("Wind Gust : ",winds_gust)
    # print("Pressures : ",pressures)
    # print("Houle : ", houle_moy)
    # print("Temp : ", temperatures)
    resultat = {}
    resultat['hours'] = hours
    resultat['winds_forecast'] = winds_forecast
    resultat['winds_directions'] = winds_directions
    resultat['winds_speed'] = winds_speed
    resultat['winds_gust'] = winds_gust
    resultat['waves_forecast'] = waves_forecast
    resultat['temperatures'] = temperatures
    resultat['houle_moy'] = houle_moy
    resultat['pressures'] = pressures
    resultat['waves_min'] = waves_min
    resultat['waves_max'] = waves_max
    # resultat['spots_titles'] = spots_titles
    # resultat['spots_url'] = spots_url
    # print(resultat)
    return(resultat)
    # return(hours,winds_forecast,winds_directions,winds_speed,winds_gust,waves_forecast,temperatures,houle_moy,pressures)
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
        'zefjzef3421Rhréhdzjefd34',
        algorithm='HS256'
    )

if __name__ == "__main__":
    scrapp()
    # test()