from flask import Flask,request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from nanoid import generate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:2718@localhost:5432/webgisDB"
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class gisdocsModel(db.Model):
    __tablename__ = 'gisdocs'

    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String())
    docClass = db.Column(db.String())
    description = db.Column(db.Text)
    localpath = db.Column(db.String())
    webURL = db.Column(db.String()) 
    dateTime = db.Column(db.String()) 
    location = db.Column(db.String()) 

    def __init__(self, name, docClass, description, dateTime, location):
        self.id = generate('1234567890abcdef', 10)
        self.name = name
        self.docClass = docClass
        self.description = description
        self.localpath = "生成一个本地路径"
        self.webURL = "生成一个URL"
        self.dateTime = dateTime
        self.location = location

    def __repr__(self):
        return f"<gisdoc {self.name}>"

@app.route('/gisdocs', methods=['POST', 'GET'])
def handle_gisdocs():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            new_gisdoc = gisdocsModel(name=data['name'], docClass=data['docClass'], description=data['description'], dateTime=data['dateTime'], location=data['location'])
            db.session.add(new_gisdoc)
            db.session.commit()
            return {'message': f"doc {new_gisdoc.name} 成功被添加到数据库"}
        else:
            return {'error': "请求不是json类型数据"}
    elif request.method == 'GET':
        gisdocs = gisdocsModel.query.all()
        results = [
            {
              "name": doc.name,
              "docClass": doc.docClass,
              "description": doc.description,
              "localpath":doc.localpath,
              "webURL":doc.webURL,
              "dateTime":doc.dateTime,
              "location":doc.location
            } for doc in gisdocs
        ]      
        return {"count": len(results), "gisdocs": results}