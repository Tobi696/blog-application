package global

import (
	"encoding/json"

	"github.com/dgrijalva/jwt-go"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// NilUser is the nil value for User
var NilUser User

// User is the default user struct
type User struct {
	ID       primitive.ObjectID `bson:"_id"`
	Username string             `bson:"username"`
	Email    string             `bson:"email"`
	Password string             `bson:"password"`
}

// GetToken returns the User's JWT
func (u User) GetToken() string {
	byteSlc, _ := json.Marshal(u)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"data": string(byteSlc),
	})
	tokenString, _ := token.SignedString(jwtSecret)
	return tokenString
}

// UserFromToken returns the User which is authenticated with this Token
func UserFromToken(token string) User {
	claims := jwt.MapClaims{}
	jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	var result User
	json.Unmarshal([]byte(claims["data"].(string)), &result)
	return result
}
