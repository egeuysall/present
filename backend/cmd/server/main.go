package main

import (
	"log"
	"net/http"

	"github.com/egeuysall/present/internal/api"
	supabase "github.com/egeuysall/present/internal/supabase"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading environment")
	}

	dbConn := supabase.Connect()
	defer dbConn.Close()

	router := api.Router()

	log.Printf("Server starting on https://todosapi.egeuysal.com/")
	err = http.ListenAndServe(":8080", router)

	if err != nil {
		log.Fatal(err)
	}
}
