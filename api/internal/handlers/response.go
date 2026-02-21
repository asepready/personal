package handlers

import (
	"encoding/json"
	"net/http"
)

const (
	ContentTypeJSON = "application/json"
	StatusOK        = "ok"
)

const (
	DBStatusOK       = "ok"
	DBStatusDisabled = "disabled"
	DBStatusError    = "error"
)

// RespondJSON writes statusCode and JSON body. Does not write header if already written.
func RespondJSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", ContentTypeJSON)
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(data)
}

// RespondError writes statusCode and JSON body {"error": message}.
func RespondError(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", ContentTypeJSON)
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// AllowMethod returns false and writes 405 if r.Method != method. Use for single-method handlers.
func AllowMethod(w http.ResponseWriter, r *http.Request, method string) bool {
	if r.Method != method {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return false
	}
	return true
}

// DecodeJSON decodes request body into v. Caller should close r.Body if needed.
func DecodeJSON(r *http.Request, v interface{}) error {
	return json.NewDecoder(r.Body).Decode(v)
}
