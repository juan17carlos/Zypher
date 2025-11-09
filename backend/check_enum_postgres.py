#!/usr/bin/env python3
"""Script para verificar valores de enum en PostgreSQL"""

from app.core.database import engine
from sqlalchemy import text

def check_postgres_enum():
    with engine.connect() as conn:
        print("=== Valores en enum 'industrytemplate' de PostgreSQL ===\n")
        
        result = conn.execute(text("""
            SELECT unnest(enum_range(NULL::industrytemplate))::text as value
        """))
        
        values = [row[0] for row in result]
        
        print(f"Total de valores: {len(values)}\n")
        
        for value in values:
            print(f"  '{value}'")
        
        print("\n=== Análisis ===")
        
        # Valores esperados en minúsculas
        expected_values = [
            'generic', 'real_estate', 'medical', 'automotive', 
            'fitness', 'restaurant', 'education', 'salon', 
            'legal', 'construction'
        ]
        
        # Verificar si hay valores en mayúsculas
        uppercase_values = [v for v in values if v != v.lower()]
        if uppercase_values:
            print(f"⚠️  Valores en MAYÚSCULAS encontrados: {uppercase_values}")
        
        # Verificar valores faltantes
        missing_values = [v for v in expected_values if v not in values]
        if missing_values:
            print(f"⚠️  Valores faltantes: {missing_values}")
        
        # Verificar valores mal escritos
        if 'CONSTRUCTIO' in values:
            print(f"⚠️  Valor mal escrito encontrado: 'CONSTRUCTIO' (debería ser 'construction')")
        
        if not uppercase_values and not missing_values:
            print("✅ Todos los valores están correctos")

if __name__ == "__main__":
    check_postgres_enum()
