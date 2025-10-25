import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления галереей черепов (получение списка, добавление)
    Args: event с httpMethod, body, queryStringParameters, headers
          context с request_id
    Returns: HTTP response с данными черепов или статусом операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Auth',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    
    try:
        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT id, title, description, image_url, link_url, link_text, created_at FROM skulls ORDER BY created_at DESC')
                skulls = cur.fetchall()
                
                skulls_list = []
                for skull in skulls:
                    skulls_list.append({
                        'id': skull['id'],
                        'title': skull['title'],
                        'description': skull['description'],
                        'imageUrl': skull['image_url'],
                        'linkUrl': skull['link_url'],
                        'linkText': skull['link_text'],
                        'createdAt': skull['created_at'].isoformat() if skull['created_at'] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'skulls': skulls_list}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            headers = event.get('headers', {})
            admin_auth = headers.get('X-Admin-Auth') or headers.get('x-admin-auth')
            
            if not admin_auth or admin_auth != 'skull_admin_secret_2024':
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            title = body_data.get('title')
            description = body_data.get('description')
            image_url = body_data.get('imageUrl')
            link_url = body_data.get('linkUrl', '#')
            link_text = body_data.get('linkText', 'Подробнее')
            
            if not all([title, description, image_url]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    'INSERT INTO skulls (title, description, image_url, link_url, link_text) VALUES (%s, %s, %s, %s, %s) RETURNING id',
                    (title, description, image_url, link_url, link_text)
                )
                new_id = cur.fetchone()['id']
                conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': new_id}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()
