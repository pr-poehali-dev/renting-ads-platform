'''
Business: User authentication and registration API
Args: event with httpMethod, body, queryStringParameters; context with request_id
Returns: HTTP response with JWT token or error
'''

import json
import os
import jwt
import bcrypt
import psycopg2
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from pydantic import BaseModel, EmailStr, Field, ValidationError


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=1)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class GoogleAuthRequest(BaseModel):
    google_id: str
    email: EmailStr
    name: str
    avatar_url: Optional[str] = None


def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise Exception('DATABASE_URL not configured')
    return psycopg2.connect(database_url)


def generate_jwt(user_id: int, email: str) -> str:
    secret = os.environ.get('JWT_SECRET')
    if not secret:
        raise Exception('JWT_SECRET not configured')
    
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, secret, algorithm='HS256')


def verify_jwt(token: str) -> Optional[Dict[str, Any]]:
    secret = os.environ.get('JWT_SECRET')
    if not secret:
        return None
    
    try:
        return jwt.decode(token, secret, algorithms=['HS256'])
    except:
        return None


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    action = body_data.get('action')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if action == 'register':
            req = RegisterRequest(**body_data)
            
            cur.execute("SELECT id FROM users WHERE email = %s", (req.email,))
            existing = cur.fetchone()
            if existing:
                cur.execute("DELETE FROM users WHERE email = %s", (req.email,))
                conn.commit()
            
            password_hash = bcrypt.hashpw(req.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            cur.execute(
                "INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id",
                (req.email, password_hash, req.name)
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            
            token = generate_jwt(user_id, req.email)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user_id,
                        'email': req.email,
                        'name': req.name
                    }
                })
            }
        
        elif action == 'login':
            req = LoginRequest(**body_data)
            
            cur.execute(
                "SELECT id, email, password_hash, name, avatar_url FROM users WHERE email = %s",
                (req.email,)
            )
            user = cur.fetchone()
            
            if not user or not user[2]:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid credentials'})
                }
            
            if not bcrypt.checkpw(req.password.encode('utf-8'), user[2].encode('utf-8')):
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid credentials'})
                }
            
            token = generate_jwt(user[0], user[1])
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user[0],
                        'email': user[1],
                        'name': user[3],
                        'avatar_url': user[4]
                    }
                })
            }
        
        elif action == 'google':
            req = GoogleAuthRequest(**body_data)
            
            cur.execute("SELECT id, email, name, avatar_url FROM users WHERE google_id = %s", (req.google_id,))
            user = cur.fetchone()
            
            if user:
                user_id, email, name, avatar_url = user
            else:
                cur.execute(
                    "INSERT INTO users (email, google_id, name, avatar_url) VALUES (%s, %s, %s, %s) RETURNING id",
                    (req.email, req.google_id, req.name, req.avatar_url)
                )
                user_id = cur.fetchone()[0]
                email = req.email
                name = req.name
                avatar_url = req.avatar_url
                conn.commit()
            
            token = generate_jwt(user_id, email)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user_id,
                        'email': email,
                        'name': name,
                        'avatar_url': avatar_url
                    }
                })
            }
        
        elif action == 'verify':
            token = body_data.get('token')
            if not token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No token provided'})
                }
            
            payload = verify_jwt(token)
            if not payload:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid token'})
                }
            
            cur.execute(
                "SELECT id, email, name, avatar_url FROM users WHERE id = %s",
                (payload['user_id'],)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'user': {
                        'id': user[0],
                        'email': user[1],
                        'name': user[2],
                        'avatar_url': user[3]
                    }
                })
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'})
            }
    
    finally:
        cur.close()
        conn.close()