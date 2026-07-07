from fastapi import FastAPI,Depends
from app.schemas import test
from sqlalchemy.orm import Session
from app.core.database import get_db,Base,engine
from app.models import modeltest 
Base.metadata.create_all(engine)


app = FastAPI()

@app.get('/')
def hello():
    return {"message":"hello from docker3"}

@app.post('/test')
def test_db(request:test.Test,db:Session=Depends(get_db)):
    test_new = modeltest.Test(name=request.name)
    db.add(test_new)
    db.commit()
    db.refresh(test_new)
    return test_new

@app.get('/test')
def get_test(db:Session=Depends(get_db)):
    test_return = db.query(modeltest.Test).all()

    if not test_return:
        return{"message":"no in db"}
    
    return test_return

