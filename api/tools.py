from fastapi import Request
import jwt

def jwt_auth(req : Request):
    print("jwt_auth")
    if (req.headers.get('Authorization')):
        try :
            print(req.headers.get('Authorization'))
            token = req.headers.get('Authorization')
            payload = decode_auth_token(token)
        except jwt.exceptions.InvalidTokenError:
            return {
                "error": {
                    "code" :401,
                    "message":"Unauthorized : Invalid token" 
                }
            }
        except Exception as e:
            raise(e)

        return None
    else: 
        return {
                "error": {
                    "code" :401,
                    "message":"Unauthorized : No token"
                }
            }

def decode_auth_token(auth_token):
    """
    Decodes the auth token
    :param auth_token:
    :return: integer|string
    """
    try:
        payload = jwt.decode(auth_token, 'zefjzef3421Rhréhdzjefd34', algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError as e1:
        print(e1)
        raise e1
    except jwt.InvalidTokenError as e2:
        print(e2)
        raise e2

    
    # try:
    #     user = User.objects(
    #         username=username,
    #         password=password
    #     ).first()

    #     if user is None :
    #         return sendJson(403, "Invalid token",{})

    # # Je veux renvoyer user (ou username) à f
    # except Exception as err:
    #     return sendJson(400,str(err),args)