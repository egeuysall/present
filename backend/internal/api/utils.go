package api

import (
	"encoding/json"
	"log"
	"net/http"
)

func SendJson(w http.ResponseWriter, message interface{}, statusCode int) {
	w.WriteHeader(statusCode)

	response := map[string]interface{}{"message": message}
	err := json.NewEncoder(w).Encode(response)
	if err != nil {
		SendError(w, "Failed to encode JSON response", http.StatusInternalServerError)
	}
}

func SendError(w http.ResponseWriter, message string, statusCode int) {
	w.WriteHeader(statusCode)

	errorResponse := map[string]string{"error": message}
	err := json.NewEncoder(w).Encode(errorResponse)
	if err != nil {
		log.Printf("SendError encoding failed: %v", err)
	}
}
