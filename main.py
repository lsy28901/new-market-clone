from fastapi import FastAPI,UploadFile,Form,Request,Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Annotated
import sqlite3

con = sqlite3.connect('market.db',check_same_thread=False)
cur = con.cursor()

cur.execute(f"""
             CREATE TABLE IF NOT EXISTS items(
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                image BLOB,
                price INTEGER NOT NULL,
                description TEXT ,
                place TEXT NOT NULL,
                insertAt INTEGER NOT NULL
            );
            """)

app = FastAPI()

class Chat(BaseModel):
    id:str
    content:str

chats = []

templates = Jinja2Templates(directory="frontend")

@app.post('/items')
async def create_item(image:UploadFile,
                title:Annotated[str,Form()],
                price:Annotated[int,Form()],
                description:Annotated[str,Form()],
                place:Annotated[str,Form()],
                insertAt:Annotated[int,Form()]
                ):
    image_bytes = await image.read() 
    cur.execute(f"""
                INSERT INTO items(title, image, price, description, place,insertAt)
                VALUES ('{title}','{image_bytes.hex()}',{price},'{description}','{place}',{insertAt})
                """)
    con.commit()
    return "200"

@app.get("/items")
async def get_items():
    #컬럼명도 같이 가져옴
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    rows = cur.execute(f"""
                       SELECT * FROM items ORDER BY insertAt DESC;
                       """).fetchall()
    
    return JSONResponse(jsonable_encoder(dict(row) for row in rows))
    
    
@app.get('/images/{item_id}')
async def get_image(item_id):
    cur = con.cursor()
    image_bytes = cur.execute(f"""
                              SELECT image FROM items WHERE id = {item_id}
                              """).fetchone()[0]
    
    return Response(content=bytes.fromhex(image_bytes))
    



@app.get('/chat', response_class=HTMLResponse)
def read_chat(request:Request):
    return templates.TemplateResponse("chat.html", {"request": request})

@app.post('/chat')
def create_chat(chat:Chat):
    chats.append(chat)
    return '채팅입력성공!'


@app.get("/chats")
def read_chats():
    return chats
    

app.mount("/", StaticFiles(directory="frontend",html=True), name="frontend")

