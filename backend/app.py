from flask import Flask, jsonify
from db import get_connection

app = Flask(__name__)

@app.route("/colaboradores", methods=["GET"])
def listar_colaboradores():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM colaboradores")
    colaboradores = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(colaboradores)

if __name__ == "__main__":
    app.run(debug=True)