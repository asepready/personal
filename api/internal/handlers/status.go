package handlers

import (
	"net/http"
	"time"

	"github.com/personal/api/internal/database"
)

// StatusResponse is the response body for GET /status.
type StatusResponse struct {
	Status   string `json:"status"`
	UptimeS  int64  `json:"uptime_seconds"`
	Database string `json:"database"`
}

// Status returns server uptime and database status.
func Status(startTime int64, db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !AllowMethod(w, r, http.MethodGet) {
			return
		}
		uptime := computeUptime(startTime)
		dbStatus := resolveDBStatus(db)
		RespondJSON(w, http.StatusOK, StatusResponse{
			Status:   StatusOK,
			UptimeS:  uptime,
			Database: dbStatus,
		})
	}
}

func computeUptime(startTime int64) int64 {
	if startTime <= 0 {
		return 0
	}
	return time.Now().Unix() - startTime
}

func resolveDBStatus(db *database.DB) string {
	if db == nil {
		return DBStatusDisabled
	}
	if err := db.Ping(); err != nil {
		return DBStatusError
	}
	return DBStatusOK
}
