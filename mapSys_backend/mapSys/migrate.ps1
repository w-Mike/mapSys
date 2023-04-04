../mapSys_venv/Scripts/activate.ps1
$env:FLASK_APP = "mapSysApp.py"
flask db init
flask db migrate
flask db upgrade