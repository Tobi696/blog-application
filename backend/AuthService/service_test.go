package main

import (
	"context"
	"testing"

	"github.com/Tobi696/blog-application/global"
	"github.com/Tobi696/blog-application/proto"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func Test_authServer_Login(t *testing.T) {
	global.ConnectToTestDB()
	pw, _ := bcrypt.GenerateFromPassword([]byte("example"), bcrypt.DefaultCost)
	global.DB.Collection("user").InsertOne(context.Background(), global.User{ID: primitive.NewObjectID(), Email: "test@gmail.com", Username: "Carl", Password: string(pw)})
	server := authServer{}
	_, err := server.Login(context.Background(), &proto.LoginRequest{Login: "test@gmail.com", Password: "example"})
	if err != nil {
		t.Error("1: An error was returned: ", err.Error())
	}

	_, err = server.Login(context.Background(), &proto.LoginRequest{Login: "somethign", Password: "something"})
	if err == nil {
		t.Error("2: Error was nil")
	}

	_, err = server.Login(context.Background(), &proto.LoginRequest{Login: "Carl", Password: "example"})
	if err != nil {
		t.Error("3: An error was returned: ", err.Error())
	}
}

func Test_authServer_UsernameUsed(t *testing.T) {
	global.ConnectToTestDB()
	global.DB.Collection("user").InsertOne(context.Background(), global.User{Username: "Carl"})
	server := authServer{}
	res, err := server.UsernameUsed(context.Background(), &proto.UsernameUsedRequest{Username: "Carlo"})
	if err != nil {
		t.Error("1: An error was returned: ", err.Error())
	}
	if res.GetUsed() {
		t.Error("1: Wrong result")
	}
	res, err = server.UsernameUsed(context.Background(), &proto.UsernameUsedRequest{Username: "Carl"})
	if err != nil {
		t.Error("2: An error was returned: ", err.Error())
	}
	if !res.GetUsed() {
		t.Error("2: Wrong result")
	}
}

func Test_authServer_EmailUsed(t *testing.T) {
	global.ConnectToTestDB()
	global.DB.Collection("user").InsertOne(context.Background(), global.User{Email: "carl@gmail.com"})
	server := authServer{}
	res, err := server.EmailUsed(context.Background(), &proto.EmailUsedRequest{Email: "carlo@gmail.com"})
	if err != nil {
		t.Error("1: An error was returned: ", err.Error())
	}
	if res.GetUsed() {
		t.Error("1: Wrong result")
	}
	res, err = server.EmailUsed(context.Background(), &proto.EmailUsedRequest{Email: "carl@gmail.com"})
	if err != nil {
		t.Error("2: An error was returned: ", err.Error())
	}
	if !res.GetUsed() {
		t.Error("2: Wrong result")
	}
}

func Test_authServer_Signup(t *testing.T) {
	global.ConnectToTestDB()
	global.DB.Collection("user").InsertOne(context.Background(), global.User{Username: "carl", Email: "carl@gmail.com"})
	server := authServer{}
	_, err := server.Signup(context.Background(), &proto.SignupRequest{Username: "carl", Email: "example@gmail.com", Password: "examplestring"})
	if err.Error() != "Username is used" {
		t.Error("1: No or the wrong Error was returned")
	}
	_, err = server.Signup(context.Background(), &proto.SignupRequest{Username: "example", Email: "carl@gmail.com", Password: "examplestring"})
	if err.Error() != "Email is used" {
		t.Error("2: No or the wrong Error was returned")
	}
	_, err = server.Signup(context.Background(), &proto.SignupRequest{Username: "example", Email: "example@gmail.com", Password: "examplestring"})
	if err != nil {
		t.Error("3: an error was returned")
	}
	_, err = server.Signup(context.Background(), &proto.SignupRequest{Username: "example", Email: "example@gmail.com", Password: "exam"})
	if err.Error() != "Validation failed" {
		t.Error("4: No or the wrong Error was returned")
	}
}

func Test_authServer_AuthUser(t *testing.T) {
	server := authServer{}
	res, err := server.AuthUser(context.Background(), &proto.AuthUserRequest{Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1wiSURcIjpcIjVkYmZjZWEwMDAxMjVlZWM3NWRiNzQwOVwiLFwiVXNlcm5hbWVcIjpcIkNhcmxcIixcIkVtYWlsXCI6XCJ0ZXN0QGdtYWlsLmNvbVwiLFwiUGFzc3dvcmRcIjpcIiQyYSQxMCRVUHpCREEuUnJJZ1RYcTZVcEM1aFhPS3pXcHBWRTJuUmxuTTEwaTZLRHJkd0dnZkN2Ly9sQ1wifSJ9.Gg4qouEFbxP04pz_YVg2f50xVXwqoFY758xjF-IlPuc"})
	if err != nil {
		t.Error("an error was returned")
	}
	if res.GetID() != "5dbfcea000125eec75db7409" || res.GetUsername() != "Carl" || res.GetEmail() != "test@gmail.com" {
		t.Error("wrong result returned: ", res)
	}
}
