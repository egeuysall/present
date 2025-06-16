package handlers

import (
	"encoding/json"
	"github.com/egeuysall/present/internal/middleware"
	"github.com/egeuysall/present/internal/models"
	generated "github.com/egeuysall/present/internal/supabase/generated"
	"github.com/egeuysall/present/internal/utils"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"net/http"
)

func HandleSignup(w http.ResponseWriter, r *http.Request) {
	var req models.SignupRequest

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		utils.SendError(w, "Invalid request", http.StatusBadRequest)
		return
	}

	hash, err := utils.HashPassword(req.Password)

	if err != nil {
		utils.SendError(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	id, err := utils.Queries.InsertUser(r.Context(), generated.InsertUserParams{
		Email:          req.Email,
		HashedPassword: hash,
	})

	if err != nil {
		utils.SendError(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	token, err := utils.CreateToken(id.String())

	if err != nil {
		utils.SendError(w, "Failed to create token", http.StatusInternalServerError)
		return
	}

	utils.SetTokenCookie(w, token)
	utils.SendJson(w, "User created", http.StatusCreated)
}

func HandleSignout(w http.ResponseWriter, r *http.Request) {
	utils.ClearTokenCookie(w)
	utils.SendJson(w, "Signed out", http.StatusOK)
}

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)

	if err != nil {
		utils.SendError(w, "Invalid request", http.StatusBadRequest)
		return
	}

	userAuth, err := utils.Queries.GetUserAuth(r.Context(), req.Email)

	if err != nil {
		utils.SendError(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	err = utils.CheckPassword(userAuth.HashedPassword, req.Password)

	if err != nil {
		utils.SendError(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	token, err := utils.CreateToken(userAuth.ID.String())

	if err != nil {
		utils.SendError(w, "Failed to create token", http.StatusInternalServerError)
		return
	}

	utils.SetTokenCookie(w, token)
	utils.SendJson(w, "Logged in", http.StatusOK)
}

func HandleMe(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserIDFromContext(r.Context())

	if !ok {
		utils.SendError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	parsedUUID, err := uuid.Parse(userID)

	if err != nil {
		utils.SendError(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	var id pgtype.UUID
	err = id.Scan(parsedUUID.String())

	if err != nil {
		utils.SendError(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	user, err := utils.Queries.GetUserByID(r.Context(), id)
	
	if err != nil {
		utils.SendError(w, "User not found", http.StatusNotFound)
		return
	}

	resp := models.UserResponse{
		ID:    user.ID.String(),
		Email: user.Email,
	}

	utils.SendJson(w, resp, http.StatusOK)
}
