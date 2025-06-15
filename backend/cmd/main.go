package main

import (
	"github.com/egeuysall/present/internal/utils"
	"log"
	"net/http"

	"github.com/egeuysall/present/internal/api"
	supabase "github.com/egeuysall/present/internal/supabase"
	generated "github.com/egeuysall/present/internal/supabase/generated"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading environment")
	}

	dbConn := supabase.Connect()
	defer dbConn.Close()

	queries := generated.New(dbConn)

	utils.Init(queries)

	router := api.Router()

	log.Printf("Server starting on http://localhost:8080")
	err = http.ListenAndServe(":8080", router)
	if err != nil {
		log.Fatal(err)
	}
}
