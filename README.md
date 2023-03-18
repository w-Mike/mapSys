## 前端

---

## 后端

运行服务器：

1. powershell 添加环境变量: `$env:FLASK_APP = "mapSysApp.py"`
2. `flask run`

对数据表的列有更改就需要运行

```
$ flask db migrate
$ flask db upgrade

"{"name":"161","docClass":"1556","description":"1565","localpath":"","date":"2023-03-27","time":"12:03","location":"",
"file":{"$path":""},"fileClass":"文档","dateTime":"2023-03-27 12:03"}"