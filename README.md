## 前端

---

## 后端

运行服务器：

1. powershell 添加环境变量: `$env:FLASK_APP = "xxx.py"`
2. `flask run`

对数据表的列有更改就需要运行

```
$ flask db migrate
$ flask db upgrade