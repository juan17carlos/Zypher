#!/usr/bin/env python3
"""Script para verificar valores de enums en la base de datos"""

from app.core.database import SessionLocal
from app.models.contact import Contact
from sqlalchemy import text

def check_enum_values():
    db = SessionLocal()
    try:
        # Verificar valores únicos directamente desde la BD
        print("=== Verificando valores de industry_template ===\n")
        
        result = db.execute(text("""
            SELECT industry_template, COUNT(*) as count 
            FROM contacts 
            GROUP BY industry_template 
            ORDER BY count DESC
        """))
        
        rows = result.fetchall()
        total = sum(row[1] for row in rows)
        
        print(f"Total contactos: {total}\n")
        print("Valores encontrados:")
        for industry, count in rows:
            print(f"  '{industry}': {count}")
        
        print("\n=== Valores problemáticos detectados ===")
        
        # Verificar valores con mayúsculas
        uppercase_result = db.execute(text("""
            SELECT COUNT(*) 
            FROM contacts 
            WHERE industry_template::text != LOWER(industry_template::text)
        """))
        uppercase_count = uppercase_result.scalar()
        if uppercase_count > 0:
            print(f"⚠️  Contactos con valores en mayúsculas: {uppercase_count}")
        
        # Verificar valor mal escrito "CONSTRUCTIO"
        constructio_result = db.execute(text("""
            SELECT COUNT(*) 
            FROM contacts 
            WHERE industry_template::text LIKE '%CONSTRUCTIO%'
        """))
        constructio_count = constructio_result.scalar()
        if constructio_count > 0:
            print(f"⚠️  Contactos con 'CONSTRUCTIO' (mal escrito): {constructio_count}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_enum_values()
