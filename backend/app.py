from fastapi import FastAPI, Query
from pydantic import BaseModel
#from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, GenerationConfig

from fastapi import Request, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
import io
import os
import time
import requests
import re

# import jsonify

app = FastAPI()
# React build 파일을 정적 파일로 서빙
app.mount("/static", StaticFiles(directory="./build/static"), name="static")

templates = Jinja2Templates(directory="./build")


@app.get("/", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse(
        request=request, name="index.html"
    )



@app.post('/generate-file')
async def generate_file(text: str = Form(...)):
    try:
        input_text = text
        print(input_text)
        
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Error in input processing: {e}"})

    try:
        # 외부 API에 POST 요청 보내기
        response = requests.post('http://aiyou_backend_app:8010/ai', params={'prompt': input_text})
        response.raise_for_status()  # 요청이 성공적인지 확인
        
        # 파일 이름 추출
        content_disposition = response.headers.get('Content-Disposition', '')
        filename = re.findall('filename="(.+)"', content_disposition)
        if filename:
            filename = filename[0]
        else:
            filename = 'default_filename.zip'  # 파일 이름을 찾지 못한 경우 기본 이름 설정

        # ZIP 파일을 반환하는 경우
        if response.headers['Content-Type'] == 'application/zip':
            # 응답 데이터를 바이너리 스트림으로 변환
            zip_file = io.BytesIO(response.content)

            # StreamingResponse로 클라이언트에 반환
            return StreamingResponse(zip_file, media_type='application/zip', headers={
                "Content-Disposition": f"attachment; filename={filename}"
            })

    except Exception as e:
        error_content = e.response.json() if e.response and e.response.content else {"error": "web server failed"}
        return JSONResponse(status_code=500, content=error_content)



# *****************************************************************************************************************
# @app.post('/generate-file')
# async def generate_file(text: str = Form(...)):
#     try:
#         input_text = text
#         print(input_text) 
        
#     except Exception as e:
#         return JSONResponse(status_code=500, content={"error": f"Error in input processing: {e}"})

#     try:
#         # 외부 API에 POST 요청 보내기
#         print('try')
#         response = requests.post('http://aiyou_backend_app:8000/ai', params={'prompt': input_text})
#         response.raise_for_status()  # 요청이 성공적인지 확인
    
#         # ZIP 파일을 반환하는 경우
#         if response.headers['Content-Type'] == 'application/zip':
#             # 응답 데이터를 바이너리 스트림으로 변환
#             zip_file = io.BytesIO(response.content)

#             # StreamingResponse로 클라이언트에 반환
#             return StreamingResponse(zip_file, media_type='application/zip', headers={
#                 "Content-Disposition": "attachment; filename=generated_file.zip"
#             })
#         # 다른 처리 방식이 필요할 경우 여기에 추가 로직
#         else:
#             raise HTTPException(status_code=400, detail="Unexpected content type")
#     except requests.exceptions.RequestException as e:
#         # 서버에서 발생한 에러를 클라이언트로 반환
#         error_content = e.response.json() if e.response and e.response.content else {"error": "web server failed"}
#         return JSONResponse(status_code=500, content=error_content)
# *****************************************************************************************************************    
    


















# @app.get("/getsound")
# async def get_sound():
#     file_path = "./static/sounds/audio.wav"
    
#     if not os.path.exists(file_path):
#         raise HTTPException(status_code=404, detail="Audio file not found")
    
#     return FileResponse(path=file_path, media_type="audio/wav", filename="audio.wav")

