package handlers

import (
	"github.com/egeuysall/present/internal/utils"
	"net/http"
)

func HandleRoot(w http.ResponseWriter, r *http.Request) {
	utils.SendJson(w, "Welcome to the Present API, check the GitHub repository on https://github.com/egeuysall/present", http.StatusOK)
}

func CheckPing(w http.ResponseWriter, r *http.Request) {
	utils.SendJson(w, "Pong", http.StatusOK)
}
