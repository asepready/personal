// Package spec menyajikan dokumentasi OpenAPI (Swagger) di /api/docs.
package spec

import (
	"embed"
	"io/fs"
	"net/http"
	"path"
	"strings"
)

//go:embed openapi.json index.html
var content embed.FS

// Handler mengembalikan http.Handler yang menyajikan Swagger UI dan openapi.json.
// Mount di /api/docs/ (dengan trailing slash). Request /api/docs dan /api/docs/ → index.html;
// /api/docs/openapi.json → spec.
func Handler() http.Handler {
	sub, _ := fs.Sub(content, ".")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		p := strings.TrimPrefix(path.Clean(r.URL.Path), "/")
		if p == "" || p == "." {
			p = "index.html"
		}
		if p == "openapi.json" {
			w.Header().Set("Content-Type", "application/json")
		}
		b, err := fs.ReadFile(sub, p)
		if err != nil {
			if p == "index.html" || p == "/index.html" {
				// fallback: serve index for any docs path so /api/docs works
				b, _ = fs.ReadFile(sub, "index.html")
				if b != nil {
					w.Header().Set("Content-Type", "text/html; charset=utf-8")
					w.Write(b)
					return
				}
			}
			http.NotFound(w, r)
			return
		}
		w.Write(b)
	})
}
