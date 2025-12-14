import re
import sys
from pathlib import Path

def minify_css(text: str) -> str:
    # 1) Eliminar comentarios /* ... */
    text = re.sub(r"/\*[^*]*\*+(?:[^/*][^*]*\*+)*/", "", text)

    # 2) Sustituir cualquier grupo de espacios/saltos de línea por un solo espacio
    text = re.sub(r"\s+", " ", text)

    # 3) Quitar espacios alrededor de { } : ; ,
    text = re.sub(r"\s*([{};:,])\s*", r"\1", text)

    # 4) Quitar ; justo antes de }
    text = re.sub(r";}", "}", text)

    # 5) Recortar espacios al inicio y final
    return text.strip()

def main():
    if len(sys.argv) < 2:
        print("Uso: python minify_css.py entrada.css [salida.css]")
        sys.exit(1)

    in_path = Path(sys.argv[1])
    if not in_path.is_file():
        print(f"Error: no se encontró el archivo {in_path}")
        sys.exit(1)

    # Si no se indica archivo de salida, usa el mismo nombre con sufijo .min.css
    if len(sys.argv) >= 3:
        out_path = Path(sys.argv[2])
    else:
        out_path = in_path.with_suffix(".min.css")

    css_in = in_path.read_text(encoding="utf-8")
    css_out = minify_css(css_in)

    out_path.write_text(css_out, encoding="utf-8")

    print(f"Minificación completada.")
    print(f"Archivo de entrada: {in_path} ({len(css_in)} caracteres)")
    print(f"Archivo de salida:  {out_path} ({len(css_out)} caracteres)")

if __name__ == "__main__":
    main()
