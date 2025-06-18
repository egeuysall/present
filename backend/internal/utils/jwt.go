package utils

import (
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"os"
	"time"
)

var jwtKey = []byte(os.Getenv("JWT_KEY"))
var isProd = os.Getenv("ENV") == "production"

func CreateToken(userID string) (string, error) {
	claims := jwt.RegisteredClaims{
		Subject:   userID,
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func SetTokenCookie(w http.ResponseWriter, token string) {
	cookie := &http.Cookie{
		Name:     "access_token",
		Value:    token,
		Path:     "/",
		Expires:  time.Now().Add(time.Hour),
		HttpOnly: true,
		Secure:   isProd,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, cookie)
}

func ClearTokenCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		Secure:   isProd,
		SameSite: http.SameSiteLaxMode,
	})
}
