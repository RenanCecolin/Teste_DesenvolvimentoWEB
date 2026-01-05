from flask import Flask, jsonify, request
from db import get_connection
from decimal import Decimal

app = Flask(__name__)

# Listar colaboradores
@app.route("/colaboradores", methods=["GET"])
def listar_colaboradores():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM colaboradores")
    colaboradores = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(colaboradores)

# Cadastrar novos colaboradores
@app.route("/colaboradores", methods=["POST"])
def cadastrar_colaborador():
    dados = request.json

    conn = get_connection()
    cursor = conn.cursor()

    sql = """
        INSERT INTO colaboradores 
        (nome_completo, re, cargo, empresa, salario_atual, status)
        VALUES (%s, %s, %s, %s, %s, 'ATIVO')
    """

    valores = (
        dados["nome_completo"],
        dados["re"],
        dados["cargo"],
        dados["empresa"],
        dados["salario_atual"]
    )

    cursor.execute(sql, valores)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"mensagem": "Colaborador cadastrado com sucesso"}), 201


# Editar colaboradores
@app.route("/colaboradores/<int:id>", methods=["PUT"])
def editar_colaborador(id):
    dados = request.json

    conn = get_connection()
    cursor = conn.cursor()

    sql = """
        UPDATE colaboradores
        SET nome_completo = %s,
            cargo = %s,
            empresa = %s
        WHERE id = %s
    """

    cursor.execute(sql, (
        dados["nome_completo"],
        dados["cargo"],
        dados["empresa"],
        id
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"mensagem": "Colaborador atualizado com sucesso"})


# Inativar colaboradores
@app.route("/colaboradores/<int:id>/inativar", methods=["PUT"])
def inativar_colaborador(id):
    conn = get_connection()
    cursor = conn.cursor()

    sql = """
        UPDATE colaboradores
        SET status = 'INATIVO',
            data_desativacao = CURDATE()
        WHERE id = %s
    """

    cursor.execute(sql, (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"mensagem": "Colaborador inativado com sucesso"})


# Reajuste salarial (+ bonus) dos colaboradores
@app.route("/colaboradores/<int:id>/reajuste", methods=["PUT"])
def reajuste_salarial(id):
    dados = request.json
    percentual = Decimal(dados["percentual"])
    bonus = Decimal(dados.get("bonus", 0))

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT salario_atual FROM colaboradores WHERE id = %s",
        (id,)
    )
    colaborador = cursor.fetchone()

    if not colaborador:
        return jsonify({"erro": "Colaborador não encontrado"}), 404

    salario_atual = colaborador["salario_atual"]
    salario_anterior = salario_atual

    aumento = salario_atual * (percentual / Decimal(100))
    novo_salario = salario_atual + aumento

    if salario_atual < Decimal(1500):
        novo_salario += bonus

    cursor.execute("""
        UPDATE colaboradores
        SET salario_anterior = %s,
            salario_atual = %s
        WHERE id = %s
    """, (salario_anterior, novo_salario, id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "mensagem": "Reajuste aplicado com sucesso",
        "salario_anterior": salario_anterior,
        "salario_novo": novo_salario
    })

if __name__ == "__main__":
    app.run(debug=True)