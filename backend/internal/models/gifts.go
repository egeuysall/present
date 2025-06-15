package models

type PatchGift struct {
	Idea  *string  `json:"idea,omitempty"`
	Price *float64 `json:"price,omitempty"`
}

type GiftRequest struct {
	Idea  string  `json:"idea"`
	Price float64 `json:"price"`
}
