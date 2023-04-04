from flask import Flask,request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import sqlalchemy.types as types
from nanoid import generate
from werkzeug.utils import secure_filename
import os

# 生成连接数据库的url
def getDBurl():
  db_conn_map = dict(      
    db_engine = 'postgresql', 
    host = 'localhost',
    port = '5432',
    user = 'postgres',
    passwd = '2718',
    db_name = 'webgisDB')

  conn_url = "{db_engine}://{user}:{passwd}@{host}:{port}/{db_name}".format(**db_conn_map)
  return conn_url


app = Flask(__name__)
url = getDBurl()
app.config["SQLALCHEMY_DATABASE_URI"] = url
app.config['UPLOAD_FOLDER'] =  os.path.abspath('files') 
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Geometry(types.TypeDecorator):
  impl = types.Text
  def process_bind_param(self, value, dialect):
      return value
  def process_result_value(self, value, dialect):
     if value is None:
        return None
     else:
        return value

# gisdocs 数据表的定义
class gisdocsModel(db.Model):
    __tablename__ = 'gisdocs'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String())
    category = db.Column(db.String())
    description = db.Column(db.Text)
    localpath = db.Column(db.String())
    webURL = db.Column(db.String()) 
    dateTime = db.Column(db.String()) 
    deleted = db.Column(db.Boolean())

    def __init__(self, formData):
        self.category = formData["category"]
        self.id = generate('1234567890abcdef', 10)
        self.name = formData["name"]
        self.description = formData["description"]
        self.dateTime = formData['dateTime']
        self.localpath = formData["localpath"]
        self.deleted = False
        self.webURL = "生成一个URL"

    def __repr__(self):
        return f"<gisdoc {self.name}>"

# 路段表定义
class splitLineModel(db.Model):
  __tablename__ = 'route_allsplit'
  gid=db.Column(db.Integer, primary_key=True)
  shape_leng = db.Column(db.Numeric)
  geom = db.Column(Geometry)

# 设施表的定义
class facilitiesModel(db.Model):
  __tablename__ = 'facilities'
  # 设施id通过 generate('1234567890', 10)来生成
  fid = db.Column(db.String, primary_key = True)
  faciname = db.Column(db.String)
  facidesc = db.Column(db.String)
  # 设施类型 如 路桥，。。。等
  facitype = db.Column(db.String)
  # 要素类型：点线面
  featuretype = db.Column(db.String)
  geom = db.Column(Geometry)

  def __init__(self, data):
    self.fid = generate('1234567890', 10)
    self.faciname = data['faciname']
    self.geom = data['geom']
    self.facitype = data['facitype']
    self.featuretype=data['featuretype']
    self.facidesc=data['facidesc']
    

# # 设施路段关联表定义
# class facitosegsModel(db.Model):
#   __tablename__ = 'facitosegs'
#   corrid = db.Column(db.String, primary_key=True)  
#   fid = db.Column(db.String)
#   gid = db.Column(db.Integer)
  
#   def __init__(self, data):
#     self.fid = data['fid']
#     self.gid = data['gid']
#     self.corrid =  generate('1234567890abcdef', 8)


# 设施与文件关联表定义
# class facitofilesModel()

@app.route('/gisdocs', methods=['POST', 'GET'])
def handle_gisdocs():
  if request.method == 'POST':
    formData = {}
    for item in request.form.items():
      formData[item[0]] = item[1]
    print(formData)

    file = request.files['file']
    saveLocalpath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
    file.save(saveLocalpath)
    formData['localpath'] = saveLocalpath

    new_gisdoc = gisdocsModel(formData)
    db.session.add(new_gisdoc)
    db.session.commit()
    return {'message': f"doc {new_gisdoc.name} 成功被添加到数据库"}
  elif request.method == 'GET':
      gisdocs = gisdocsModel.query.filter_by(deleted = False).all()
      results = [
          {
            "category": doc.category,

            "id": doc.id,
            "name": doc.name,
            "description": doc.description,
            "webURL":doc.webURL,
            "dateTime":doc.dateTime,
            "deleted":doc.deleted
          } for doc in gisdocs
      ]      
      return {"count": len(results), "gisdocs": results}

@app.route('/splitline', methods=['GET'])
def handle_splitline():
  if request.method == 'GET':
    segments = splitLineModel.query.all()
    results = [
      {
        "gid": seg.gid,
        "shape_leng":seg.shape_leng,
        "geom":seg.geom
      } for seg in segments
    ]
    return results
  

@app.route('/facilities', methods=["GET", 'POST'])
def handle_facilities():
  if request.method == "GET":
    facilities = facilitiesModel.query.all()
    results = [
      {
        "fid": faci.fid,
        "faciname":faci.faciname,
        "facidesc":faci.facidesc,
        "facitype":faci.facitype,
        "featuretype":faci.featuretype,
        "geom":faci.geom
      } for faci in facilities
    ]
    return results
  elif request.method == 'POST':
    data = dict(request.get_json())
    new_facility = facilitiesModel(data)
    db.session.add(new_facility)
    db.session.commit()
    return {'message': f"doc {new_facility.faciname} 成功被添加到数据库"}
