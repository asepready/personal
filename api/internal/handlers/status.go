package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/personal/api/internal/database"
)

// StatusResponse is the response body for GET /status.
type StatusResponse struct {
	Status   string `json:"status"`
	UptimeS  int64  `json:"uptime_seconds"`
	Database string `json:"database"` // "ok", "disabled", "error"
}

// Status returns server uptime and database status.
func Status(startTime int64, db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		uptime := int64(0)
		if startTime > 0 {
			uptime = time.Now().Unix() - startTime
		}
		dbStatus := "disabled"
		if db != nil {
			if err := db.Ping(); err != nil {
				dbStatus = "error"
			} else {
				dbStatus = "ok"
			}
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(StatusResponse{
			Status:   "ok",
			UptimeS:  uptime,
			Database: dbStatus,
		})
	}
}
