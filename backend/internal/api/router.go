package api

import (
	"time"

	"github.com/egeuysall/present/internal/handlers"
	appmid "github.com/egeuysall/present/internal/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
)

func Router() *chi.Mux {
	r := chi.NewRouter()

	// Global middleware
	r.Use(
		middleware.Recoverer,
		middleware.RealIP,
		middleware.Timeout(10*time.Second),
		middleware.NoCache,
		middleware.Compress(5),
		httprate.LimitByIP(3, 3*time.Second),
		appmid.SetContentType(),
		appmid.Cors(),
	)

	r.Get("/", handlers.HandleRoot)
	r.Get("/ping", handlers.CheckPing)

	r.Route("/v1", func(r chi.Router) {
		r.Post("/signup", handlers.HandleSignup)
		r.Post("/login", handlers.HandleLogin)

		r.Group(func(r chi.Router) {
			r.Use(appmid.RequireAuth())

			r.Get("/me", handlers.HandleMe)

			r.Get("/gifts", handlers.HandleGetGifts)
			r.Post("/gifts", handlers.HandlePostGifts)
			r.Get("/gifts/{id}", handlers.HandleGetGift)
			r.Patch("/gifts/{id}", handlers.HandlePatchGifts)
			r.Delete("/gifts/{id}", handlers.HandleDeleteGift)
		})
	})

	return r
}
