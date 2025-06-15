package handlers

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
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

func HandleGetGift(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")

	if idStr == "" {
		utils.SendError(w, "Missing gift ID", http.StatusBadRequest)
		return
	}

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

	var giftID pgtype.UUID
	err = giftID.Scan(idStr)

	if err != nil {
		utils.SendError(w, "Invalid gift ID", http.StatusBadRequest)
		return
	}

	gift, err := utils.Queries.GetGiftByID(r.Context(), generated.GetGiftByIDParams{
		ID:     giftID,
		UserID: userID,
	})

	if err != nil {
		utils.SendError(w, "Failed to fetch gift", http.StatusInternalServerError)
		return
	}

	utils.SendJson(w, gift, http.StatusOK)
}

func HandlePatchGifts(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if id == "" {
		utils.SendError(w, "Missing gift ID", http.StatusBadRequest)
		return
	}

	userIDStr, ok := middleware.GetUserIDFromContext(r.Context())

	if !ok {
		utils.SendError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var userID, giftID pgtype.UUID

	err := userID.Scan(userIDStr)

	if err != nil {
		utils.SendError(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	err = giftID.Scan(id)

	if err != nil {
		utils.SendError(w, "Invalid gift ID", http.StatusBadRequest)
		return
	}

	existingGift, err := utils.Queries.GetGiftByID(r.Context(), generated.GetGiftByIDParams{
		ID:     giftID,
		UserID: userID,
	})

	if err != nil {
		utils.SendError(w, "Gift not found", http.StatusNotFound)
		return
	}

	type patchGift struct {
		Idea  *string  `json:"idea,omitempty"`
		Price *float64 `json:"price,omitempty"`
	}

	var payload patchGift

	err = json.NewDecoder(r.Body).Decode(&payload)

	if err != nil {
		utils.SendError(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	idea := existingGift.Idea

	if payload.Idea != nil {
		idea = *payload.Idea
	}

	price := existingGift.Price

	if payload.Price != nil {
		var newPrice pgtype.Numeric
		err := newPrice.Scan(*payload.Price)

		if err != nil {
			utils.SendError(w, "Invalid price value", http.StatusBadRequest)
			return
		}
		price = newPrice
	}

	err = utils.Queries.UpdateGiftByID(r.Context(), generated.UpdateGiftByIDParams{
		ID:     giftID,
		Idea:   idea,
		Price:  price,
		UserID: userID,
	})

	if err != nil {
		utils.SendError(w, "Failed to update gift", http.StatusInternalServerError)
		return
	}

	utils.SendJson(w, "Gift updated", http.StatusOK)
}

func HandleDeleteGift(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")

	if idStr == "" {
		utils.SendError(w, "Missing gift ID", http.StatusBadRequest)
		return
	}

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

	var giftID pgtype.UUID
	err = giftID.Scan(idStr)

	if err != nil {
		utils.SendError(w, "Invalid gift ID", http.StatusBadRequest)
		return
	}

	err = utils.Queries.DeleteGiftByID(r.Context(), generated.DeleteGiftByIDParams{
		ID:     giftID,
		UserID: userID,
	})

	if err != nil {
		utils.SendError(w, "Failed to delete gift", http.StatusInternalServerError)
		return
	}

	utils.SendJson(w, "Gift deleted", http.StatusOK)
}
