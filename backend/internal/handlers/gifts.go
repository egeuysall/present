package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/egeuysall/present/internal/middleware"
	generated "github.com/egeuysall/present/internal/supabase/generated"
	"github.com/egeuysall/present/internal/utils"
	"github.com/jackc/pgx/v5/pgtype"
)

type GiftRequest struct {
	Idea  string  `json:"idea"`
	Price float64 `json:"price"`
}

func HandleGetGifts(w http.ResponseWriter, r *http.Request) {
	userIDStr, ok := middleware.GetUserIDFromContext(r.Context())
	if !ok {
		utils.SendError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var userID pgtype.UUID
	if err := userID.Scan(userIDStr); err != nil {
		utils.SendError(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	gifts, err := utils.Queries.GetGiftsByUser(r.Context(), userID)
	if err != nil {
		utils.SendError(w, "Failed to fetch gifts", http.StatusInternalServerError)
		return
	}

	utils.SendJson(w, gifts, http.StatusOK)
}

func HandlePostGifts(w http.ResponseWriter, r *http.Request) {
	userIDStr, ok := middleware.GetUserIDFromContext(r.Context())

	if !ok {
		utils.SendError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var userID pgtype.UUID
	err := userID.Scan(userIDStr)

	if err != nil {
		utils.SendError(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	var req GiftRequest
	err = json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		utils.SendError(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var price pgtype.Numeric
	err = price.Scan(req.Price)

	if err != nil {
		utils.SendError(w, "Invalid price format", http.StatusBadRequest)
		return
	}

	err = utils.Queries.CreateGift(r.Context(), generated.CreateGiftParams{
		UserID: userID,
		Idea:   req.Idea,
		Price:  price,
	})

	if err != nil {
		utils.SendError(w, "Failed to create gift", http.StatusInternalServerError)
		return
	}

	utils.SendJson(w, "Gift created", http.StatusCreated)
}

// Empty handlers to be implemented
func HandleGetGift(w http.ResponseWriter, r *http.Request) {}

func HandlePatchGifts(w http.ResponseWriter, r *http.Request) {}

func HandleDeleteGift(w http.ResponseWriter, r *http.Request) {}
